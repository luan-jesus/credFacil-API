/** External Modules **/
var express = require("express");
var { Op } = require("sequelize");

/** Internal Modules **/
const Parcela = require("../Models").parcela;
const Cliente = require("../Models").cliente;
const Emprestimo = require("../Models").emprestimo;
const User = require("../Models").user;
const HistoMotoboy = require("../Models").histomotoboy;
const sequelize = require("../Models").sequelize;

var router = express.Router();

function today() {
  let x = new Date();
  return new Date(x.getFullYear(), x.getMonth(), x.getDate());
}

/*
 * GET
 */

/** Determinada parcela **/
router.get("/parcelas/:parcelaId", async (req, res) => {
  try {
    await Parcela.findOne({
      attributes: [
        "id",
        "parcelaNum",
        "status",
        "valorParcela",
        "cobrado",
        "valorPago",
        "dataParcela",
      ],
      where: {
        id: parseInt(req.params.parcelaId),
      },
      include: [
        {
          attributes: ["name"],
          model: User,
          required: false,
        },
        {
          attributes: ["id"],
          model: Emprestimo,
          include: [
            {
              attributes: ["name"],
              model: Cliente,
            },
          ],
        },
      ],
    }).then((ev) => res.send(ev));
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

/** POST - Receber parcela */
router.post("/parcelas/:parcelaId/receber", async (req, res) => {
  const { parcelaId } = req.params;
  const { valorParcela, valorPago, cobrado, userId } = req.body;

  try {
    var parcelaAReceber = await Parcela.findOne({
      where: {
        id: parcelaId,
      },
    });

    if (!parcelaAReceber)
      return res.status(400).send({ error: "Parcela não encontrada" });

    var statusParcela = cobrado ? 1 : -1;
    var residuo = parseFloat(parcelaAReceber.valorParcela) - valorPago;

    if (residuo != 0 && cobrado) {
      var i = 1;
      do {
        var proxParcela = await Parcela.findOne({
          where: {
            emprestimoId: parcelaAReceber.emprestimoId,
            parcelaNum: parcelaAReceber.parcelaNum + i,
          },
        });
        i++;

        if (proxParcela && proxParcela.status === -1) break;
      } while (proxParcela);

      if (proxParcela) {
        if (parseFloat(proxParcela.valorParcela) + residuo <= 0)
          return res
            .status(400)
            .json({
              error:
                "O valor pago excedeu o valor da próxima parcela, para que a parcela não seja anulada, adicione o valor de cada parcela manualmente.",
            });

        await Parcela.update(
          {
            valorParcela: parseFloat(proxParcela.valorParcela) + residuo,
          },
          {
            where: {
              id: proxParcela.id,
            },
          }
        );
      } else {
        statusParcela = -1;
      }
    }

    if (residuo <= 0) statusParcela = 1;

    await Parcela.update(
      {
        valorParcela: valorParcela || parcelaAReceber.valorParcela,
        valorPago: valorPago,
        cobrado: cobrado,
        userId: userId,
        status: statusParcela,
      },
      {
        where: {
          id: parcelaAReceber.id,
        },
      }
    );

    if (cobrado === true) {
      await HistoMotoboy.create({
        userId: userId,
        data: today(),
        valor: valorPago,
        parcelanum: parcelaAReceber.parcelaNum,
        emprestimoId: parcelaAReceber.emprestimoId,
        pago: false
      });
    } else if (cobrado === false) {
      // Se atualizar a parcela, e setar cobrado como falso, limpa todo histórico da parcela

      await HistoMotoboy.destroy({
        where: {
          parcelanum: parcelaAReceber.parcelaNum,
          emprestimoId: parcelaAReceber.emprestimoId,
        }
      });
    }

    const valorPagoEmprestimo = await Parcela.findAll({
      attributes: [
        [sequelize.fn("sum", sequelize.col("valorPago")), "totalPago"],
      ],
      where: {
        emprestimoId: parcelaAReceber.emprestimoId,
      },
    });

    const numParcelasPagas = await Parcela.count({
      where: {
        emprestimoId: parcelaAReceber.emprestimoId,
        status: 1,
      },
    });

    const emprestimoParcela = await Emprestimo.findOne({
      where: {
        id: parcelaAReceber.emprestimoId,
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

    return res.status(200).send();
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
});

/** Delete Parcela */
router.delete("/parcelas/:parcelaId", async (req, res) => {
  const { parcelaId } = req.params;

  var parcelaADeletar = await Parcela.findOne({
    where: {
      id: parcelaId,
    },
  });

  if (!parcelaADeletar) {
    res.status(404).send({ error: "Parcela não encontrada" });
  } else {
    try {
      await parcelaADeletar.destroy();
      await RecalcParcelas(parcelaADeletar.emprestimoId);
      await sleep(1000);
      await RecalcEmprestimo(parcelaADeletar.emprestimoId);
      res.status(200).send();
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  }
});

module.exports = router;
