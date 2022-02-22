var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const crypto = require('crypto');

const config = require('../config/auth.config');
const db = require('../models/db.model');
const { unexpectedErrorCatch } = require('../helper');

const User = db.user;
const Op = db.Sequelize.Op;

exports.signUp = (req, res) => {
  // Hash the password
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    const password = hash;

    // Generate the confirmation token
    crypto.randomBytes(16, (err, buf) => {
      const confirmationToken = buf.toString('hex');

      // Create the user
      User.create({
        email: req.body.email,
        password: password,
        confirmationToken: confirmationToken,
        confirmationTokenGeneratedAt: Date.now(),
      })
        .then((user) => {
          res.status(201).send({
            message: 'User registered successfully! Please check your email',
          });
          // TODO : send the confirmation email here
          console.log(user.confirmationToken);
        })
        .catch(unexpectedErrorCatch(res));
    });
  });
};

exports.confirmSignUp = (req, res) => {
  const user = req.user;
  user.status = 'active';
  user.confirmationTokenGeneratedAt = 0;
  user.confirmationToken = '';
  user
    .save()
    .then(() => {
      res.status(200).send({ message: 'Mail confirmed!' });
    })
    .catch(unexpectedErrorCatch(res));
};

exports.signIn = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) return res.status(404).send({ message: 'User Not found.' });
      bcrypt.compare(req.body.password, user.password, (err, same) => {});
    })
    .catch(unexpectedErrorCatch(res));
};
