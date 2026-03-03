const Cliente = require('../models/Cliente');

exports.criarCliente = async (req, res) => {
  try {
    const novoCliente = await Cliente.create({
      ...req.body,
      UserId: req.userId 
    });
    res.status(201).json(novoCliente);
  } catch (error) {
    res.status(500).json({ error: "Erro ao cadastrar cliente." });
  }
};

exports.listarClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      where: { UserId: req.userId },
      order: [['nome_completo', 'ASC']]
    });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar clientes." });
  }
};
