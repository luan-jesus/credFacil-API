/** External Modules **/
const express = require("express");
const dotenv = require('dotenv');
const cors = require('cors');

/** Internal modules **/
const parcelaController = require("./Controllers/parcelaController");
const clienteController = require("./Controllers/ClienteController");
const emprestimoController = require("./Controllers/emprestimoController");
const authController = require("./Controllers/authController");
const userController = require("./Controllers/userController");

dotenv.config();

/** Express setup **/
const app = express();
app.use(cors());
app.use(express.json());

/** Express routing **/
app.use("/", parcelaController);
app.use("/", clienteController);
app.use("/", emprestimoController);
app.use("/", authController);
app.use("/", userController);

/** Server deployment **/
app.listen(process.env.PORT || 5000, () => console.log(`Server is running in ${process.env.NODE_ENV} environment, on PORT ${process.env.PORT}`));

