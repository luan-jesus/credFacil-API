"use strict";

module.exports = (sequelize, DataTypes) => {
  const Parcelas = sequelize.define("parcelas", {
    idEmprestimo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "emprestimos",
        key: "id"
      },
      onDelete: "CASCADE"
    },
    parcelaNum: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    valorParcela: {
      type: DataTypes.DECIMAL
    },
    cobrado: {
      type: DataTypes.BOOLEAN
    },
    valorPago: {
      type: DataTypes.DECIMAL
    },
    pago: {
      type: DataTypes.BOOLEAN
    },
    dataParcela: {
      type: DataTypes.DATE
    }
  });

  Parcelas.sync();

  return Parcelas;
};
