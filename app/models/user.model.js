module.exports = (sequelize, DataTypes) => {
  const attributes = {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
    },
    confirmationCode: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  };

  const User = sequelize.define('user', attributes);

  return User;
};
