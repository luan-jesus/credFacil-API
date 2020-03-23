const db = require("./db");

const Emprestimo = db.sequelize.define("emprestimos", {
  idCliente: {
    type: db.Sequelize.INTEGER,
    references: {
      model: "clientes",
      key: "id"
    }
  },
  valorEmprestimo: {
    type: db.Sequelize.DECIMAL
  },
  numParcelas: {
    type: db.Sequelize.INTEGER
  }
});

//Emprestimo.sync({force: true});

module.exports = Emprestimo;