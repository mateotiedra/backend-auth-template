unexpectedErrorCatch = (res) => (err) => {
  res.status(500).send({ message: err.message });
};

const helper = {
  unexpectedErrorCatch,
};

module.exports = helper;
