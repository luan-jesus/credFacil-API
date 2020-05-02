const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    username: process.env.CONECTION_DEV_USERNAME,
    password: process.env.CONECTION_DEV_PASSWORD,
    database: process.env.CONECTION_DEV_DATABASE,
    host: process.env.CONECTION_DEV_HOST,
    dialect: "postgres"
  },
  test: {
    username: process.env.CONECTION_DEV_USERNAME,
    password: process.env.CONECTION_DEV_PASSWORD,
    database: process.env.CONECTION_DEV_DATABASE,
    host: process.env.CONECTION_DEV_HOST,
    dialect: "postgres"
  },
  production: {
    username: process.env.CONECTION_PRD_USERNAME,
    password: process.env.CONECTION_PRD_PASSWORD,
    database: process.env.CONECTION_PRD_DATABASE,
    host: process.env.CONECTION_PRD_HOST,
    dialect: "postgres"
  }
};
