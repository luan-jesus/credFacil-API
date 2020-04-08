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
  status: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    defaultValue: -1
  },
  valorEmprestimo: {
    type: db.Sequelize.DECIMAL,
    allowNull: false
  },
  valorAReceber: {
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
  }
});

module.exports = Emprestimo;