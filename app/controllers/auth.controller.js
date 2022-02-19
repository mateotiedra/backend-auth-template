const db = require('../models/db.model');
const config = require('../config/auth.config');
const User = db.user;

const Op = db.Sequelize.Op;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

// Help functions
const signConfCode = (base) => {
  const characters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = base;
  for (let i = 0; i < 15; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return jwt.sign({ confirmationCode: token }, config.secret);
};

exports.signup = (req, res) => {
  User.create({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    confirmationCode: getNewConfCode(req.body.email),
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
