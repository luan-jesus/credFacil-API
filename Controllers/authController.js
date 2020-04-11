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
    res.status(400).send("Username is required!");
  } else if (!password) {
    res.status(400).send("Password is required!");
  } else {
    try {
      await User.findOne({
        where: {
          username: username.toLowerCase(),
          password: password.toLowerCase(),
        },
      }).then((user) => {
        if (user.length === 0) {
          res.status(401).send();
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
