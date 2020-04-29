'use strict';
module.exports = (sequelize, DataTypes) => {
  const Emprestimo = sequelize.define('emprestimo', {
    status: DataTypes.INTEGER,
    valorEmprestimo: DataTypes.DECIMAL,
    valorAReceber: DataTypes.DECIMAL,
    valorPago: DataTypes.DECIMAL,
    numParcelas: DataTypes.INTEGER,
    numParcelasPagas: DataTypes.INTEGER,
    dataInicio: DataTypes.DATE
  }, {});
  Emprestimo.associate = function(models) {
    Emprestimo.belongsTo(models.cliente);
    Emprestimo.hasMany(models.parcela);
    Emprestimo.hasMany(models.histomotoboy);
  };
  return Emprestimo;
};