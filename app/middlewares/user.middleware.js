const jwt = require('jsonwebtoken');

const config = require('../config/auth.config.js');
const {
  unexpectedErrorCatch,
  userNotFoundRes,
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
        if (!user) return userNotFoundRes(res);
        req.user = user;
        verifyStatus(['active'])(req, res, next);
      })
      .catch(unexpectedErrorCatch(res));
  });
};

const verifyStatus = (allowedStatus) => (req, res, next) => {
  if (!allowedStatus.includes(req.user.status))
    return res.status(401).send({
      message:
        'The user is not allowed here, actual status : ' + req.user.status,
    });

  next();
};

const findUser = (attribute) => (req, res, next) => {
  if (attribute === 'accessToken') return verifyAccessToken(req, res, next);

  if (!req.body[attribute])
    return res
      .status(400)
      .send({ message: 'Missing attributes to find the user' });

  User.findOne({
    where: {
      [attribute]: req.body[attribute],
    },
  })
    .then((user) => {
      if (!user) return userNotFoundRes(res);
      req.user = user;
      next();
    })
    .catch(unexpectedErrorCatch(res));
};

module.exports = { verifyAccessToken, verifyStatus, findUser };