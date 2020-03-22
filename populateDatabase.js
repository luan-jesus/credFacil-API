/*
 * Use esta função criar dados de testes nas tabelas
 */

module.exports = db => {
  db.Cliente.bulkCreate([
    {
      name: "Magalu"
    },
    {
      name: "Scope"
    }
  ]);

  db.Emprestimo.create({
    idCliente: 1,
    valorEmprestimo: 1100,
    numParcelas: 11
  });

  for (var i = 0; i < 11; i++) {
    var today = new Date();
    db.Parcela.create({
      idEmprestimo: 1,
      parcelaNum: i + 1,
      valorParcela: 100,
      cobrado: false,
      valorPago: 0,
      pago: false,
      dataParcela: new Date(today.getTime() + i * 24 * 60 * 60 * 1000)
    });
  }
};
