/** External Modules **/
var express = require("express");

/** Internal Modules **/
const User = require("../Models/User");

var router = express.Router();

/*
 * GET
 */

/** Login **/
router.post("/auth/login", async (req, res) => {
  var body = req.body;
  if (typeof body.username === "undefined") {
    res.status(400).send("Username is required!");
  } else if (typeof body.password === "undefined") {
    res.status(400).send("Password is required!");
  } else {
    await User.findOne({
      where: {
        username: body.username.toLowerCase(),
        password: body.password.toLowerCase()
      }
    }).then(user => {
        if (user.length === 0) {
          res.status(401).send();
        } else {
          res.status(200).send({
            id: user.id,
            authLevel: user.authLevel,
            username: user.username
          });
        }
      })
      .catch(error => {
        res.status(400).send(error);
      });
  }
});

module.exports = router;
