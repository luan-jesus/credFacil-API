'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    authLevel: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    User.hasMany(models.parcela);
    User.hasMany(models.histomotoboy);
  };
  return User;
};