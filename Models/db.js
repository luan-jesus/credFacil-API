const db = {};

db.Sequelize = require("sequelize");

/** Database Connection **/
db.sequelize = new db.Sequelize({
  dialect: "sqlite",
  storage: "./database.db"
});

module.exports = db;
