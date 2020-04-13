/** External Modules **/
var express = require("express");

/** Internal Modules **/
const User = require("../Models/").user;

var router = express.Router();

/*
 * GET
 */

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
          res.status(401).send({ error: "Credenciais inválidas"});
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

module.exports = router;
