/** External Modules **/
var express = require("express");

/** Internal Modules **/
const Emprestimo = require("../Models").emprestimo;
const Parcela = require("../Models").parcela;
const Cliente = require("../Models").cliente;
const sequelize = require("../Models").sequelize;
const User = require("../Models").user;
const { Op } = require("sequelize");

var router = express.Router();

/*
 * GET
 */

/** Quantidade de emprestimos em solicitação (status 5) **/
router.get("/emprestimos/solicitacao/count", async (req, res) => {
  try {
    var solicitacoes = await Emprestimo.count({
      where: {
        status: 5
      }
    })
    res.send({solicitacoes});
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

/** Todos os emprestimos solicitados **/
router.get("/emprestimos/solicitacao", async (req, res) => {
  try {
    await Emprestimo.findAll({
      attributes: [
        "id",
        "valorEmprestimo",
        "valorEmprestimo",
        "valorAReceber",
        "valorPago",
        "numParcelas",
        "numParcelasPagas",
        "dataInicio",
        "status",
      ],
      where: {
        status: 5,
      },
      include: [
        {
          attributes: ["id","name"],
          model: Cliente,
        },
      ],
    }).then((ev) => {
      res.send(ev);
    });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});
/** Todos os emprestimos em andamento **/
router.get("/emprestimos/andamento", async (req, res) => {
  try {
    await Emprestimo.findAll({
      attributes: [
        "id",
        "valorEmprestimo",
        "valorEmprestimo",
        "valorAReceber",
        "valorPago",
        "numParcelas",
        "numParcelasPagas",
        "dataInicio",
        "status",
      ],
      where: {
        status: -1,
      },
      include: [
        {
          attributes: ["name"],
          model: Cliente,
        },
      ],
    }).then((ev) => {
      res.send(ev);
    });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

/** Todos os emprestimos **/
router.get("/emprestimos/historico", async (req, res) => {
  try {
    await Emprestimo.findAll({
      attributes: [
        "id",
        "valorEmprestimo",
        "valorEmprestimo",
        "valorAReceber",
        "valorPago",
        "numParcelas",
        "numParcelasPagas",
        "dataInicio",
        "status",
      ],
      where: { status: { [Op.notIn]:[-1,5] } },
      include: [
        {
          attributes: ["name"],
          model: Cliente,
        },
      ],
    }).then((ev) => {
      res.send(ev);
    });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

/** Todos os emprestimos de um cliente **/
router.get("/emprestimos/cliente/:idCliente", async (req, res) => {
  try {
    await Emprestimo.findAll({
      attributes: [
        "id",
        "valorEmprestimo",
        "valorEmprestimo",
        "valorAReceber",
        "valorPago",
        "numParcelas",
        "numParcelasPagas",
        "dataInicio",
        "status",
      ],
      where: {
        clienteId: req.params.idCliente
      },
      include: [
        {
          attributes: ["name"],
          model: Cliente,
        },
      ],
    }).then((ev) => {
      res.send(ev);
    });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

/** Apenas 1 emprestimo */
router.get("/emprestimos/:idEmprestimo", async (req, res) => {
  const { idEmprestimo } = req.params;

  try {
    await Emprestimo.findOne({
      attributes: [
        "id",
        "valorEmprestimo",
        "valorEmprestimo",
        "valorAReceber",
        "valorPago",
        "numParcelas",
        "numParcelasPagas",
        "dataInicio",
        "status",
      ],
      where: {
        id: idEmprestimo,
      },
      include: [
        {
          attributes: ["name"],
          model: Cliente,
        },
        {
          attributes: [
            "id",
            "parcelaNum",
            "valorParcela",
            "cobrado",
            "valorPago",
            "status",
            "dataParcela",
          ],
          model: Parcela,
          order: [["parcelaNum", "ASC"]],
          separate: true,
          include: [
            {
              attributes: ["name"],
              model: User,
              required: false,
            },
          ],
        },
      ],
    }).then((ev) => {
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



/** Solicitar emprestimo **/
router.post("/emprestimos/solicitar", async (req, res) => {
  var {
    idCliente,
    valorEmprestimo,
  } = req.body;

  if (
    idCliente &&
    valorEmprestimo
  ) {
    
    try {
      var emprestimoSolicitado = await Emprestimo.findOne({
        where: {
          clienteId: idCliente,
          status: 5
        }
      });

      if (emprestimoSolicitado) {
        await emprestimoSolicitado.destroy();
      }
      
      await Emprestimo.create({
        clienteId: idCliente,
        valorEmprestimo: valorEmprestimo,
        dataInicio: new Date(),
        status: 5
      });
      
      res.status(200).send();
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  } else {
    res.status(400).json({ error: "Missing required params" });
  }
});
/** Cadastrar novo emprestimo **/
router.post("/emprestimos", async (req, res) => {
  var {
    idCliente,
    valorEmprestimo,
    valorAReceber,
    numParcelas,
    dataInicio,
    frequencia,
    diaSemana
  } = req.body;

  if (!frequencia) {
    frequencia = 1;
  }

  if (!diaSemana) {
    diaSemana = {
      0: true,
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
    }
  }

  if (
    idCliente &&
    valorEmprestimo &&
    valorAReceber &&
    numParcelas &&
    dataInicio &&
    frequencia
  ) {
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

        if (frequencia == 1) {
          if (dataParcela.getDay() == 0) {
            dataParcela = new Date(dataParcela.getTime() + 86400000);
          }
        } else {
          while (!diaSemana[dataParcela.getDay()]) {
            dataParcela = new Date(dataParcela.getTime() + 86400000);
          }
        }

        await Parcela.create(
          {
            emprestimoId: emprestimo.id,
            parcelaNum: i,
            status: -1,
            valorParcela: emprestimo.valorAReceber / emprestimo.numParcelas,
            cobrado: false,
            valorPago: 0,
            dataParcela: new Date(
              dataParcela.getFullYear(),
              dataParcela.getMonth(),
              dataParcela.getDate()
            ),
            idUserRecebeu: null,
          },
          { transaction: transaction }
        );

        dataParcela = new Date(dataParcela.getTime() + 86400000);
      }

      await transaction.commit();
      res.status(201).send();
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: error.toString() });
    }
  } else {
    res.status(400).json({ error: "Missing required params" });
  }
});

/*
 * Delete
 */

router.delete("/emprestimos/:idEmpestimo", async (req, res) => {
  try {
    await sequelize.transaction(async (t) => {
      let EmprestimoToDelete = await Emprestimo.findOne({
        attributes: ['id'],
        where: {
          id: req.params.idEmpestimo,
        },
      });
      if (!EmprestimoToDelete) {
        res.status(404).send({ error: "Registro não encontrado" });
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
