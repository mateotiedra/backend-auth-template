var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const crypto = require('crypto');

const config = require('../config/auth.config');
const db = require('../models/db.model');
const { unexpectedErrorCatch, userNotFoundRes } = require('../helper');
const { use } = require('bcrypt/promises');

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
          res.status(201).send({
            message: 'User registered successfully! Please check your email',
          });
          // TODO : send the confirmation email here
          console.log('\nConfirmation token : ' + user.emailToken + '\n');
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

const sendEmailToken = (req, res) => {
  // TODO : create new email token
  // TODO : send the new email token to the user
};

const signInViaEmailToken = (req, res) => {
  const user = req.user;
  if (user.status === 'pending') user.status = 'active';
  user
    .save()
    .then(() => {
      res.status(200).send({
        accessToken: jwt.sign({ uuid: user.uuid }, config.secret),
      });
    })
    .catch(unexpectedErrorCatch(res));
};

const getUserBoard = (req, res) => {
  return res.status(200).send({ email: req.user.email });
};

module.exports = {
  signUp,
  signIn,
  sendEmailToken,
  signInViaEmailToken,
  getUserBoard,
};
