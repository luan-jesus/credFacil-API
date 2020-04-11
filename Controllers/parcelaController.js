/** External Modules **/
var express = require("express");

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
      attributes: [
        "id",
        "parcelaNum",
        "valorParcela",
        "dataParcela"
      ],
      where: {
        dataParcela: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        status: -1
      },
      include: [{
        attributes: ['id'],
        model: Emprestimo,
        include: [{
          attributes: ['name'],
          model: Cliente
        }]
      }]
    }).then(ev => {
      res.send(ev);
    })
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

/** Determinada parcela **/
router.get('/parcelas/:parcelaId', async (req, res) => {
  try {
    await Parcela.findOne({
      attributes: [
        'id',
        'parcelaNum',
        'status',
        'valorParcela',
        'cobrado',
        'valorPago',
        'dataParcela'
      ],
      where: {
        id: parseInt(req.params.parcelaId)
      },
      include: [
        {
          attributes: ['name'],
          model: User,
          required: false
        },
        {
          attributes: ['id'],
          model: Emprestimo,
          include: [{
            attributes: ['name'],
            model: Cliente
          }]
        }
      ]
    }).then(ev => res.send(ev))
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

/** Receber parcela
 * @Param idCliente
 * @Param idEmprestimo
 * @Param parcelaNum
 */
router.post('/parcelas/receber', async (req, res) => {
  const { idCliente, idEmprestimo, parcelaNum } = req.body;
  await RecalcEmprestimo(idCliente, idEmprestimo);
});


async function RecalcEmprestimo(idCliente, idEmprestimo) {
  await Parcela.findAll({
    where: {
      idCliente: idCliente,
      idEmprestimo: idEmprestimo,
    }
  })
    .then(parcelas => {
      parcelas.map(async parcela => {
        if (getDate(parcela.dataParcela) < getDate(new Date())) {
          // Data da parcela é anterior ao dia de hoje
          if (parcela.cobrado) {
            if (parcela.valorPago === 0) {
              // Parcela foi cobrada mas nao foi pago
              // Define status 0 (não pago)
              await Parcela.update(
                {
                  status: 0
                },
                {
                  where: {
                    idCliente: parcela.idCliente,
                    idEmprestimo: parcela.idEmprestimo,
                    parcelaNum: parcela.parcelaNum
                  }
                }
              )
            } else {
              // Parcela foi cobrada a paga
              var residuo = parcela.valorParcela - parcela.valorPago;
              if (residuo === 0) {
                // Parcela foi paga normalmente
                // Define status 1 (pago)
                await Parcela.update(
                  {
                    status: 1
                  },
                  {
                    where: {
                      idCliente: parcela.idCliente,
                      idEmprestimo: parcela.idEmprestimo,
                      parcelaNum: parcela.parcelaNum
                    }
                  }
                )
              } else if (residuo > 0) {
                // Parcela foi paga e teve resíduo positivo
                // Pagou a menos do que o cobrado
                // Define status como 2 (pago com ressalvas) e adiciona o resíduo na proxima parcela
                await Parcela.update(
                  {
                    status: 2,
                    valorParcela: parcela.valorPago
                  },
                  {
                    where: {
                      idCliente: parcela.idCliente,
                      idEmprestimo: parcela.idEmprestimo,
                      parcelaNum: parcela.parcelaNum
                    }
                  }
                );
                await Parcela.findOne({
                  where: {
                    idCliente: parcela.idCliente,
                    idEmprestimo: parcela.idEmprestimo,
                    parcelaNum: parcela.parcelaNum + 1
                  }
                }).then(async proxParcela => {
                  await Parcela.update(
                    {
                      valorParcela: proxParcela.valorParcela + residuo
                    },
                    {
                      where: {
                        idCliente: proxParcela.idCliente,
                        idEmprestimo: proxParcela.idEmprestimo,
                        parcelaNum: proxParcela.parcelaNum
                      }
                    }
                  );
                });
              } else {
                // Parcela foi paga e teve resíduo negativo
                // Pagou a mais do que o cobrado
                // Define status como 1 (pago) e adiciona o resíduo na proxima parcela
                await Parcela.update(
                  {
                    status: 1,
                  },
                  {
                    where: {
                      idCliente: parcela.idCliente,
                      idEmprestimo: parcela.idEmprestimo,
                      parcelaNum: parcela.parcelaNum
                    }
                  }
                ).then(async () => {
                  const proxParcela =  await Parcela.findOne({
                    where: {
                      idCliente: parcela.idCliente,
                      idEmprestimo: parcela.idEmprestimo,
                      parcelaNum: parcela.parcelaNum + 1
                    }
                  })
                  await Parcela.update(
                    {
                      valorParcela: proxParcela.valorParcela + residuo
                    },
                    {
                      where: {
                        idCliente: proxParcela.idCliente,
                        idEmprestimo: proxParcela.idEmprestimo,
                        parcelaNum: proxParcela.parcelaNum
                      }
                    }
                  );
                });
              }
            }
          } else {
            // Passou do dia e a parcela nao foi cobrada,
            // define status 4 (não cobrado) e zera o valor da parcela
            await Parcela.update(
              {
                status: 4,
                valorParcela: 0
              },
              {
                where: {
                  idCliente: parcela.idCliente,
                  idEmprestimo: parcela.idEmprestimo,
                  parcelaNum: parcela.parcelaNum
                }
              }
            )
          }
        } else if (getDate(parcela.dataParcela) == getDate(new Date())) {
          console.log('parcela num ' + parcela.parcelaNum + ' é hoje');
        } else if (getDate(parcela.dataParcela) > getDate(new Date())) {
          console.log('parcela num ' + parcela.parcelaNum + ' é depois de hoje');
        }
      })
    })
}

function getDate(date) {
  const x = new Date(date);
  return new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
}

module.exports = router;
