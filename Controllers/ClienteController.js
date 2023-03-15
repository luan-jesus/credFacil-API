/** External Modules **/
var express = require("express");

/** Internal Modules **/
const Cliente = require("../Models").cliente;
const Emprestimo = require("../Models").emprestimo;

var router = express.Router();

/** Fetch all Customer **/
router.get("/clientes", async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      order: [["name", "ASC"]],
    });

    return res.json(clientes);
  } catch (error) {
    return res.status(500).send(error);
  }
});

/** Fetch customer by id **/
router.get("/clientes/:id", async (req, res) => {
  try {
    const cliente = await Cliente.findOne({
      attributes: ["id", "name", "username", "password"],
      where: {
        id: req.params.id,
      },
      include: [
        {
          attributes: [
            "id",
            "status",
            "valorEmprestimo",
            "valorAReceber",
            "valorPago",
            "numParcelas",
            "numParcelasPagas",
            "dataInicio",
          ],
          model: Emprestimo,
          required: false,
          order: [["id", "DESC"]],
          separate: true,
        },
      ],
    });

    return res.send(cliente);
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
});


/* Create new Customer */
router.post("/clientes", async (req, res) => {
  const { name, username, password} = req.body;

  if (!name) {
    return res.status(400).send("Nome é obrigatório");
  }

  if (!username) {
    return res.status(400).send("Usuário é obrigatório");
  }

  if (!password) {
    return res.status(400).send("Senha é obrigatório");
  }

  try {
    const cliente = await Cliente.create(
      {
        name: name,
        username: username.toLowerCase(),
        password: password.toLowerCase(),
      }
    );

    return res.status(201).send(cliente);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

/** Update Customer */
router.put("/clientes", async (req, res) => {
  const { id, name, username, password } = req.body;

  if (!id) {
    return res.status(400).send('Id é obrigatório');
  }

  try {
    const customerToUpdate = await Cliente.findOne({
      where: {
        id: id,
      },
    });

    if (!customerToUpdate) {
      return res.status(404).send('Usuário não encontrado');
    }

    const rowsAffected = await Cliente.update(
      {
        name: name || customerToUpdate.name,
        username: username ? username.toLowerCase() : customerToUpdate.username,
        password: password ? password.toLowerCase() : customerToUpdate.password,
      },
      {
        where: { id: id },
      }
    );
    return res.status(200).send({ rowsAffected: rowsAffected[0] })
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
});

/** Delete Customer **/
router.delete("/clientes/:id", async (req, res) => {
  try {
    const CustomerToDelete = await Cliente.findOne({
      where: { id: req.params.id },
    });

    if (!CustomerToDelete) {
      return res.status(404).send("Record not found");
    }

    await CustomerToDelete.destroy()
    
    return res.status(200).send();
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
