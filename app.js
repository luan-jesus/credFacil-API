const express = require("express");
const app = express();
const Sequelize = require("sequelize");

// Database Connection
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.db"
});
// Database Model

const Clientes = require("./Models/Clientes")(sequelize, Sequelize);
const Emprestimos = require("./Models/Emprestimos")(sequelize, Sequelize);
const Parcelas = require("./Models/Parcelas")(sequelize, Sequelize);

// Routes
// Get parcelas
app.get("/api/parcelas", (req, res) => {
  Parcelas.findAll({
    attributes: [
      "idEmprestimo",
      "parcelaNum",
      "valorParcela",
      "cobrado",
      "valorPago",
      "pago",
      "dataParcela"
    ]
  }).then(ev => res.json(ev));
});
// Get parcelas por cliente
app.get("/api/parcelas/:idCliente", (req, res) => {
  Parcelas.findAll({
    attributes: [
      "idEmprestimo",
      "parcelaNum",
      "valorParcela",
      "cobrado",
      "valorPago",
      "pago",
      "dataParcela"
    ]
  }).then(ev => res.json(ev));
});
// Get parcela de cliente
app.get("/api/parcelas/:id/:idparcela", (req, res) => {
  Parcelas.findAll().then(ev => res.json(ev));
});

// Get clientes
app.get("/api/clientes", (req, res) => {
  Clientes.findAll({
    attributes: ["id", "name"]
  }).then(ev => res.json(ev));
});

// Get emprestimos
app.get("/api/emprestimos", (req, res) => {
  Emprestimos.findAll({
    attributes: ["id", "name"]
  }).then(ev => res.json(ev));
});

// Run server
app.listen(5000, () => console.log("Server running at port 5000"));
