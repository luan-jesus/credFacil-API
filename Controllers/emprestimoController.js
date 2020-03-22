/** External Modules **/
var express = require("express");

/** Internal Modules **/
const db = require("../db");

var router = express.Router();

/*
 * GET
 */

/** Todos os emprestimos **/
router.get("/api/emprestimos", async (req, res) => {
  await db.Emprestimo.findAll().then(ev => res.json(ev));
});

/*
 * POST
 */

/** Cadastrar novo emprestimo **/
router.post("/api/emprestimos", async (req, res) => {
  var body = req.body;
  const emprestimo = db.Emprestimo.create({
    name: body.name
  });
  res.send("ok");
})

module.exports = router;
