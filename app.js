/** External Modules **/
const express = require("express");

/** Internal modules **/
const faturasController = require("./Controllers/faturasController");

/** Express setup **/
const app = express();

/** Express routing **/
app.use("/", faturasController);

/** Server deployment **/
app.listen(5000, () => console.log("Server running at port 5000"));
