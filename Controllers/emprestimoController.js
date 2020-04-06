/** External Modules **/
var express = require("express");

/** Internal Modules **/
const Emprestimo = require("../Models/Emprestimo");
const Parcela = require("../Models/Parcela");
const db = require("../Models/db");

var router = express.Router();

const dia = 24 * 60 * 60 * 1000;

/*
 * GET
 */

/** Todos os emprestimos **/
router.get("/emprestimos", async (req, res) => {
  await db.sequelize.query(
    "SELECT 'clientes'.'name' as 'Cliente'," +
    "       'emprestimos'.'idCliente'," +
    "       'emprestimos'.'idEmprestimo'," +
    "       'emprestimos'.'valorEmprestimo'," +
    "	      'emprestimos'.'valorPago'," +
    "	      'emprestimos'.'numParcelas'," +
    "	      'emprestimos'.'numParcelasPagas'," +
    "	      'emprestimos'.'dataInicio'," +
    "	      'emprestimos'.'pago'" +
    "  FROM 'emprestimos'" +
    "  JOIN 'clientes' on 'emprestimos'.'idCliente' = 'clientes'.'id'" + 
    "  ORDER BY 'emprestimos'.'pago' ASC, 'clientes'.'name' ASC"
  ).then(ev => res.json(ev[0]));
});

router.get("/emprestimos/:idCliente/:idEmprestimo", async (req, res) => {
  const {idCliente, idEmprestimo} = req.params;
  await db.sequelize.query(
    "SELECT 'clientes'.'name'," +
    "       'emprestimos'.'idEmprestimo'," +
    "       'emprestimos'.'valorEmprestimo'," +
    "       'emprestimos'.'valorPago'," +
    "       'emprestimos'.'numParcelas'," +
    "       'emprestimos'.'numParcelasPagas'," +
    "       'emprestimos'.'dataInicio'," +
    "       'emprestimos'.'pago'" +
    " FROM  'emprestimos'" +
    " JOIN  'clientes' ON 'emprestimos'.'idCliente' = 'clientes'.'id'" +
    " WHERE 'emprestimos'.'idCliente' = " + idCliente + " AND 'emprestimos'.'idEmprestimo' = " + idEmprestimo
  ).then(async (ev) => {
    var emprestimo = ev[0][0];
    await Parcela.findAll({
      attributes: ['parcelaNum', 'valorParcela', 'cobrado', 'valorPago', 'pago', 'dataParcela', 'dataPagamento', 'idUserRecebeu'],
      where: {
        idCliente: idCliente,
        idEmprestimo: idEmprestimo
      }
    }).then(parcelas => {
      res.send({emprestimo: emprestimo, parcelas: parcelas});
    })
  });
})

/*
 * POST
 */

/** Cadastrar novo emprestimo **/
router.post("/emprestimos", async (req, res) => {
  var body = req.body;
  const transaction = await db.sequelize.transaction();
  try {
    var emprestimo;
    await Emprestimo.create(
      {
        idCliente: body.idCliente,
        valorEmprestimo: body.valorEmprestimo,
        numParcelas: body.numParcelas
      },
      { transaction: transaction }
    ).then(ev => {
      emprestimo = ev;
    });

    var today = new Date();
    for (var i = 1; i <= body.numParcelas; i++) {
      do {
        today = new Date(today.getTime() + dia);
      } while (today.getDay() == 6);

      await Parcela.create(
        {
          idEmprestimo: emprestimo.id,
          parcelaNum: i,
          valorParcela: emprestimo.valorEmprestimo / emprestimo.numParcelas,
          cobrado: false,
          valorPago: 0,
          pago: false,
          dataParcela: today
        },
        { transaction: transaction }
      );
    }

    await transaction.commit();
    res.status(201).send();
  } catch (error) {
    await transaction.rollback();
    res.status(400).send(error);
  }
});

module.exports = router;
