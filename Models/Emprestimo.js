const db = require("./db");

const Emprestimo = db.sequelize.define("emprestimos", {
  idCliente: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  idEmprestimo: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  valorEmprestimo: {
    type: db.Sequelize.DECIMAL,
    allowNull: false
  },
  valorPago: {
    type: db.Sequelize.DECIMAL,
    allowNull: false
  },
  numParcelas: {
    type: db.Sequelize.INTEGER,
    allowNull: false
  },
  numParcelasPagas: {
    type: db.Sequelize.INTEGER,
    allowNull: false
  },
  dataInicio: {
    type: db.Sequelize.DATE,
    allowNull: false
  },
  pago: {
    type: db.Sequelize.INTEGER,
    allowNull: true
  }
});

module.exports = Emprestimo;