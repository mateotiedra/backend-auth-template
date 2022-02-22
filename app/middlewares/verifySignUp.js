const { unexpectedErrorCatch } = require('../helper');
const db = require('../models/db.model');
const User = db.user;

// Check if the attribute is already used by another user
exports.uniqueAttribute = (attribute) => (req, res, next) => {
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
exports.validConfirmationToken = (req, res, next) => {
  User.findOne({
    where: {
      confirmationToken: req.body.confirmationToken,
    },
  })
    .then((user) => {
      if (!user)
        return res
          .status(404)
          .send({ message: 'Confirmation token not found' });

      if (Date.now() - user.confirmationTokenGeneratedAt > 10 * 60 * 1000)
        return res.status(410).send({
          message: 'Confirmation token expired (+5 minutes) or already used',
        });

      req.user = user;
      next();
    })
    .catch(unexpectedErrorCatch(res));
};
