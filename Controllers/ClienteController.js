/** External Modules **/
var express = require("express");

/** Internal Modules **/
const Cliente = require("../Models/Cliente");
const db = require("../Models/db");

var router = express.Router();

/*
 * GET
 */

/** Todos os clientes **/
router.get("/clientes", async (req, res) => {
  await Cliente.findAll()
    .then(ev => res.json(ev))
    .catch(error => res.status(400).send(error));
});

/*
 * POST
 */

/** Cadastrar novo cliente **/
router.post("/clientes", async (req, res) => {
  var body = req.body;
  try {
    await db.sequelize.transaction(async t => {
      await Cliente.create(
        {
          name: body.name
        },
        { transaction: t }
      ).then(() => res.status(201).send());
    });
  } catch (error) {
    res.status(400).send(error);
  }
  
});

module.exports = router;
