const jwt = require('jsonwebtoken');

const config = require('../config/auth.config.js');
const { unexpectedErrorCatch, userNotFoundRes } = require('../helper');
const db = require('../models/db.model');
const User = db.user;

const verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).send({
      message: 'No token provided!',
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized!',
      });
    }

    User.findOne({
      where: {
        uuid: decoded.uuid,
      },
    })
      .then((user) => {
        if (!user) return userNotFoundRes(res);
        req.user = user;
        next();
      })
      .catch(unexpectedErrorCatch(res));
  });
};

module.exports = { verifyToken };
