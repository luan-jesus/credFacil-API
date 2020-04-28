/** External Modules **/
var express = require("express");

/** Internal Modules **/
const Cliente = require("../Models").cliente;
const Emprestimo = require("../Models").emprestimo;
const sequelize = require("../Models").sequelize;

var router = express.Router();

/*
 * GET
 */

/** Fetch all Customer **/
router.get("/clientes", async (req, res) => {
  await Cliente.findAll({
    order: [["name", "ASC"]],
  })
    .then((ev) => res.json(ev))
    .catch((error) => res.status(400).send(error));
});
/** Fetch customer by id **/
router.get("/clientes/:id", async (req, res) => {
  try {
    await Cliente.findOne({
      attributes: ["id", "name", "username", "password"],
      where: {
        id: req.params.id,
      },
      
      include: [{
        attributes: [
          "id",
          "status",
          "valorEmprestimo",
          "valorAReceber",
          "valorPago",
          "numParcelas",
          "numParcelasPagas",
          "dataInicio"
        ],
        model: Emprestimo,
        required: false,
        order: [["id", "DESC"]],
        separate: true
      }]
    }).then(ev => res.send(ev));
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

/*
 * POST
 */

/** Create new Customer
 * @Param name
 * **/
router.post("/clientes", async (req, res) => {
  var body = req.body;
  if (!body.name) {
    res.status(400).send("name is required");
  } else {
    try {
      await sequelize.transaction(async (t) => {
        await Cliente.create(
          {
            name: body.name,
            username: body.username,
            password: body.password
          },
          { transaction: t }
        ).then(() => res.status(201).send());
      });
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  }
});

/** Update Customer
 * @Param id
 * @Param name
 * **/
router.put("/clientes", async (req, res) => {
  var { id, name, username, password } = req.body;
  if (!username) {
    username = ""
  }
  if (!password) {
    password = ""
  }
  if (id && name) {
    try {
      await sequelize.transaction(async (t) => {
        await Cliente.update(
          {
            name: name,
            username: username,
            password: password
          },
          {
            where: { id: id },
          },
          { transaction: t }
        ).then((rowsAffected) =>
          res.status(200).send({ rowsAffected: rowsAffected[0] })
        );
      });
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  } else {
    res.status(400).send("Body is missing required parametens");
  }
});

/** Delete Customer **/
router.delete("/clientes/:id", async (req, res) => {
  try {
    await sequelize.transaction(async (t) => {
      let CustomerToDelete = await Cliente.findOne({
        where: { id: req.params.id },
      })
      if (!CustomerToDelete) {
        res.status(404).send("Record not found");
      } else {
        await CustomerToDelete.destroy({ transaction: t }).then(() => {
          res.status(200).send();
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});
module.exports = router;
