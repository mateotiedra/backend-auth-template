const db = require('../models/db.model');
const User = db.user;

// Check if the attribute is already used by another user
uniqueAttribute = (attribute) => (req, res, next) => {
  User.findOne({
    where: {
      [attribute]: req.body[attribute],
    },
  }).then((user) => {
    if (user) {
      return res.status(409).send({
        message: `Failed! The ${attribute} is already in use!`,
      });
    }

    next();
  });
};

const verifySignUp = {
  uniqueAttribute,
};

module.exports = verifySignUp;
