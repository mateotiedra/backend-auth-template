const jwt = require('jsonwebtoken');

const config = require('../config/auth.config.js');
const {
  unexpectedErrorCatch,
  objectNotFoundRes,
} = require('../helpers/errorCatch.helper');
const db = require('../models/db.model');
const User = db.user;

const verifyAccessToken = (req, res, next) => {
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
        if (!user) return objectNotFoundRes(res);
        req.user = user;
        verifyStatus(['active'])(req, res, next);
      })
      .catch(unexpectedErrorCatch(res));
  });
};

const verifyStatus = (allowedStatus) => (req, res, next) => {
  if (!allowedStatus.includes(req.user.status))
    return res.status(403).send({
      message:
        'The user is not allowed here, actual status : ' + req.user.status,
    });

  next();
};

const verifyRole = (allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role))
    return res.status(403).send({
      message: 'The user is not allowed here, user role : ' + req.user.role,
    });

  next();
};

// Check if the confirmation token is valid
const validEmailToken = (req, res, next) => {
  User.findOne({
    where: {
      emailToken: req.body.emailToken,
    },
  })
    .then((user) => {
      if (!user)
        return res.status(404).send({ message: 'Email token does not exist' });

      if (Date.now() - user.emailTokenGeneratedAt > 10 * 60 * 1000)
        return res.status(410).send({
          message: 'Email token expired (+5 minutes) or already used',
        });

      user.emailTokenGeneratedAt = 0;
      req.user = user;
      next();
    })
    .catch(unexpectedErrorCatch(res));
};

module.exports = {
  verifyAccessToken,
  verifyStatus,
  verifyRole,
  validEmailToken,
};
