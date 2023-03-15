/** External Modules **/
var express = require("express");

/** Internal Modules **/
const Emprestimo = require("../Models").emprestimo;
const Parcela = require("../Models").parcela;
const Cliente = require("../Models").cliente;
const sequelize = require("../Models").sequelize;
const User = require("../Models").user;
const HistoMotoboy = require("../Models").histomotoboy;
const { Op } = require("sequelize");

var router = express.Router();

function today() {
  let x = new Date();
  return new Date(x.getFullYear(), x.getMonth(), x.getDate());
}

/*
 * GET
 */

/** Todas todos os emprestimos a receber **/
router.get("/emprestimos/receber/:userId", async (req, res) => {
  const { userId } = req.params;
  const { orderBy, sort } = req.query;

  console.log([orderBy, sort]);
  var today = new Date();

  try {
    const emprestimos = await Emprestimo.findAll({
      attributes: [
        "id",
        [
          sequelize.literal(
            'sum("parcelas"."valorParcela") - sum("parcelas"."valorPago")'
          ),
          "valorReceber",
        ],
      ],
      where: {
        status: -1,
      },
      group: ["emprestimo.id", "cliente.id"],
      include: [
        {
          attributes: ["name"],
          model: Cliente,
        },
        {
          required: false,
          attributes: [],
          model: Parcela,
          where: {
            dataParcela: {
              [Op.lte]: new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
              ),
            },
            status: -1,
          },
        },
      ],
      order: [
        [
          sequelize.literal(orderBy ? `"${orderBy}"` : '"valorReceber"'),
          sort || "ASC",
        ],
      ],
    });

    const receivedToday = await HistoMotoboy.findAll({
      attributes: [
        [sequelize.fn("sum", sequelize.col("valor")), "receivedToday"],
      ],
      where: {
        userId,
        data: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      },
    });

    res.send({
      receivedToday: receivedToday[0].dataValues.receivedToday,
      emprestimos,
    });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

/** Quantidade de emprestimos em solicitação (status 5) **/
router.get("/emprestimos/solicitacao/count", async (req, res) => {
  try {
    var solicitacoes = await Emprestimo.count({
      where: {
        status: 5,
      },
    });
    res.send({ solicitacoes });
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
          attributes: ["id", "name"],
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
      where: { status: { [Op.notIn]: [-1, 5] } },
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
        clienteId: req.params.idCliente,
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

  let x = new Date();
  let today = new Date(x.getFullYear(), x.getMonth(), x.getDate());
  try {
    const numParcelasAReceber = await Parcela.count({
      where: {
        emprestimoId: idEmprestimo,
        [Op.and]: {
          status: -1,
          dataParcela: {
            [Op.lte]: today,
          },
        },
      },
    });

    const qtdAReceber = await Parcela.findAll({
      attributes: [
        [
          sequelize.literal('sum("valorParcela") - sum("valorPago")'),
          "qtdAReceber",
        ],
      ],
      where: {
        emprestimoId: idEmprestimo,
        [Op.and]: {
          status: -1,
          dataParcela: {
            [Op.lte]: today,
          },
        },
      },
    });

    const resEmp = await Emprestimo.findOne({
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
    });

    let response = resEmp.dataValues;
    response.numParcelasAReceber = numParcelasAReceber;
    response.qtdAReceber = qtdAReceber[0].dataValues.qtdAReceber;
    res.send(response);
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
  var { idCliente, valorEmprestimo } = req.body;

  if (idCliente && valorEmprestimo) {
    try {
      var emprestimoSolicitado = await Emprestimo.findOne({
        where: {
          clienteId: idCliente,
          status: 5,
        },
      });

      if (emprestimoSolicitado) {
        await emprestimoSolicitado.destroy();
      }

      await Emprestimo.create({
        clienteId: idCliente,
        valorEmprestimo: valorEmprestimo,
        dataInicio: new Date(),
        status: 5,
      });

      res.status(200).send();
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  } else {
    res.status(400).json({ error: "Missing required params" });
  }
});

/** Pagar emprestimo **/
router.post("/emprestimos/:idEmprestimo/pagar", async (req, res) => {
  const { idEmprestimo } = req.params;
  const { valorPago, userId } = req.body;

  if (!valorPago)
    return res.status(400).send({ error: "O valor pago é obrigatório." });

  if (!userId)
    return res.status(400).send({ error: "O usuário é obrigatório." });

  try {
    const parcelasReceber = await Parcela.findAll({
      where: {
        emprestimoId: idEmprestimo,
      },
      order: ["parcelaNum"],
    });

    var residuo = valorPago;

    for (var i = 0; i < parcelasReceber.length; i++) {
      var parcela = parcelasReceber[i];

      if (residuo <= 0) break;

      if (parcela.status === -1) {
        console.log(
          `Atualizando parcela ${parcela.parcelaNum}, residuo ${residuo} `
        );

        var valorPagar =
          parseFloat(parcela.valorParcela) - parseFloat(parcela.valorPago);
        var valorPagoParcela = residuo < valorPagar ? residuo : valorPagar;
        var residuoParcela =
          parseFloat(parcela.valorParcela) -
          (valorPagoParcela + parseFloat(parcela.valorPago));

        await Parcela.update(
          {
            valorPago: parseFloat(parcela.valorPago) + valorPagoParcela,
            status: 1,
            cobrado: true,
            userId,
          },
          {
            where: { id: parcela.id },
          }
        );

        await HistoMotoboy.create({
          userId,
          data: today(),
          valor: valorPagoParcela,
          parcelanum: parcela.parcelaNum,
          emprestimoId: parcela.emprestimoId,
          pago: false,
        });

        if (residuoParcela) {
          var i = 1;
          do {
            var proxParcela = await Parcela.findOne({
              where: {
                emprestimoId: parcela.emprestimoId,
                parcelaNum: parcela.parcelaNum + i,
              },
            });
            i++;

            if (proxParcela && proxParcela.status === -1) break;
          } while (proxParcela);

          if (proxParcela) {
            await Parcela.update(
              {
                valorParcela:
                  parseFloat(proxParcela.valorParcela) + residuoParcela,
              },
              {
                where: {
                  id: proxParcela.id,
                },
              }
            );
          } else {
            console.log(
              "Teve residuo e é a ultima parcela, definindo status da ultima como -1"
            );

            await Parcela.update(
              {
                status: -1,
              },
              {
                where: { id: parcela.id },
              }
            );
          }
        }
        residuo -= valorPagar;
      }
    }

    const valorPagoEmprestimo = await Parcela.findAll({
      attributes: [
        [sequelize.fn("sum", sequelize.col("valorPago")), "totalPago"],
      ],
      where: {
        emprestimoId: idEmprestimo,
      },
    });

    const numParcelasPagas = await Parcela.count({
      where: {
        emprestimoId: idEmprestimo,
        status: 1,
      },
    });

    const emprestimoParcela = await Emprestimo.findOne({
      where: {
        id: idEmprestimo,
      },
    });

    var emprestimoStatus = -1;
    if (
      parseFloat(valorPagoEmprestimo[0].dataValues.totalPago) >=
      parseFloat(emprestimoParcela.valorAReceber)
    ) {
      emprestimoStatus = 1;
    }

    await Emprestimo.update(
      {
        status: emprestimoStatus,
        valorPago: parseFloat(valorPagoEmprestimo[0].dataValues.totalPago),
        numParcelasPagas: numParcelasPagas,
      },
      {
        where: {
          id: emprestimoParcela.id,
        },
      }
    );

    res.send();
  } catch (error) {
    res.status(500).json({ error: error.toString() });
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
    diaSemana,
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
    };
  }

  var semanal = false;

  if (frequencia != 1) {
    semanal = true;
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
            semanal: semanal,
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
        attributes: ["id"],
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
