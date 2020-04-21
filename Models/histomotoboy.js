'use strict';
module.exports = (sequelize, DataTypes) => {
  const HistoMotoboy = sequelize.define('histomotoboy', {
    userId: DataTypes.INTEGER,
    data: DataTypes.DATE,
    valor: DataTypes.DECIMAL,
    parcelanum: DataTypes.INTEGER,
    emprestimoId: DataTypes.INTEGER
  }, {});
  HistoMotoboy.associate = function(models) {
    HistoMotoboy.belongsTo(models.user);
    HistoMotoboy.belongsTo(models.emprestimo);
  };
  return HistoMotoboy;
};