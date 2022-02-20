var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const crypto = require('crypto');

const config = require('../config/auth.config');
const db = require('../models/db.model');
const { unexpectedErrorCatch } = require('../helper');

const User = db.user;
const Op = db.Sequelize.Op;

exports.signUp = (req, res) => {
  const confirmationToken = crypto.randomBytes(16).toString('hex');
  User.create({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    confirmationToken: confirmationToken,
    confirmationTokenGeneratedAt: Date.now(),
  })
    .then((user) => {
      res.status(200).send({
        message: 'User registered successfully! Please check your email',
      });
      /* nodemailer.sendConfirmationEmail(
        user.username,
        user.email,
        user.confirmationCode
      ); */
      console.log(user.confirmationToken);
    })
    .catch(unexpectedErrorCatch(res));
};

exports.confirmSignUp = (req, res) => {
  req.user.status = 'active';
  req.user.confirmationTokenGeneratedAt = 0;
  req.user
    .save()
    .then(() => {
      res.status(200).send({ message: 'Mail confirmed!' });
    })
    .catch(unexpectedErrorCatch(res));
};
