/** External Modules **/
var express = require("express");
const { Op } = require('sequelize')

/** Internal Modules **/
const User = require("../Models").user;
const Parcela = require("../Models").parcela;
const Emprestimo = require("../Models").Emprestimo;
const sequelize = require("../Models").sequelize;
// const Parcela = require("../Models/--Parcela");
// const db = require("../Models/db");

var router = express.Router();

function today() {
  let x = new Date();
  return new Date(x.getFullYear(), x.getMonth(), x.getDate());
}

/*
 * GET
 */

/** Fetch all Motoboys **/
router.get("/users/motoboys", async (req, res) => {
  try {
    await User.findAll({
      attributes: [
        'id', 
        'name', 
        'username',
        [sequelize.fn('sum', sequelize.col('parcelas.valorPago')), 'receivedToday']
      ],
      order: [
        ['name', 'ASC'],
      ],
      include: [{
        attributes: [],
        model: Parcela,
        required: false,
        where: {
          dataParcela: today()
        }
      }],
      group: ['user.id']
    }).then(users => {
      res.json(users);
    })
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});
/** Fetch all Users **/
router.get("/users", async (req, res) => {
  try {
    await User.findAll({
      attributes: ["id", "username", "authLevel", "name"],
    })
      .then((ev) => res.json(ev))
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});
/** Fetch user by id **/
router.get("/users/:id", async (req, res) => {
  try {
    await User.findOne({
      attributes: [
        'id', 
        'name', 
        'username',
        'password',
        'authLevel',
        [sequelize.fn('sum', sequelize.col('parcelas.valorPago')), 'receivedToday']
      ],
      where: {
        id: req.params.id
      },
      order: [
        ['name', 'ASC'],
      ],
      include: [{
        attributes: [],
        model: Parcela,
        required: false,
        where: {
          dataParcela: today()
        }
      }],
      group: ['user.id']
    }).then(users => {
      res.json(users);
    })
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

/*
 * POST
 */

/** Create new User
 * @Param username
 * @Param password
 * @Param authLevel
 * @Param name
 * **/
router.post("/users", async (req, res) => {
  var {username, password, name, authLevel} = req.body;
  if (!username || !password || !name || !authLevel) {
    res.status(400).send("Body is missing required parameters.");
  } else {
    const findUser = await User.findOne({
      where: {
        username: username
      }
    });
    if (findUser){
      res.status(400).send("Usuário ja existe.");
    } else {
      try {
        await db.sequelize.transaction(async (t) => {
          await User.create(
            {
              username: username.toLowerCase(),
              password: password,
              authLevel: authLevel,
              name: name,
            },
            { transaction: t }
          ).then(() => res.status(201).send());
        });
      } catch (error) {
        res.status(500).json({ error: error.toString() });
      }
    }
  }
});

/** Update Customer
 * @Param id
 * @Param username
 * @Param password
 * @Param authLevel
 * @Param name
 * **/
router.put("/users", async (req, res) => {
  var {id, password, name, authLevel} = req.body;
  if (id && password && name && authLevel) {
    try {
      await db.sequelize.transaction(async (t) => {
        await User.update(
          {
            password: password,
            name: name,
            authLevel: authLevel
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
    res.status(400).send("Body is missing required parameters");
  }
});

/** Delete Customer **/
router.delete("/users/:id", async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let UserToDelete = await User.findOne({
        where: { id: req.params.id },
      }).catch((e) => {
        console.log(e.message);
      });
      if (!UserToDelete) {
        res.status(404).send("Record not found");
      } else {
        await UserToDelete.destroy({ transaction: t }).then(() => {
          res.status(200).send();
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});
module.exports = router;
