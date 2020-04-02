/** External Modules **/
var express = require("express");

/** Internal Modules **/
const Cliente = require("../Models/Cliente");
const db = require("../Models/db");

var router = express.Router();

/*
 * GET
 */

/** Fetch all Customer **/
router.get("/clientes", async (req, res) => {
  await Cliente.findAll()
    .then(ev => res.json(ev))
    .catch(error => res.status(400).send(error));
});
/** Fetch customer by id **/
router.get("/clientes/:id", async (req, res) => {
  await Cliente.findAll({
    where: {
      id: req.params.id
    }
  })
    .then(ev => res.json(ev))
    .catch(error => res.status(400).send(error));
});


/*
 * POST
 */

/** Create new Customer 
 * @Param name
 * **/
router.post("/clientes", async (req, res) => {
  var body = req.body;
  if (!body.name){
    res.status(400).send('name is required');
  } else {
    try {
      await db.sequelize.transaction(async t => {
        await Cliente.create(
          {
            name: body.name
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
  var {id, name} = req.body;
  if (id && name){
    try {
      await db.sequelize.transaction(async t => {
        await Cliente.update(
          {
            name: name
          },
          {
            where: {id: id}
          },
          { transaction: t }
        ).then(rowsAffected => res.status(200).send({rowsAffected: rowsAffected[0]}));
      });
    } catch (error) {
      res.status(400).send(JSON.stringify(error));
    }
  } else {
    res.status(400).send('Body is missing required parametens');
  }
});

/** Delete Customer **/
router.delete("/clientes/:id", async (req, res) => {
  try {
    await db.sequelize.transaction(async t => {
      let CustomerToDelete = await Cliente.findOne({where: {id: req.params.id}}).catch(e => {
        console.log(e.message)
     });
     if (!CustomerToDelete){
      res.status(404).send('Record not found');
     } else {
      await CustomerToDelete.destroy({transaction: t }).then(() => {
        res.status(200).send();
      });
     }
    })
  } catch (error) {
    res.status(400).send(JSON.stringify(error));
  }
})
module.exports = router;
