/** External Modules **/
var express = require("express");

/** Internal Modules **/
const User = require("../Models/").user;
const Cliente = require("../Models/").cliente;

var router = express.Router();

/** GET **/
router.get("/getDateTime", async (req, res) => {
  const x = new Date();
  var y = new Date(x.getFullYear(), x.getMonth(), x.getDate())
  res.send(y.toString());
});

/** Login **/
router.post("/auth/login", async (req, res) => {
  var { username, password } = req.body;

  if (!username) {
    return res.status(400).send({error: "Usuário é obrigatório!"});
  }
  if (!password) {
    return res.status(400).send({error: "Senha é obrigatório!"});
  }

  try {
    const user = await User.findOne({
      where: {
        username: username.toLowerCase(),
        password: password.toLowerCase(),
      },
    });

    if (!user) {
      return res.status(401).send({ error: "Credenciais inválidas" });
    }

    return res.status(200).send({
      id: user.id,
      authLevel: user.authLevel,
      username: user.username,
    });

  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
});

/** Login Cliente **/
router.post("/auth/cliente/login", async (req, res) => {
  var { username, password } = req.body;

  if (!username) {
    return res.status(400).send({error: "Usuário é obrigatório!"});
  }

  if (!password) {
    return res.status(400).send({error: "Senha é obrigatório!"});
  }

  try {
    const cliente = await Cliente.findOne({
      where: {
        username: username.toLowerCase(),
        password: password.toLowerCase(),
      },
    });

    if (!cliente) {
      return res.status(401).send({ error: "Credenciais inválidas" });
    }

    return res.status(200).send({
      id: cliente.id,
      username: cliente.username,
    });
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
