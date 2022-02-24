var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const crypto = require('crypto');

const config = require('../config/auth.config');
const db = require('../models/db.model');
const {
  unexpectedErrorCatch,
  userNotFoundRes,
} = require('../helpers/errorCatch.helper');
const mailController = require('../controllers/mail.controller');

const User = db.user;
const Op = db.Sequelize.Op;

const signUp = (req, res) => {
  // Hash the password
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    const password = hash;

    // Generate the confirmation token
    crypto.randomBytes(16, (err, buf) => {
      const emailToken = buf.toString('hex');

      // Create the user
      User.create({
        email: req.body.email,
        password: password,
        emailToken: emailToken,
        emailTokenGeneratedAt: Date.now(),
      })
        .then((user) => {
          return mailController.sendConfirmation({
            email: user.email,
            emailToken: user.emailToken,
            success: () => {
              res.status(201).send({
                message:
                  'User registered successfully! Please check your email',
              });
            },
          });
        })
        .catch(unexpectedErrorCatch(res));
    });
  });
};

const signIn = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) return userNotFoundRes(res);
      return bcrypt.compare(req.body.password, user.password, (err, same) => {
        if (same) {
          if (user.status != 'active')
            return res.status(202).send({ message: 'Mail not confirmed yet' });

          return res.status(200).send({
            accessToken: jwt.sign({ uuid: user.uuid }, config.secret),
          });
        }
        return res.status(403).send({
          message: 'Wrong email/password combination',
        });
      });
    })
    .catch(unexpectedErrorCatch(res));
};

const sendEmailToken =
  (emailType = 'confirmation') =>
  (req, res) => {
    const user = req.user;
    crypto.randomBytes(16, (err, buf) => {
      user.emailToken = buf.toString('hex');
      user.emailTokenGeneratedAt = Date.now();
      return user.save().then(() => {
        const options = {
          email: user.email,
          emailToken: user.emailToken,
          success: () => {
            return res
              .status(202)
              .send({ message: emailType + ' email sent!' });
          },
        };
        emailType === 'confirmation'
          ? mailController.sendConfirmation(options)
          : mailController.sendResetPassword(options);
      });
    });
  };

// Confirm the email
const confirmEmail = (req, res) => {
  const user = req.user;
  user.status = 'active';
  user
    .save()
    .then(() => {
      res.status(200).send({
        accessToken: jwt.sign({ uuid: user.uuid }, config.secret),
      });
    })
    .catch(unexpectedErrorCatch(res));
};

// Sign in the user if he forgot the password in order to change it -> send the access token
const recover = (req, res) => {
  const user = req.user;
  res.status(200).send({
    accessToken: jwt.sign({ uuid: user.uuid }, config.secret),
  });
};

const getUserBoard = (req, res) => {
  return res.status(200).send({ email: req.user.email });
};

module.exports = {
  signUp,
  resendConfirmation: sendEmailToken('confirmation'),
  signIn,
  resetPassword: sendEmailToken('reset'),
  confirmEmail,
  recover,
  getUserBoard,
};
