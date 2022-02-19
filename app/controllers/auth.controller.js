var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const crypto = require('crypto');

const config = require('../config/auth.config');
const db = require('../models/db.model');

const User = db.user;
const Op = db.Sequelize.Op;

exports.signup = (req, res) => {
  User.create({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    confirmationToken: crypto.randomBytes(16).toString('hex'),
    confirmationTokenGeneratedAt: db.Sequelize.literal('CURRENT_TIMESTAMP'),
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
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
