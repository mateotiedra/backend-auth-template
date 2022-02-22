module.exports = (sequelize, DataTypes) => {
  const attributes = {
    // Auth attributes
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailToken: {
      type: DataTypes.STRING,
    },
    emailTokenGeneratedAt: {
      type: DataTypes.BIGINT,
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'disabled'),
      defaultValue: 'pending',
    },
    password: {
      type: DataTypes.STRING,
    },
  };

  const User = sequelize.define('user', attributes);

  return User;
};
