/** External Modules **/
var express = require("express");

/** Internal Modules **/
const Cliente = require("../Models/Cliente");
const User = require("../Models/User");
const Parcela = require("../Models/Parcela");
const db = require("../Models/db");

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
  await db.sequelize.query(
    "SELECT 'users'.'id', " +
    "       'users'.'username', " +
    "	      'users'.'name', " +
    "	      SUM('parcelas'.'valorPago') as 'receivedToday' " +
    "FROM 'users' " +
    "LEFT OUTER JOIN 'parcelas' ON 'users'.'id' = 'parcelas'.'idUserRecebeu' " +
    "WHERE 'users'.'authLevel' = 1 "  + 
    "GROUP BY 'users'.'id'" 
  )
    .then((ev) => res.json(ev[0]))
    .catch((error) => res.status(400).send(error));
});
/** Fetch all Users **/
router.get("/users", async (req, res) => {
  await User.findAll({
    attributes: ["id", "username", "authLevel", "name"],
  })
    .then((ev) => res.json(ev))
    .catch((error) => res.status(400).send(error));
});
/** Fetch user by id **/
router.get("/users/:id", async (req, res) => {
  await User.findOne({
    attributes: ["id", "username", "authLevel", "name"],
    where: {
      id: req.params.id,
    },
  })
    .then(async (ev) => {
      const totReceb = await Parcela.findAll({
        attributes: [
          [db.sequelize.fn('sum', db.sequelize.col('valorPago')), 'totalRecebido'],
        ],
        where: {
          idUserRecebeu: req.params.id,
          dataPagamento: today()
        }
      });
      var {id, username, authLevel, name} = ev
      var {totalRecebido} = totReceb[0].dataValues
      var obectToReturn = {
        id: id,
        username: username,
        authLevel: authLevel,
        name: name,
        totalRecebido: totalRecebido
      }
      res.send(obectToReturn);
    })
    .catch((error) => res.status(400).send(error));
});

/*
 * POST
 */

/** Create new Customer
 * @Param name
 * **/
router.post("/clientes", async (req, res) => {
  var body = req.body;
  if (!body.name) {
    res.status(400).send("name is required");
  } else {
    try {
      await db.sequelize.transaction(async (t) => {
        await Cliente.create(
          {
            name: body.name,
          },
          { transaction: t }
        ).then(() => res.status(201).send());
      });
    } catch (error) {
      res.status(400).send(JSON.stringify(error));
    }
  }
});

/** Update Customer
 * @Param id
 * @Param name
 * **/
router.put("/clientes", async (req, res) => {
  var { id, name } = req.body;
  if (id && name) {
    try {
      await db.sequelize.transaction(async (t) => {
        await Cliente.update(
          {
            name: name,
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
      res.status(400).send(JSON.stringify(error));
    }
  } else {
    res.status(400).send("Body is missing required parametens");
  }
});

/** Delete Customer **/
router.delete("/clientes/:id", async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let CustomerToDelete = await Cliente.findOne({
        where: { id: req.params.id },
      }).catch((e) => {
        console.log(e.message);
      });
      if (!CustomerToDelete) {
        res.status(404).send("Record not found");
      } else {
        await CustomerToDelete.destroy({ transaction: t }).then(() => {
          res.status(200).send();
        });
      }
    });
  } catch (error) {
    res.status(400).send(JSON.stringify(error));
  }
});
module.exports = router;
