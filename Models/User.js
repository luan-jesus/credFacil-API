const db = require("./db");

const User = db.sequelize.define("users", {
  username: { 
    type: db.Sequelize.TEXT ,
    allowNull: false
  },
  password: { 
    type: db.Sequelize.TEXT ,
    allowNull: false
  },
  authLevel: { 
    type: db.Sequelize.INTEGER ,
    allowNull: false
  }
});

module.exports = User;
