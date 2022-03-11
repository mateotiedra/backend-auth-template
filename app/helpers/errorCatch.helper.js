const unexpectedErrorCatch = (res) => (err) => {
  res.status(500).send({ message: 'Unexpected error : ' + err.message });
};

const objectNotFoundRes = (res, object = 'User') => {
  return res.status(404).send({ message: object + ' not found.' });
};

const uniqueAttributeErrorCatch = (res, next) => (err) => {
  if (err.name === 'SequelizeUniqueConstraintError')
    return res.status(409).send({
      message: `Failed! Attributes already in used : ${Object.keys(
        err.fields
      )}`,
    });

  next(res)(err);
};

module.exports = {
  unexpectedErrorCatch,
  uniqueAttributeErrorCatch,
  objectNotFoundRes,
};
