const DocumentoGerado = require('../models/DocumentoGerado');

exports.salvarHistorico = async (req, res) => {
  try {
    const { nome_cliente, conteudo_final, modelo_titulo } = req.body;
    
    const novoDoc = await DocumentoGerado.create({
      nome_cliente,
      conteudo_final,
      modelo_titulo,
      UserId: req.userId 
    });

    res.status(201).json(novoDoc);
  } catch (error) {
    console.error("Erro ao salvar histórico:", error);
    res.status(500).json({ error: "Erro interno ao salvar no banco Neon." });
  }
};

exports.listarHistorico = async (req, res) => {
  try {
    const documentos = await DocumentoGerado.findAll({
      where: { UserId: req.userId }, 
      order: [['createdAt', 'DESC']]
    });
    res.json(documentos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar histórico." });
  }
};