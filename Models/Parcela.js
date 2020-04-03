const db = require("./db");

const Parcela = db.sequelize.define("parcelas", {
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
  }
});

module.exports = Parcela;
