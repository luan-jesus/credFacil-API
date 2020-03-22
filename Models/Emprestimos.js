"use strict";

module.exports = (sequelize, DataTypes) => {
  const Emprestimos = sequelize.define("emprestimos", {
    idCliente: {
      type: DataTypes.INTEGER,
      references: {
        model: "clientes",
        key: "id"
      }
    },
    valorEmprestimo: {
      type: DataTypes.DECIMAL
    },
    numParcelas: {
      type: DataTypes.INTEGER
    }
  });

  Emprestimos.sync();

  return Emprestimos;
};
