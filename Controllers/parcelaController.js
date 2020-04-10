/** External Modules **/
var express = require("express");

/** Internal Modules **/
const Parcela = require("../Models/Parcela");
const db = require("../Models/db");

var router = express.Router();

/*
 * GET
 */

/** Todas as parcelas de hoje **/
router.get("/parcelas/today", async (req, res) => {
  var today = new Date();
  await db.sequelize.query(
    "SELECT 'clientes'.'name', " +
    "       'parcelas'.'idEmprestimo', " +
    "       'parcelas'.'parcelaNum', " +
    "       'parcelas'.'valorParcela', " +
    "       'parcelas'.'dataParcela' " +
    "FROM 'parcelas' " +
    "JOIN 'clientes' on 'parcelas'.'idCliente' = 'clientes'.'id' " +
    "WHERE 'parcelas'.'dataParcela' LIKE '" + today.toISOString().substring(0, 10) + "%' " +
    "AND 'parcelas'.'status' = -1"
  ).then(ev => {
    res.send(ev[0]) 
  }) 
});

/** Determinada parcela **/
router.get('/parcelas/:idCliente/:idEmprestimo/:parcelaNum', async (req, res) => {
  await Parcela.findOne({
    where: {
      idCliente: parseInt(req.params.idCliente),
      idEmprestimo: parseInt(req.params.idEmprestimo),
      parcelaNum: parseInt(req.params.parcelaNum)
    }
  }).then(ev => res.send(ev))
    .catch(error => res.status(400).send(error));
});

module.exports = router;
