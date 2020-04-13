/** External Modules **/
var express = require("express");

/** Internal Modules **/
const Emprestimo = require("../Models").emprestimo;
const Parcela = require("../Models").parcela;
const Cliente = require("../Models").cliente;
const sequelize = require("../Models").sequelize;
const User = require("../Models").user;
const {Op} = require("sequelize");

var router = express.Router();


/*
 * GET
 */

/** Todos os emprestimos em andamento **/
router.get("/emprestimos/andamento", async (req, res) => {
  try{
    await Emprestimo.findAll({
      attributes: [
        'id',
        'valorEmprestimo',
        'valorEmprestimo',
        'valorAReceber',
        'valorPago',
        'numParcelas',
        'numParcelasPagas',
        'dataInicio',
        'status',
      ],
      where: {
        status: -1
      },
      include: [{
        attributes: ['name'],
        model: Cliente
      }]
    }).then(ev => {
      res.send(ev);
    });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

/** Todos os emprestimos **/
router.get("/emprestimos/historico", async (req, res) => {
  try{
    await Emprestimo.findAll({
      attributes: [
        'id',
        'valorEmprestimo',
        'valorEmprestimo',
        'valorAReceber',
        'valorPago',
        'numParcelas',
        'numParcelasPagas',
        'dataInicio',
        'status',
      ],
      where: {status: { [Op.not]: -1}},
      include: [{
        attributes: ['name'],
        model: Cliente
      }]
    }).then(ev => {
      res.send(ev);
    });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

/** Apenas 1 emprestimo */
router.get("/emprestimos/:idEmprestimo", async (req, res) => {
  const { idEmprestimo } = req.params;

  try{
    await Emprestimo.findOne({
      attributes: [
        'id',
        'valorEmprestimo',
        'valorEmprestimo',
        'valorAReceber',
        'valorPago',
        'numParcelas',
        'numParcelasPagas',
        'dataInicio',
        'status',
      ],
      where: {
        id: idEmprestimo
      },
      include: [
        {
          attributes: ['name'],
          model: Cliente
        },
        {
          attributes: [
            'id',
            'parcelaNum',
            'valorParcela',
            'cobrado',
            'valorPago',
            'status',
            'dataParcela'
          ],
          model: Parcela,
          order: [["parcelaNum", "ASC"]],
          separate: true,
          include: [{
            attributes: ['name'],
            model: User,
            required: false,
          }]
        }
      ]
    }).then(ev => {
      res.send(ev);
    });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

/*
 * POST
 *
 * @Param idCliente
 * @Param valorEmprestimo
 * @Param valorAReceber
 * @Param numParcelas
 * @Param dataInicio
 */

/** Cadastrar novo emprestimo **/
router.post("/emprestimos", async (req, res) => {
  var {
    idCliente,
    valorEmprestimo,
    valorAReceber,
    numParcelas,
    dataInicio,
  } = req.body;
  const transaction = await sequelize.transaction();
  try {
    var emprestimo;
    await Emprestimo.create(
      {
        clienteId: idCliente,
        valorEmprestimo: valorEmprestimo,
        valorAReceber: valorAReceber,
        numParcelas: numParcelas,
        dataInicio: dataInicio,
        status: -1,
        valorPago: 0,
        numParcelasPagas: 0,
      },
      { transaction: transaction }
    ).then((ev) => {
      emprestimo = ev;
    });

    var dataParcela = new Date(dataInicio);
    for (var i = 1; i <= numParcelas; i++) {
      await Parcela.create(
        {
          emprestimoId: emprestimo.id,
          parcelaNum: i,
          status: -1,
          valorParcela: emprestimo.valorAReceber / emprestimo.numParcelas,
          cobrado: false,
          valorPago: 0,
          dataParcela: new Date(dataParcela.getFullYear(), dataParcela.getMonth(), dataParcela.getDate()),
          idUserRecebeu: null,
        },
        { transaction: transaction }
      );

      do {
        dataParcela = new Date(dataParcela.getTime() + 86400000);
      } while (dataParcela.getDay() == 0);
    }

    await transaction.commit();
    res.status(201).send();
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.toString() });
  }
});

/*
 * Delete
 */

router.delete("/emprestimos/:idEmpestimo", async (req, res) => {
  try {
    await sequelize.transaction(async (t) => {
      let EmprestimoToDelete = await Emprestimo.findOne({
        where: {
          id: req.params.idEmpestimo,
        },
      })
      if (!EmprestimoToDelete) {
        res.status(404).send("Record not found");
      } else {
        await EmprestimoToDelete.destroy({ transaction: t }).then(() => {
          res.status(200).send();
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
