/** External Modules **/
var express = require("express");
var { Op } = require('sequelize');

/** Internal Modules **/
const Parcela = require("../Models").parcela;
const Cliente = require("../Models").cliente;
const Emprestimo = require("../Models").emprestimo;
const User = require("../Models").user;
const sequelize = require("../Models").sequelize;

var router = express.Router();

/*
 * GET
 */

/** Todas as parcelas de hoje ainda não pagas **/
router.get("/parcelas/today", async (req, res) => {
  var today = new Date();

  try {
    await Parcela.findAll({
      attributes: ["id", "parcelaNum", "valorParcela", "dataParcela"],
      where: {
        dataParcela: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        ),
        status: -1,
      },
      include: [
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
    }).then((ev) => {
      res.send(ev);
    });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

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
  const { valorParcela, valorPago, cobrado, emprestimoId, userId } = req.body;

  var parcelaAReceber = await Parcela.findOne({
    where: {
      id: parcelaId,
    },
  })

  if (!parcelaAReceber) {
    res.status(400).send({ error: "Parcela não encontrada" });
  } else {
    await Parcela.update(
      {
        valorParcela: valorParcela,
        valorPago: valorPago,
        cobrado: cobrado,
        userId: userId,
        status: -1
      },
      {
        where: {
          id: parcelaAReceber.id
        }
      }
    );
    await RecalcParcelas(emprestimoId);
    await sleep(1000);
    await RecalcEmprestimo(emprestimoId);
    res.status(200).send()
  }
});

async function RecalcParcelas(idEmprestimo) {
  var parcelas;

  try {
    await Parcela.findAll({
      where: {
        emprestimoId: idEmprestimo,
      },
      order: ['parcelaNum']
    }).then((ev) => {
      parcelas = ev.map(value => value.dataValues)
    });

  } catch (erro) {
    res.status(500).json({ error: error.toString() });
  }
  
  for (var i = 0; i < parcelas.length; i++) {
    var parcela = parcelas[i];
    parcela.valorPago = parseFloat(parcela.valorPago);
    parcela.valorParcela = parseFloat(parcela.valorParcela);
    if (parcela.status == -1) {
      if (getDate(parcela.dataParcela) <= getDate(new Date())) {
        // Data da parcela é anterior ao dia de hoje
        if (parcela.cobrado) {
          if (parcela.valorPago === 0) {
            // Parcela foi cobrada mas nao foi pago
            // Define status 0 (não pago)
            parcela.status = 0;
            parcela.valorParcela = 0;
          } else {
            // Parcela foi cobrada a paga
            var residuo = parcela.valorParcela - parcela.valorPago;
            if (residuo === 0) {
              // Parcela foi paga normalmente
              // Define status 1 (pago)
              parcela.status = 1;
            } else if (residuo > 0) {
              // Parcela foi paga e teve resíduo positivo
              // Pagou a menos do que o cobrado
              // Define status como 2 (pago com ressalvas) e adiciona o resíduo na proxima parcela
              parcela.status = 2;
              parcela.valorParcela = parcela.valorPago;
              parcelas[i + 1].status = -1;
              var oldValue = parseFloat(parcelas[i + 1].valorParcela)
              parcelas[i + 1].valorParcela = oldValue + residuo;
            } else {
              // Parcela foi paga e teve resíduo negativo
              // Pagou a mais do que o cobrado
              // Define status como 1 (pago) e adiciona o resíduo na proxima parcela
              parcela.status = 1;
              parcela.valorParcela = parcela.valorPago;
              parcelas[i + 1].status = -1;
              var oldValue = parseFloat(parcelas[i + 1].valorParcela)
              parcelas[i + 1].valorParcela = oldValue + residuo;
            }
          }
        } else {
          if (getDate(parcela.dataParcela) != getDate(new Date())) {
             // Passou do dia e a parcela nao foi cobrada,
            // define status 4 (não cobrado) e zera o valor da parcela
            parcela.status = 4;
            parcela.valorParcela = 0;
          }
        }
      }
    }

    parcelas[i] = parcela;
  }

  try {
    parcelas.map(async parcela => {
      await Parcela.update(
        {
          valorParcela: parcela.valorParcela,
          valorPago: parcela.valorPago,
          cobrado: parcela.cobrado,
          status: parcela.status
        },
        {
          where: {
            id: parcela.id
          }
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

async function RecalcEmprestimo(idEmprestimo) {
  try{
    var emprestimo = await Emprestimo.findOne({
      attributes: [
        "id",
        "valorAReceber"
      ],
      where: {
        id: idEmprestimo
      }
    });

    var somaParcelas = await Parcela.findAll({
      attributes: [
        [sequelize.fn('sum', sequelize.col('valorParcela')), 'SomaValorParcelas'],
        [sequelize.fn('sum', sequelize.col('valorPago')), 'SomaValorPago']
      ],
      where: {
        emprestimoId: idEmprestimo
      }
    })

    var totalParcelasPagas = await Parcela.count({
      where: {
        emprestimoId: idEmprestimo,
        status:{ [Op.in]: [1, 2, 3]}
      }
    })

    var ultimaParcela = await Parcela.findAll({
      limit: 1,
      where: {
        emprestimoId: idEmprestimo
      },
      order: [ [ 'parcelaNum', 'DESC' ]]
    })

    var novaData = new Date(ultimaParcela[0].dataParcela.getTime())
    do {
      var novaData = new Date(novaData.getTime() + 86400000)
    } while(novaData.getDay() == 0)

    if (parseFloat(somaParcelas[0].dataValues.SomaValorParcelas) < parseFloat(emprestimo.valorAReceber)) {
      console.log("Entrou aqui");
      await Parcela.create(
        {
          emprestimoId: idEmprestimo,
          parcelaNum: ultimaParcela[0].parcelaNum + 1,
          status: -1,
          valorParcela: emprestimo.valorAReceber - somaParcelas[0].dataValues.SomaValorParcelas,
          cobrado: 0,
          valorPago: 0,
          dataParcela: novaData
        }
      )
    }

    var numParcelas = await Parcela.count({
      where: {
        emprestimoId: idEmprestimo
      }
    })
    
    var status = -1;
    if (parseFloat(somaParcelas[0].dataValues.SomaValorPago) >= parseFloat(emprestimo.valorAReceber)) {
      var totalParcelasNaoPagas = await Parcela.count({
        where: {
          emprestimoId: idEmprestimo,
          status: 0
        }
      });

      status = 1;

      if (totalParcelasNaoPagas > 4) {
        status = 3
      }
      else if (totalParcelasNaoPagas > 0) {
        status = 2;
      }
    }

    await Emprestimo.update(
      {
        valorPago: parseFloat(somaParcelas[0].dataValues.SomaValorPago),
        numParcelas: numParcelas,
        numParcelasPagas: totalParcelasPagas,
        status: status
      },
      {
        where: {
          id: emprestimo.id
        }
      }
    )

    
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

function getDate(date) {
  const x = new Date(date);
  return new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports = router;
