const db = {};

db.Sequelize = require("sequelize");

/** Database Connection **/
db.sequelize = new db.Sequelize({
  dialect: "sqlite",
  storage: "./database.db"
});

db.Cliente = require("./Models/Clientes")(db.sequelize, db.Sequelize);
db.Emprestimo = require("./Models/Emprestimos")(db.sequelize, db.Sequelize);
db.Parcela = require("./Models/Parcelas")(db.sequelize, db.Sequelize);

module.exports = db;
