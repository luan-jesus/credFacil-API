'use strict';
module.exports = (sequelize, DataTypes) => {
  const Parcela = sequelize.define('parcela', {
    parcelaNum: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    valorParcela: DataTypes.DECIMAL,
    cobrado: DataTypes.BOOLEAN,
    valorPago: DataTypes.DECIMAL,
    dataParcela: DataTypes.DATE,
    semanal: DataTypes.BOOLEAN
  }, {});
  Parcela.associate = function(models) {
    Parcela.belongsTo(models.emprestimo);
    Parcela.belongsTo(models.user);
  };
  return Parcela;
};