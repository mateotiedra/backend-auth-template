const { unexpectedErrorCatch } = require('../helpers/errorCatch.helper');
const db = require('../models/db.model');
const User = db.user;

// Check if the attribute is already used by another user
const uniqueAttribute = (attribute) => (req, res, next) => {
  User.findOne({
    where: {
      [attribute]: req.body[attribute],
    },
  })
    .then((user) => {
      if (user) {
        return res.status(409).send({
          message: `Failed! The ${attribute} is already in use!`,
        });
      }

      next();
    })
    .catch(unexpectedErrorCatch(res));
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
  uniqueAttribute,
  validEmailToken,
};