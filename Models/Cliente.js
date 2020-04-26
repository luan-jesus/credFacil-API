'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cliente = sequelize.define('cliente', {
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  Cliente.associate = function(models) {
    Cliente.hasMany(models.emprestimo);
  };
  return Cliente;
};