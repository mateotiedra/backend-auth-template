exports.unexpectedErrorCatch = (res) => (err) => {
  res.status(500).send({ message: 'Unexpected error : ' + err.message });
};

exports.userNotFoundRes = (res, object = 'User') => {
  return res.status(404).send({ message: object + ' not found.' });
};
