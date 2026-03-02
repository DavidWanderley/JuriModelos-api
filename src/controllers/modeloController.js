const Modelo = require("../models/Modelo");

exports.create = async (req, res) => {
  try {
    const novoModelo = await Modelo.create({
      ...req.body,
      pdf_url: req.file ? req.file.filename : null
    });
    res.status(201).json(novoModelo);
  } catch (error) {
    res.status(500).json({ message: "Erro ao salvar o modelo jurídico", error: error.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const modelos = await Modelo.findAll({ order: [["createdAt", "DESC"]] });
    res.json(modelos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar modelos", error: error.message });
  }
};

exports.findById = async (req, res) => {
  try {
    const { id } = req.params;
    const model = await Modelo.findByPk(id);
    
    if (!model) {
      return res.status(404).json({ message: "Modelo não encontrado no banco de dados" });
    }

    const content = model.conteudo || "";
    const regex = /{{(.*?)}}/g;
    const matches = [...content.matchAll(regex)].map(match => match[1]);
    
    res.json({
      ...model.toJSON(),
      variaveis: [...new Set(matches)] 
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao processar a peça jurídica", error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Modelo.update(req.body, { where: { id } });

    if (updated) {
      const updatedModelo = await Modelo.findByPk(id);
      return res.status(200).json(updatedModelo);
    }
    return res.status(404).json({ message: "Modelo não encontrado para atualização" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar modelo jurídico", error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deletado = await Modelo.destroy({ where: { id } });

    if (deletado) {
      return res.status(204).send();
    }
    return res.status(404).json({ message: "Modelo não encontrado para exclusão" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar modelo", error: error.message });
  }
};

exports.generateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body; 

    const model = await Modelo.findByPk(id);
    if (!model) {
      return res.status(404).json({ message: "Modelo não encontrado" });
    }

    let finalContent = model.conteudo;

    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      finalContent = finalContent.replace(regex, data[key]);
    });

    res.json({
      titulo: model.titulo,
      documentoGerado: finalContent
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao gerar documento", error: error.message });
  }
};