const {
  unexpectedErrorCatch,
  userNotFoundRes,
} = require('../helpers/errorCatch.helper');
const db = require('../models/db.model');
const User = db.user;

const verifyStatus = (allowedStatus) => (req, res, next) => {
  if (!allowedStatus.includes(req.user.status))
    return res.status(401).send({ message: 'Your not allowed here' });

  next();
};

module.exports = { verifyStatus };
