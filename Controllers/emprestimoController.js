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

/** Todos os emprestimos em andamento **/
router.get("/emprestimos/andamento", async (req, res) => {
  await db.sequelize.query(
    "SELECT 'clientes'.'name' as 'Cliente'," +
    "       'emprestimos'.'idCliente'," +
    "       'emprestimos'.'idEmprestimo'," +
    "       'emprestimos'.'valorEmprestimo'," +
    "       'emprestimos'.'valorAReceber'," +
    "	      'emprestimos'.'valorPago'," +
    "	      'emprestimos'.'numParcelas'," +
    "	      'emprestimos'.'numParcelasPagas'," +
    "	      'emprestimos'.'dataInicio'," +
    "	      'emprestimos'.'status'" +
    "  FROM 'emprestimos'" +
    "  JOIN 'clientes' on 'emprestimos'.'idCliente' = 'clientes'.'id'" + 
    " WHERE 'emprestimos'.'status' = -1" + 
    "  ORDER BY 'emprestimos'.'dataInicio' DESC, 'clientes'.'name' ASC"
  ).then(ev => res.json(ev[0]));
});

/** Todos os emprestimos **/
router.get("/emprestimos/historico", async (req, res) => {
  await db.sequelize.query(
    "SELECT 'clientes'.'name' as 'Cliente'," +
    "       'emprestimos'.'idCliente'," +
    "       'emprestimos'.'idEmprestimo'," +
    "       'emprestimos'.'valorEmprestimo'," +
    "       'emprestimos'.'valorAReceber'," +
    "	      'emprestimos'.'valorPago'," +
    "	      'emprestimos'.'numParcelas'," +
    "	      'emprestimos'.'numParcelasPagas'," +
    "	      'emprestimos'.'dataInicio'," +
    "	      'emprestimos'.'status'" +
    "  FROM 'emprestimos'" +
    "  JOIN 'clientes' on 'emprestimos'.'idCliente' = 'clientes'.'id'" + 
    " WHERE 'emprestimos'.'status' <> -1" + 
    "  ORDER BY 'emprestimos'.'dataInicio' DESC, 'clientes'.'name' ASC"
  ).then(ev => res.json(ev[0]));
});

router.get("/emprestimos/:idCliente/:idEmprestimo", async (req, res) => {
  const {idCliente, idEmprestimo} = req.params;
  await db.sequelize.query(
    "SELECT 'clientes'.'name'," +
    "       'emprestimos'.'idEmprestimo'," +
    "       'emprestimos'.'valorEmprestimo'," +
    "       'emprestimos'.'valorAReceber'," +
    "       'emprestimos'.'valorPago'," +
    "       'emprestimos'.'numParcelas'," +
    "       'emprestimos'.'numParcelasPagas'," +
    "       'emprestimos'.'dataInicio'," +
    "       'emprestimos'.'status'" +
    " FROM  'emprestimos'" +
    " JOIN  'clientes' ON 'emprestimos'.'idCliente' = 'clientes'.'id'" +
    " WHERE 'emprestimos'.'idCliente' = " + idCliente + " AND 'emprestimos'.'idEmprestimo' = " + idEmprestimo
  ).then(async (ev) => {
    var emprestimo = ev[0][0];
    await Parcela.findAll({
      attributes: ['parcelaNum', 'valorParcela', 'cobrado', 'valorPago', 'status', 'dataParcela', 'idUserRecebeu'],
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
  var {idCliente, valorEmprestimo, valorAReceber, numParcelas, dataInicio} = req.body;
  const transaction = await db.sequelize.transaction();
  try {
    var emprestimo;

    await Emprestimo.max('idEmprestimo', { where: { idCliente: idCliente }})
      .then(async id => {
        await Emprestimo.create(
          {
            idCliente: idCliente,
            idEmprestimo: id ? id + 1 : 1,
            valorEmprestimo: valorEmprestimo,
            valorAReceber: valorAReceber,
            numParcelas: numParcelas,
            dataInicio: dataInicio,
            status: -1,
            valorPago: 0,
            numParcelasPagas: 0
          },
          { transaction: transaction }
        ).then(ev => {
          emprestimo = ev;
        });
      });

    var dataParcela = new Date(dataInicio);
    for (var i = 1; i <= numParcelas; i++) {
      await Parcela.create(
        {
          idCliente: emprestimo.idCliente,
          idEmprestimo: emprestimo.idEmprestimo,
          parcelaNum: i,
          status: -1,
          valorParcela: emprestimo.valorAReceber / emprestimo.numParcelas,
          cobrado: false,
          valorPago: 0,
          dataParcela: dataParcela,
          idUserRecebeu: null
        },
        { transaction: transaction }
      );

      do {
        dataParcela = new Date(dataParcela.getTime() + dia);
      } while (dataParcela.getDay() == 6);
    }

    await transaction.commit();
    res.status(201).send();
  } catch (error) {
    await transaction.rollback();
    res.status(400).send(error);
  }
});

module.exports = router;
