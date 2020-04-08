const db = require("./db");

const Cliente = db.sequelize.define("clientes", {
  id: { 
    type: db.Sequelize.INTEGER, 
    primaryKey: true
  },
  name: { 
    type: db.Sequelize.TEXT ,
    allowNull: false
  }
});

module.exports = Cliente;
