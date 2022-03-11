const {
  objectNotFoundRes,
  unexpectedErrorCatch,
} = require('../helpers/errorCatch.helper');
const {
  verifyRequestBody,
  verifyQueryParams,
} = require('./request.middleware');

const db = require('../models/db.model');
const User = db.user;
const Event = db.event;

const findObjectByAttribute =
  (DefinedObject, definedObjectName) => (attribute) => (req, res, next) => {
    const attributeInBody = Object.keys(req.body).length != 0;
    if (
      (attributeInBody && verifyRequestBody([attribute])(req, res, () => {})) ||
      verifyQueryParams([attribute])(req, res, () => {})
    ) {
      return;
    }

    DefinedObject.findOne({
      where: {
        [attribute]: attributeInBody
          ? req.body[attribute]
          : req.query[attribute],
      },
    })
      .then((definedObject) => {
        if (!definedObject) return objectNotFoundRes(res, 'Object');
        req[definedObjectName] = definedObject.dataValues;
        next();
      })
      .catch(unexpectedErrorCatch(res));
  };

const objectFinders = {
  findUserByAttribute: findObjectByAttribute(User, 'user'),
  findEventByAttribute: findObjectByAttribute(Event, 'event'),
};

module.exports = {
  findObjectByAttribute,
  ...objectFinders,
};
