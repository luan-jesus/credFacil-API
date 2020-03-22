/** External Modules **/
var express = require("express");

/** Internal Modules **/
const db = require("../db");

var router = express.Router();

/*
 * GET
 */

/** Todos os clientes **/
router.get("/api/clientes", async (req, res) => {
  await db.Cliente.findAll().then(ev => res.json(ev));
});

/*
 * POST
 */

/** Cadastrar novo cliente **/
router.post("/api/clientes", async (req, res) => {
  var body = req.body;
  const cliente = db.Cliente.create({
    name: body.name
  });
  res.send("ok");
})

module.exports = router;
