const findOneObjectBy = (Object, where) => {
  const object = Object.findOne({ where: where })
    .then((obj) => {
      return obj;
    })
    .catch((err) => {
      return undefined;
    });

  return object;
};
