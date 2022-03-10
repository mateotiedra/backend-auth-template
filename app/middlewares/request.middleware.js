const verifyRequestBody = (requiredBodyKeys) => (req, res, next) => {
  const bodyKeys = Object.keys(req.body);
  const missingKeys = requiredBodyKeys.filter((n) => !bodyKeys.includes(n));
  if (missingKeys.length)
    return res
      .status(400)
      .send({ message: 'Bad request. Missing key(s) : ' + missingKeys });

  next();
};

module.exports = { verifyRequestBody };
