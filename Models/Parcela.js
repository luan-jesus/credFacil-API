const db = require("./db");
const Emprestimo = require('./Emprestimo');

const Parcela = db.sequelize.define("parcelas", {
  idCliente: {
    type: db.Sequelize.INTEGER,
    primaryKey: true
  },
  idEmprestimo: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
  },
  parcelaNum: {
    type: db.Sequelize.INTEGER,
    primaryKey: true
  },
  status: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    defaultValue: -1
  },
  valorParcela: {
    type: db.Sequelize.DECIMAL
  },
  cobrado: {
    type: db.Sequelize.BOOLEAN
  },
  valorPago: {
    type: db.Sequelize.DECIMAL
  },
  dataParcela: {
    type: db.Sequelize.DATE
  },
  idUserRecebeu: {
    type: db.Sequelize.INTEGER
  }
});

module.exports = Parcela;
