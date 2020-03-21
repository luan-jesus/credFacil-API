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
    },
    dataCriacao: {
      type: DataTypes.DATE
    }
  });

  Emprestimos.sync();

  return Emprestimos;
};
