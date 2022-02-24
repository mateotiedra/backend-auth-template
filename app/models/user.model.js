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
    password: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'disabled'),
      defaultValue: 'pending',
    },
    role: {
      type: DataTypes.ENUM('admin', 'mode', 'user'),
      defaultValue: 'user',
    },
  };

  const User = sequelize.define('user', attributes);

  return User;
};
