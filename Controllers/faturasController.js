/** External Modules **/
var express = require("express");

/** Internal Modules **/
const db = require("../db");

var router = express.Router();

/*
 * GET
 */

/** Todas as parcelas **/
router.get("/api/parcelas", async (req, res) => {
  await db.Parcela.findAll({
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

/** Todas as parcelas de determinado cliente **/
router.get("/api/parcelas/:idCliente", async (req, res) => {
  var SSQL =
    "SELECT 'parcelas'.'idEmprestimo', " +
    "       'parcelas'.'parcelaNum'," +
    "       'parcelas'.'valorParcela'," +
    "       'parcelas'.'cobrado'," +
    "       'parcelas'.'valorPago'," +
    "       'parcelas'.'pago'," +
    "       'parcelas'.'dataParcela'," +
    "       'emprestimos'.'idCliente'" +
    "  FROM 'parcelas'" +
    "  JOIN 'emprestimos' ON 'parcelas'.'idEmprestimo' = 'emprestimos'.'Id'" +
    " WHERE 'emprestimos'.'idCliente' = " + req.params.idCliente;
  await db.sequelize
    .query(SSQL, {
      type: db.sequelize.QueryTypes.SELECT
    })
    .then(ev => res.json(ev));
});

/** Determinada parcela de Determinado cliente **/
router.get("/api/parcelas/:idCliente/:idParcela", async (req, res) => {
  var SSQL =
    "SELECT 'parcelas'.'idEmprestimo', " +
    "       'parcelas'.'parcelaNum'," +
    "       'parcelas'.'valorParcela'," +
    "       'parcelas'.'cobrado'," +
    "       'parcelas'.'valorPago'," +
    "       'parcelas'.'pago'," +
    "       'parcelas'.'dataParcela'," +
    "       'emprestimos'.'idCliente'" +
    "  FROM 'parcelas'" +
    "  JOIN 'emprestimos' ON 'parcelas'.'idEmprestimo' = 'emprestimos'.'Id'" +
    " WHERE 'emprestimos'.'idCliente' = " + req.params.idCliente +
    "   AND 'parcelas'.'parcelaNum' = " + req.params.idParcela;
  await db.sequelize
    .query(SSQL, {
      type: db.sequelize.QueryTypes.SELECT
    })
    .then(ev => res.json(ev));
});

module.exports = router;
