/** External Modules **/
var express = require("express");

/** Internal Modules **/
const Parcela = require("../Models/Parcela");

var router = express.Router();

/*
 * GET
 */

/** Todas as parcelas de hoje **/
router.get("/parcelas/today", async (req, res) => {
  var today = new Date();
  await Parcela.findAll({
    attributes: [
      "idEmprestimo",
      "parcelaNum",
      "valorParcela",
      "cobrado",
      "valorPago",
      "pago",
      "dataParcela"
    ],
    where: {
      dataParcela: new Date(today.getFullYear(), today.getMonth(), today.getDate())
    }
  }).then(ev => res.json(ev));
});

/** Todas as parcelas de determinado Emprestimo **/
router.get("/parcelas/:idEmprestimo", async (req, res) => {
  await Parcela.findAll({
    attributes: [
      "idEmprestimo",
      "parcelaNum",
      "valorParcela",
      "cobrado",
      "valorPago",
      "pago",
      "dataParcela"
    ],
    where: {
      idEmprestimo: req.params.idEmprestimo
    }
  }).then(ev => res.json(ev))
    .catch(error => res.status(400).send(error));
});

module.exports = router;
