/** External Modules **/
var express = require("express");

/** Internal Modules **/
const User = require("../Models/").user;
const Cliente = require("../Models/").cliente;

var router = express.Router();

/*
 * GET
 */

router.get("/getDateTime", async (req, res) => {
  const x = new Date();
  var y = new Date(x.getFullYear(), x.getMonth(), x.getDate())
  res.send(y.toString());
});


/** Login **/
router.post("/auth/login", async (req, res) => {
  var { username, password } = req.body;
  if (!username) {
    res.status(400).send({error: "Usuário é obrigatório!"});
  } else if (!password) {
    res.status(400).send({error: "Senha é obrigatório!"});
  } else {
    try {
      await User.findOne({
        where: {
          username: username.toLowerCase(),
          password: password.toLowerCase(),
        },
      }).then((user) => {
        if (!user) {
          res.status(401).send({ error: "Credenciais inválidas" });
        } else {
          res.status(200).send({
            id: user.id,
            authLevel: user.authLevel,
            username: user.username,
          });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  }
});

/** Login Cliente **/
router.post("/auth/cliente/login", async (req, res) => {
  var { username, password } = req.body;
  if (!username) {
    res.status(400).send({error: "Usuário é obrigatório!"});
  } else if (!password) {
    res.status(400).send({error: "Senha é obrigatório!"});
  } else {
    try {
      await Cliente.findOne({
        where: {
          username: username.toLowerCase(),
          password: password.toLowerCase(),
        },
      }).then((cliente) => {
        if (!cliente) {
          res.status(401).send({ error: "Credenciais inválidas" });
        } else {
          res.status(200).send({
            id: cliente.id,
            username: cliente.username,
          });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  }
});

module.exports = router;
