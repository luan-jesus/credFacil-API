/** External Modules **/
const express = require("express");

/** Internal modules **/
const faturasController = require("./Controllers/faturasController");
const clienteController = require("./Controllers/clienteController");

/** Express setup **/
const app = express();

app.use(express.json());

/** Express routing **/
app.use("/", faturasController);
app.use("/", clienteController);

/** Server deployment **/
app.listen(5000, () => console.log("Server running at port 5000"));
