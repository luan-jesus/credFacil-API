const db = require("./db");

const Emprestimo = db.sequelize.define("emprestimos", {
  idCliente: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "clientes",
      key: "id"
    }
  },
  valorEmprestimo: {
    type: db.Sequelize.DECIMAL,
    allowNull: false
  },
  numParcelas: {
    type: db.Sequelize.INTEGER,
    allowNull: false
  },
  dataInicio: {
    type: db.Sequelize.DATE,
    allowNull: false
  },
  status: {
    type: db.Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: "statuses",
      key: "id"
    }
  }
});

module.exports = Emprestimo;