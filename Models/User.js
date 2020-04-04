const db = require("./db");

const User = db.sequelize.define("users", {
  username: { 
    type: db.Sequelize.TEXT ,
    allowNull: false,
    unique: true
  },
  password: {
    type: db.Sequelize.TEXT ,
    allowNull: false
  },
  authLevel: { 
    type: db.Sequelize.INTEGER ,
    allowNull: false
  },
  name: {
    type: db.Sequelize.TEXT ,
    allowNull: false
  }
});

module.exports = User;
