/*
 * Execute este arquivo para atualizar a estrutura do banco de dados caso
 * tenha sido feita alguma alteração aos models.
 * Isto também populará as tabelas do banco de dados com dados ficticios
 */

const Cliente = require("./Models/Cliente");
const Emprestimo = require("./Models/Emprestimo");
const Parcela = require("./Models/Parcela");

const attDB = async () => {
  Cliente.sync({ force: true });
  Emprestimo.sync({ force: true });
  Parcela.sync({ force: true });

  console.log("Aguardando 5 segundos para atualizar as tabelas");
  await wait(1000);
  console.log("inserindo Registros");
};

attDB().then(() => {
  Cliente.bulkCreate([
    {
      name: "Magalu"
    },
    {
      name: "Scope"
    }
  ]);

  Emprestimo.create({
    idCliente: 1,
    valorEmprestimo: 1100,
    numParcelas: 11
  });

  for (var i = 0; i < 11; i++) {
    var today = new Date();
    Parcela.create({
      idEmprestimo: 1,
      parcelaNum: i + 1,
      valorParcela: 100,
      cobrado: false,
      valorPago: 0,
      pago: false,
      dataParcela: new Date(today.getTime() + i * 24 * 60 * 60 * 1000)
    });
  }
});

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}
