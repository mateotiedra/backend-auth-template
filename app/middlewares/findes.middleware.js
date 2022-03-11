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

const findObjectByAttribute =
  (DefinedObject, definedObjectName) => (attribute) => (req, res, next) => {
    const attributeInQueryParams = req.method === 'GET';
    if (
      (!attributeInQueryParams &&
        verifyRequestBody([attribute])(req, res, () => {})) ||
      (attributeInQueryParams === 'GET' &&
        verifyQueryParams([attribute])(req, res, () => {}))
    ) {
      return;
    }

    DefinedObject.findOne({
      where: {
        [attribute]: attributeInQueryParams
          ? req.query[attribute]
          : req.body[attribute],
      },
    })
      .then((definedObject) => {
        if (!definedObject) return objectNotFoundRes(res, 'Object');
        req[definedObjectName] = definedObject;
        next();
      })
      .catch(unexpectedErrorCatch(res));
  };

const objectFinders = {
  findUserByAttribute: findObjectByAttribute(User, 'user'),
};

module.exports = {
  findObjectByAttribute,
  ...objectFinders,
};
