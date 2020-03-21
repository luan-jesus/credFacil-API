module.exports = (sequelize, DataTypes) => {
  const Clientes = sequelize.define("clientes", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: { type: DataTypes.TEXT }
  });

  Clientes.sync();

  return Clientes;
};
