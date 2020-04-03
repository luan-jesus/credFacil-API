const db = require("./db");

const Status = db.sequelize.define("status", {
  statusName: { 
    type: db.Sequelize.TEXT ,
    allowNull: false
  }
});

module.exports = Status;