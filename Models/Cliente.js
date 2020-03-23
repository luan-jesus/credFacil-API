const db = require("./db");

const Cliente = db.sequelize.define("clientes", {
  id: { type: db.Sequelize.INTEGER, primaryKey: true },
  name: { type: db.Sequelize.TEXT }
});

//Cliente.sync({force: true});

module.exports = Cliente;
