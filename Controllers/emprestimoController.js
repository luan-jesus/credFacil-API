/** External Modules **/
var express = require("express");

/** Internal Modules **/
const Emprestimo = require("../Models/Emprestimo");

var router = express.Router();

/*
 * GET
 */

/** Todos os emprestimos **/
router.get("/emprestimos", async (req, res) => {
  await Emprestimo.findAll().then(ev => res.json(ev));
});

/*
 * POST
 */

/** Cadastrar novo emprestimo **/
router.post("/emprestimos", async (req, res) => {
  var body = req.body;
  const emprestimo = Emprestimo.create({
    name: body.name
  });
  res.send("ok");
})

module.exports = router;
