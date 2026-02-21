const Modelo = require("../models/Modelo");

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
    const modelos = await Modelo.findAll({ order: [["createdAt", "DESC"]] });
    res.json(modelos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar modelos", error });
  }
};

exports.findById = async (req, res) => {
    try {
        const { id } = req.params;
        const model = await Modelo.findByPk(id);
        
        if (!model) return res.status(404).json({ message: "Não encontrado" });

        const content = model.conteudo || "";
        const regex = /{{(.*?)}}/g;
        const matches = [...content.matchAll(regex)].map(match => match[1]);
        
        res.json({
            ...model.toJSON(),
            variaveis: matches.length > 0 ? matches : []
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, categoria, conteudo, variaveis } = req.body;

    const [updated] = await Modelo.update(
      { titulo, categoria, conteudo, variaveis },
      { where: { id: id } },
    );

    if (updated) {
      const updatedModelo = await Modelo.findByPk(id);
      return res.status(200).json(updatedModelo);
    }

    return res
      .status(404)
      .json({ message: "Modelo não encontrado para atualização" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao atualizar modelo jurídico", error });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deletado = await Modelo.destroy({
      where: { id },
    });

    if (deletado) {
      return res.status(204).send();
    }

    return res
      .status(404)
      .json({ message: "Modelo não encontrado para exclusão" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar modelo", error });
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
        res.status(500).json({ message: "Erro ao gerar documento", error });
    }
};
