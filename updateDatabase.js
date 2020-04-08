/*
 * Execute este arquivo para atualizar a estrutura do banco de dados caso
 * tenha sido feita alguma alteração aos models.
 * Isto também populará as tabelas do banco de dados com dados ficticios
 */

const Cliente = require("./Models/Cliente");
const Emprestimo = require("./Models/Emprestimo");
const Parcela = require("./Models/Parcela");
const User = require("./Models/User");

const attDB = async () => {
  Cliente.sync({ force: true });
  Emprestimo.sync({ force: true });
  Parcela.sync({ force: true });
  User.sync({ force: true });

  Cliente.hasMany(Emprestimo, {foreignKey: 'idCliente'});
  Emprestimo.hasOne(Cliente, {foreignKey: 'idCliente'});

  // Cliente.hasMany(Parcela, {foreignKey: 'idCliente'});
  // Parcela.hasOne(Cliente, {foreignKey: 'idCliente'});

  Emprestimo.hasMany(Parcela, {foreignKey: 'idEmprestimo', sourceKey: 'idEmprestimo'});
  Parcela.hasOne(Emprestimo, {foreignKey: 'idEmprestimo', targetKey: 'idEmprestimo'});

  console.log("Aguardando 5 segundos para atualizar as tabelas");
  await wait(1000);
  console.log("inserindo Registros");
};

attDB().then(() => {
  User.bulkCreate([
    {
      username: "admin",
      password: "admin",
      authLevel: 2,
      name: "Administrador"
    },
    {
      username: "user",
      password: "user",
      authLevel: 1,
      name: "Motoboy"
    },
    {
      username: "ricardo",
      password: "123",
      authLevel: 1,
      name: "Ricardo Marcelo"
    },
    {
      username: "marcelo",
      password: "123",
      authLevel: 1,
      name: "Marcelo"
    },
    {
      username: "",
      password: "",
      authLevel: 2,
      name: "Desenvolvedor"
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
      idEmprestimo: 1,
      status: 1,
      valorEmprestimo: 900,
      valorAReceber: 1100,
      valorPago: 1100,
      numParcelasPagas: 11,
      numParcelas: 11,
      dataInicio: new Date("01/11/2019")
    },
    {
      idCliente: 1,
      idEmprestimo: 2,
      status: 2,
      valorEmprestimo: 1100,
      valorAReceber: 1300,
      valorPago: 1300,
      numParcelasPagas: 13,
      numParcelas: 15,
      dataInicio: new Date("01/16/2020")
    },
    {
      idCliente: 1,
      idEmprestimo: 3,
      status: -1,
      valorEmprestimo: 2000,
      valorAReceber: 2300,
      valorPago: 720,
      numParcelasPagas: 7,
      numParcelas: 23,
      dataInicio: new Date("03/31/2020")
    }
  ]);

  /*
   * Parcelas do emprestimo 1
   */
  Parcela.bulkCreate([
    {
      idCliente: 1,
      idEmprestimo: 1,
      parcelaNum: 1,
      status: 1,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 100,
      dataParcela: new Date("11/01/2019"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 1,
      parcelaNum: 2,
      status: 1,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 100,
      dataParcela: new Date("11/02/2019"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 1,
      parcelaNum: 3,
      status: 1,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 100,
      dataParcela: new Date("11/04/2019"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 1,
      parcelaNum: 4,
      status: 1,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 100,
      dataParcela: new Date("11/05/2019"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 1,
      parcelaNum: 5,
      status: 1,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 120,
      dataParcela: new Date("11/06/2019"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 1,
      parcelaNum: 6,
      status: 1,
      valorParcela: 80,
      cobrado: 1,
      valorPago: 80,
      dataParcela: new Date("11/07/2019"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 1,
      parcelaNum: 7,
      status: 1,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 100,
      dataParcela: new Date("11/08/2019"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 1,
      parcelaNum: 8,
      status: 1,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 100,
      dataParcela: new Date("11/11/2019"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 1,
      parcelaNum: 9,
      status: 1,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 100,
      dataParcela: new Date("11/11/2019"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 1,
      parcelaNum: 10,
      status: 1,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 100,
      dataParcela: new Date("11/12/2019"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 1,
      parcelaNum: 11,
      status: 1,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 100,
      dataParcela: new Date("11/13/2019"),
      idUserRecebeu: 3
    },
    // Parcela 2
    {
      idCliente: 1,
      idEmprestimo: 2,
      parcelaNum: 1,
      status: 1,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 100,
      dataParcela: new Date("01/16/2020"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 2,
      parcelaNum: 2,
      status: 1,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 100,
      dataParcela: new Date("01/17/2020"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 2,
      parcelaNum: 3,
      status: 1,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 100,
      dataParcela: new Date("01/18/2020"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 2,
      parcelaNum: 4,
      status: 1,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 100,
      dataParcela: new Date("01/20/2020"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 2,
      parcelaNum: 5,
      status: 1,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 100,
      dataParcela: new Date("01/21/2020"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 2,
      parcelaNum: 6,
      status: 1,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 100,
      dataParcela: new Date("01/22/2020"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 2,
      parcelaNum: 7,
      status: 1,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 100,
      dataParcela: new Date("01/23/2020"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 2,
      parcelaNum: 8,
      status: 1,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 100,
      dataParcela: new Date("01/24/2020"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 2,
      parcelaNum: 9,
      status: 0,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 0,
      dataParcela: new Date("01/25/2020"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 2,
      parcelaNum: 10,
      status: 1,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 100,
      dataParcela: new Date("01/27/2020"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 2,
      parcelaNum: 11,
      status: 1,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 100,
      dataParcela: new Date("01/28/2020"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 2,
      parcelaNum: 12,
      status: 2,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 80,
      dataParcela: new Date("01/29/2020"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 2,
      parcelaNum: 13,
      status: 0,
      valorParcela: 120,
      cobrado: 1,
      valorPago: 0,
      dataParcela: new Date("01/30/2020"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 2,
      parcelaNum: 14,
      status: 1,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 100,
      dataParcela: new Date("01/31/2020"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 2,
      parcelaNum: 15,
      status: 1,
      valorParcela: 120,
      cobrado: 1,
      valorPago: 120,
      dataParcela: new Date("02/01/2020"),
      idUserRecebeu: 3
    },
    // Emprestimo 3
    {
      idCliente: 1,
      idEmprestimo: 3,
      parcelaNum: 1,
      status: 1,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 100,
      dataParcela: new Date("03/31/2020"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 3,
      parcelaNum: 2,
      status: 1,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 100,
      dataParcela: new Date("04/01/2020"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 3,
      parcelaNum: 3,
      status: 1,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 100,
      dataParcela: new Date("04/02/2020"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 3,
      parcelaNum: 4,
      status: 1,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 100,
      dataParcela: new Date("04/03/2020"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 3,
      parcelaNum: 5,
      status: 1,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 100,
      dataParcela: new Date("04/04/2020"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 3,
      parcelaNum: 6,
      status: 1,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 100,
      dataParcela: new Date("04/05/2020"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 3,
      parcelaNum: 7,
      status: 1,
      valorParcela: 100,
      cobrado: 1,
      valorPago: 120,
      dataParcela: new Date("04/06/2020"),
      idUserRecebeu: 3
    },
    {
      idCliente: 1,
      idEmprestimo: 3,
      parcelaNum: 8,
      status: -1,
      valorParcela: 80,
      cobrado: 0,
      valorPago: 0,
      dataParcela: new Date("04/07/2020"),
      idUserRecebeu: null
    },
    {
      idCliente: 1,
      idEmprestimo: 3,
      parcelaNum: 9,
      status: -1,
      valorParcela: 100,
      cobrado: 0,
      valorPago: 0,
      dataParcela: new Date("04/08/2020"),
      idUserRecebeu: null
    },
    {
      idCliente: 1,
      idEmprestimo: 3,
      parcelaNum: 10,
      status: -1,
      valorParcela: 100,
      cobrado: 0,
      valorPago: 0,
      dataParcela: new Date("04/09/2020"),
      idUserRecebeu: null
    },
    {
      idCliente: 1,
      idEmprestimo: 3,
      parcelaNum: 11,
      status: -1,
      valorParcela: 100,
      cobrado: 0,
      valorPago: 0,
      dataParcela: new Date("04/10/2020"),
      idUserRecebeu: null
    },
    {
      idCliente: 1,
      idEmprestimo: 3,
      parcelaNum: 12,
      status: -1,
      valorParcela: 100,
      cobrado: 0,
      valorPago: 0,
      dataParcela: new Date("04/11/2020"),
      idUserRecebeu: null
    },
    {
      idCliente: 1,
      idEmprestimo: 3,
      parcelaNum: 13,
      status: -1,
      valorParcela: 100,
      cobrado: 0,
      valorPago: 0,
      dataParcela: new Date("04/13/2020"),
      idUserRecebeu: null
    },
    {
      idCliente: 1,
      idEmprestimo: 3,
      parcelaNum: 14,
      status: -1,
      valorParcela: 100,
      cobrado: 0,
      valorPago: 0,
      dataParcela: new Date("04/14/2020"),
      idUserRecebeu: null
    },
    {
      idCliente: 1,
      idEmprestimo: 3,
      parcelaNum: 15,
      status: -1,
      valorParcela: 100,
      cobrado: 0,
      valorPago: 0,
      dataParcela: new Date("04/15/2020"),
      idUserRecebeu: null
    },
    {
      idCliente: 1,
      idEmprestimo: 3,
      parcelaNum: 16,
      status: -1,
      valorParcela: 100,
      cobrado: 0,
      valorPago: 0,
      dataParcela: new Date("04/16/2020"),
      idUserRecebeu: null
    },
    {
      idCliente: 1,
      idEmprestimo: 3,
      parcelaNum: 17,
      status: -1,
      valorParcela: 100,
      cobrado: 0,
      valorPago: 0,
      dataParcela: new Date("04/17/2020"),
      idUserRecebeu: null
    },
    {
      idCliente: 1,
      idEmprestimo: 3,
      parcelaNum: 18,
      status: -1,
      valorParcela: 100,
      cobrado: 0,
      valorPago: 0,
      dataParcela: new Date("04/18/2020"),
      idUserRecebeu: null
    },
    {
      idCliente: 1,
      idEmprestimo: 3,
      parcelaNum: 19,
      status: -1,
      valorParcela: 100,
      cobrado: 0,
      valorPago: 0,
      dataParcela: new Date("04/20/2020"),
      idUserRecebeu: null
    },
    {
      idCliente: 1,
      idEmprestimo: 3,
      parcelaNum: 20,
      status: -1,
      valorParcela: 100,
      cobrado: 0,
      valorPago: 0,
      dataParcela: new Date("04/21/2020"),
      idUserRecebeu: null
    },
    {
      idCliente: 1,
      idEmprestimo: 3,
      parcelaNum: 21,
      status: -1,
      valorParcela: 100,
      cobrado: 0,
      valorPago: 0,
      dataParcela: new Date("04/22/2020"),
      idUserRecebeu: null
    },
    {
      idCliente: 1,
      idEmprestimo: 3,
      parcelaNum: 22,
      status: -1,
      valorParcela: 100,
      cobrado: 0,
      valorPago: 0,
      dataParcela: new Date("04/23/2020"),
      idUserRecebeu: null
    },
    {
      idCliente: 1,
      idEmprestimo: 3,
      parcelaNum: 23,
      status: -1,
      valorParcela: 100,
      cobrado: 0,
      valorPago: 0,
      dataParcela: new Date("04/24/2020"),
      idUserRecebeu: null
    },
  ]);

});

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}
