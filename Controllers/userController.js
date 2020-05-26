/** External Modules **/
var express = require("express");
const { Op } = require("sequelize");

/** Internal Modules **/
const User = require("../Models").user;
const Parcela = require("../Models").parcela;
const Cliente = require("../Models").cliente;
const Emprestimo = require("../Models").emprestimo;
const HistoMotoboy = require("../Models").histomotoboy;
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
        "id",
        "name",
        "username",
        [
          sequelize.fn("sum", sequelize.col("histomotoboys.valor")),
          "receivedToday",
        ],
      ],
      order: [["name", "ASC"]],
      where: {
        authLevel: 1,
      },
      include: [
        {
          attributes: [],
          model: HistoMotoboy,
          required: false,
          where: {
            pago: { [Op.not]: true },
          },
        },
      ],
      group: ["user.id"],
    }).then((users) => {
      res.json(users);
    });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});
/** Fetch all Users **/
router.get("/users", async (req, res) => {
  try {
    await User.findAll({
      attributes: ["id", "username", "authLevel", "name"],
    }).then((ev) => res.json(ev));
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});
/** Fetch user by id **/
router.get("/users/:id", async (req, res) => {
  try {
    var users = await User.findOne({
      attributes: ["id", "name", "username", "password", "authLevel"],
      where: {
        id: req.params.id,
      },
      order: [["name", "ASC"]],
      group: ["id"],
    });
    var user = users.dataValues;

    var toReceive = await HistoMotoboy.findAll({
      attributes: [[sequelize.fn("sum", sequelize.col("valor")), "valor"]],
      where: {
        userId: req.params.id,
        pago: { [Op.not]: true },
      },
    });

    var historico = await HistoMotoboy.findAll({
      attributes: [
        "userId",
        [sequelize.literal('DATE("data")'), "date"],
        [sequelize.fn("sum", sequelize.col("valor")), "valor"],
      ],
      group: [[sequelize.literal('DATE("data")'), "date"], "userId"],
      where: {
        userId: req.params.id,
        pago: { [Op.not]: true },
      },
      order: [[sequelize.literal('DATE("data")'), "DESC"]],
    });

    user.toReceive = toReceive[0].valor;

    var historicos = historico.map((val) => val.dataValues);
    user.historico = historicos;

    res.send(user);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

/** Fetch user hist by id **/
router.get("/users/hist/:id", async (req, res) => {
  try {
    var users = await User.findOne({
      attributes: ["id", "name", "username", "password", "authLevel"],
      where: {
        id: req.params.id,
      },
      order: [["name", "ASC"]],
      group: ["id"],
    });
    var user = users.dataValues;

    var historico = await HistoMotoboy.findAll({
      attributes: [
        "userId",
        [sequelize.literal('DATE("data")'), "date"],
        [sequelize.fn("sum", sequelize.col("valor")), "valor"],
      ],
      group: [[sequelize.literal('DATE("data")'), "date"], "userId"],
      where: {
        userId: req.params.id,
        pago: true,
      },
      order: [[sequelize.literal('DATE("data")'), "DESC"]],
    });

    var historicos = historico.map((val) => val.dataValues);
    user.historico = historicos;

    res.send(user);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

/** Fetch motoboy by id **/
router.post("/motoboy/:id/receber", async (req, res) => {
  const { dataParcela } = req.body;
  if (!dataParcela) {
    res.status(400).send({ error: "dataParcela é obrigatório" });
  } else {
    try {
      var users = await User.findOne({
        attributes: [
          "id",
          "name",
          [
            sequelize.fn("sum", sequelize.col("histomotoboys.valor")),
            "receivedToday",
          ],
        ],
        where: {
          id: req.params.id,
        },
        order: [["name", "ASC"]],
        include: [
          {
            attributes: [],
            model: HistoMotoboy,
            required: false,
            where: {
              pago: { [Op.not]: true },
              [Op.and]: sequelize.literal(
                'DATE("data") = \'' + dataParcela + "'"
              ),
            },
          },
        ],
        group: ["user.id"],
      });
      var user = users.dataValues;

      var historico = await HistoMotoboy.findAll({
        attributes: ["data", "valor", "parcelanum", "emprestimo.cliente.name"],
        order: [["data", "DESC"]],
        where: {
          userId: req.params.id,
          pago: { [Op.not]: true },
          [Op.and]: sequelize.literal('DATE("data") = \'' + dataParcela + "'"),
        },
        include: [
          {
            attributes: ["id"],
            model: Emprestimo,
            include: [
              {
                attributes: ["name"],
                model: Cliente,
              },
            ],
          },
        ],
      });

      var historicos = historico.map((val) => val.dataValues);

      user.historico = historicos;
      user.dataParcela = dataParcela;

      res.send(user);
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  }
});


/** Fetch motoboy hist by id **/
router.post("/motoboy/:id", async (req, res) => {
  const { dataParcela } = req.body;
  if (!dataParcela) {
    res.status(400).send({ error: "dataParcela é obrigatório" });
  } else {
    try {
      var users = await User.findOne({
        attributes: [
          "id",
          "name",
          [
            sequelize.fn("sum", sequelize.col("histomotoboys.valor")),
            "receivedToday",
          ],
        ],
        where: {
          id: req.params.id,
        },
        order: [["name", "ASC"]],
        include: [
          {
            attributes: [],
            model: HistoMotoboy,
            required: false,
            where: {
              pago: true,
              [Op.and]: sequelize.literal(
                'DATE("data") = \'' + dataParcela + "'"
              ),
            },
          },
        ],
        group: ["user.id"],
      });
      var user = users.dataValues;

      var historico = await HistoMotoboy.findAll({
        attributes: ["data", "valor", "parcelanum", "emprestimo.cliente.name"],
        order: [["data", "DESC"]],
        where: {
          userId: req.params.id,
          pago:true,
          [Op.and]: sequelize.literal('DATE("data") = \'' + dataParcela + "'"),
        },
        include: [
          {
            attributes: ["id"],
            model: Emprestimo,
            include: [
              {
                attributes: ["name"],
                model: Cliente,
              },
            ],
          },
        ],
      });

      var historicos = historico.map((val) => val.dataValues);

      user.historico = historicos;
      user.dataParcela = dataParcela;

      res.send(user);
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  }
});

/** receive from motoboy by id and date **/
router.post("/motoboy/:id/receber", async (req, res) => {
  const { dataParcela } = req.body;
  if (!dataParcela) {
    res.status(400).send({ error: "dataParcela é obrigatório" });
  } else {
    try {
      await HistoMotoboy.update(
        {
          pago: true,
        },
        {
          where: {
            userId: req.params.id,
            [Op.and]: sequelize.literal(
              'DATE("data") = \'' + dataParcela + "'"
            ),
          },
        }
      );

      res.send();
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  }
});

/** receive all from motoboy by id **/
router.post("/motoboy/:id/receberTudo", async (req, res) => {
  try {
    await HistoMotoboy.update(
      {
        pago: true,
      },
      {
        where: {
          userId: req.params.id,
        },
      }
    );

    res.send();
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
  var { username, password, name, authLevel } = req.body;
  if (!username || !password || !name || !authLevel) {
    res.status(400).send("Body is missing required parameters.");
  } else {
    const findUser = await User.findOne({
      where: {
        username: username,
      },
    });
    if (findUser) {
      res.status(400).send("Usuário ja existe.");
    } else {
      try {
        await sequelize.transaction(async (t) => {
          await User.create(
            {
              username: username.toLowerCase(),
              password: password.toLowerCase(),
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
  var { id, password, name, authLevel } = req.body;
  if (id && password && name && authLevel) {
    try {
      await sequelize.transaction(async (t) => {
        await User.update(
          {
            password: password,
            name: name,
            authLevel: authLevel,
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
    await sequelize.transaction(async (t) => {
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
