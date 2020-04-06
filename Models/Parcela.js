const db = require("./db");

const Parcela = db.sequelize.define("parcelas", {
  idCliente: {
    type: db.Sequelize.INTEGER,
    primaryKey: true
  },
  idEmprestimo: {
    type: db.Sequelize.INTEGER,
    primaryKey: true
  },
  parcelaNum: {
    type: db.Sequelize.INTEGER,
    primaryKey: true
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
  pago: {
    type: db.Sequelize.BOOLEAN
  },
  dataParcela: {
    type: db.Sequelize.DATE
  },
  dataPagamento: {
    type: db.Sequelize.DATE
  },
  idUserRecebeu: {
    type: db.Sequelize.INTEGER
  }
});

module.exports = Parcela;
