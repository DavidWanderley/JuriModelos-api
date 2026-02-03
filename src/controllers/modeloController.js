const Modelo = require('../models/Modelo');

exports.create = async (req, res) => {
    try {
        const { titulo, categoria, conteudo } = req.body;
        const novoModelo = await Modelo.create({ titulo, categoria, conteudo });
        res.status(201).json(novoModelo);
    } catch (error) {
        res.status(500).json({ message: "Erro ao salvar modelo jurídico", error });
    }
};

exports.findAll = async (req, res) => {
    try {
        const modelos = await Modelo.findAll({ order: [['createdAt', 'DESC']] });
        res.json(modelos);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar modelos", error });
    }
};