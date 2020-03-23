/** External Modules **/
const express = require("express");
const cors = require('cors');

/** Internal modules **/
const parcelaController = require("./Controllers/parcelaController");
const clienteController = require("./Controllers/clienteController");
const emprestimoController = require("./Controllers/emprestimoController");

/** Express setup **/
const app = express();
app.use(cors());
app.use(express.json());

/** Express routing **/
app.use("/", parcelaController);
app.use("/", clienteController);
app.use("/", emprestimoController);

/** Server deployment **/
app.listen(5000, () => console.log("Server running at port 5000"));
