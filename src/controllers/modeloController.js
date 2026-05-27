const { Modelo } = require("../models");
const { Op } = require('sequelize');
const { resolverComplexidades, resolverModelosIndividuais } = require('./acessoController');

exports.create = async (req, res) => {
  try {
    const novoModelo = await Modelo.create({
      ...req.body,
      EscritorioId: req.escritorioId,
      pdf_url: req.file ? req.file.filename : null,
    });
    res.status(201).json(novoModelo);
  } catch (error) {
    res.status(500).json({ message: "Erro ao salvar o modelo jurídico", error: error.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const complexidades = await resolverComplexidades(req.userId, req.userRole);
    const { liberados, bloqueados } = await resolverModelosIndividuais(req.userId);

    const modelos = await Modelo.findAll({
      where: { EscritorioId: req.escritorioId },
      order: [["createdAt", "DESC"]]
    });

    const modelosFiltrados = modelos.filter(m => {
      if (bloqueados.includes(m.id)) return false;
      if (liberados.includes(m.id)) return true;
      if (!m.complexidade) return true;
      return complexidades.includes(m.complexidade);
    });

    res.json(modelosFiltrados);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar modelos", error: error.message });
  }
};

exports.findById = async (req, res) => {
  try {
    const { id } = req.params;
    const model = await Modelo.findOne({ where: { id, EscritorioId: req.escritorioId } });

    if (!model) {
      return res.status(404).json({ message: "Modelo não encontrado no banco de dados" });
    }

    const { liberados, bloqueados } = await resolverModelosIndividuais(req.userId);
    if (bloqueados.includes(model.id)) {
      return res.status(403).json({ message: "Acesso negado a este modelo." });
    }
    if (!liberados.includes(model.id)) {
      const complexidades = await resolverComplexidades(req.userId, req.userRole);
      if (model.complexidade && !complexidades.includes(model.complexidade)) {
        return res.status(403).json({ message: "Acesso negado. Complexidade não permitida para seu perfil." });
      }
    }

    const content = model.conteudo || "";
    const regex = /{{(.*?)}}/g;
    const matches = [...content.matchAll(regex)].map((match) => match[1]);

    res.json({
      ...model.toJSON(),
      variaveis: [...new Set(matches)],
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erro ao processar a peça jurídica",
        error: error.message,
      });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const dadosParaAtualizar = { ...req.body };
    if (req.file) dadosParaAtualizar.pdf_url = req.file.filename;

    const [updated] = await Modelo.update(dadosParaAtualizar, {
      where: { id, EscritorioId: req.escritorioId },
    });

    if (updated) {
      const modeloAtualizado = await Modelo.findByPk(id);
      return res.status(200).json(modeloAtualizado);
    }
    return res.status(404).json({ message: "Modelo não encontrado" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar", error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deletado = await Modelo.destroy({ where: { id, EscritorioId: req.escritorioId } });
    if (deletado) return res.status(204).send();
    return res.status(404).json({ message: "Modelo não encontrado para exclusão" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar modelo", error: error.message });
  }
};

exports.generateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;

    const model = await Modelo.findOne({ where: { id, EscritorioId: req.escritorioId } });
    if (!model) return res.status(404).json({ message: "Modelo não encontrado" });

    let finalContent = model.conteudo;
    Object.keys(data).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      finalContent = finalContent.replace(regex, data[key]);
    });

    res.json({ titulo: model.titulo, documentoGerado: finalContent });
  } catch (error) {
    res.status(500).json({ message: "Erro ao gerar documento", error: error.message });
  }
};
