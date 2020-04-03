/*
 * Execute este arquivo para atualizar a estrutura do banco de dados caso
 * tenha sido feita alguma alteração aos models.
 * Isto também populará as tabelas do banco de dados com dados ficticios
 */

const Status = require("./Models/Status");
const Cliente = require("./Models/Cliente");
const Emprestimo = require("./Models/Emprestimo");
const Parcela = require("./Models/Parcela");
const User = require("./Models/User");

const attDB = async () => {
  Status.sync({ force: true });
  Cliente.sync({ force: true });
  Emprestimo.sync({ force: true });
  Parcela.sync({ force: true });
  User.sync({ force: true });

  console.log("Aguardando 5 segundos para atualizar as tabelas");
  await wait(1000);
  console.log("inserindo Registros");
};

attDB().then(() => {
  Status.bulkCreate([
    {
      statusName: "Pendente"
    },
    {
      statusName: "Concluido"
    }
  ]);
  User.bulkCreate([
    {
      username: "admin",
      password: "admin",
      authLevel: 2
    },
    {
      username: "user",
      password: "user",
      authLevel: 1
    }
  ]);
  Cliente.bulkCreate([
    {
      name: "Magalu"
    },
    {
      name: "Scope Systems"
    },
    {
      name: "Casas Bahia"
    },
    {
      name: "Cidinha Bolos"
    }
  ]);

  Emprestimo.bulkCreate([
    {
      idCliente: 1,
      valorEmprestimo: 1100,
      numParcelas: 11,
      dataInicio: new Date("01/11/2019"),
      status: 1
    },
    {
      idCliente: 2,
      valorEmprestimo: 2400,
      numParcelas: 24,
      dataInicio: new Date("01/11/2019"),
      status: 1
    },
    {
      idCliente: 3,
      valorEmprestimo: 700,
      numParcelas: 7,
      dataInicio: new Date("01/11/2019"),
      status: 1
    },
    {
      idCliente: 4,
      valorEmprestimo: 1400,
      numParcelas: 14,
      dataInicio: new Date("01/11/2019"),
      status: 1
    }
  ]);

  // Como no javascript a data é contada a partir de milissegundos, para ter o 
  // valor de um dia é precisso tranformar as 24h do dia em milissegundos.
  const dia = 24 * 60 * 60 * 1000;

  /*
   * Parcelas do emprestimo 1
   */
  var DataParcela = new Date("03/16/2020");
  for (var i = 0; i < 11; i++) {
    DataParcela = new Date(DataParcela.getTime() + dia);
    if (DataParcela.getDay() == 0){ //domingo
      DataParcela = new Date(DataParcela.getTime() + dia);
    }
    Parcela.create({
      idEmprestimo: 1,
      parcelaNum: i + 1,
      valorParcela: 100,
      cobrado: false,
      valorPago: 0,
      pago: false,
      dataParcela: DataParcela
    });
  }

  /*
   * Parcelas do emprestimo 2
   */
  var DataParcela = new Date("03/10/2020");
  for (var i = 0; i < 24; i++) {
    DataParcela = new Date(DataParcela.getTime() + dia);
    if (DataParcela.getDay() == 0){ //domingo
      DataParcela = new Date(DataParcela.getTime() + dia);
    }
    Parcela.create({
      idEmprestimo: 2,
      parcelaNum: i + 1,
      valorParcela: 100,
      cobrado: false,
      valorPago: 0,
      pago: false,
      dataParcela: DataParcela
    });
  }

  /*
   * Parcelas do emprestimo 3
   */
  var DataParcela = new Date("03/22/2020");
  for (var i = 0; i < 7; i++) {
    DataParcela = new Date(DataParcela.getTime() + dia);
    if (DataParcela.getDay() == 0){ //domingo
      DataParcela = new Date(DataParcela.getTime() + dia);
    }
    Parcela.create({
      idEmprestimo: 3,
      parcelaNum: i + 1,
      valorParcela: 100,
      cobrado: false,
      valorPago: 0,
      pago: false,
      dataParcela: DataParcela
    });
  }

  /*
   * Parcelas do emprestimo 4
   */
  var DataParcela = new Date("03/20/2020");
  for (var i = 0; i < 14; i++) {
    DataParcela = new Date(DataParcela.getTime() + dia);
    if (DataParcela.getDay() == 0){ //domingo
      DataParcela = new Date(DataParcela.getTime() + dia);
    }
    Parcela.create({
      idEmprestimo: 4,
      parcelaNum: i + 1,
      valorParcela: 100,
      cobrado: false,
      valorPago: 0,
      pago: false,
      dataParcela: DataParcela
    });
  }

});

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}
