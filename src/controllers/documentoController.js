const { DocumentoGerado } = require("../models");
const htmlToDocx = require("html-to-docx");
const fs = require("fs");
const path = require("path");

exports.salvarHistorico = async (req, res) => {
  try {
    const { nome_cliente, conteudo_final, modelo_titulo } = req.body;

    const nomeTratado = nome_cliente
      ? nome_cliente.replace(/\s+/g, "_").substring(0, 30)
      : "Sem_Nome";

    const timestamp = Date.now();
    const nomeArquivo = `CW_${timestamp}_${nomeTratado}.docx`;

    const htmlCompleto = `<!DOCTYPE html><html><body style="font-family: Arial;">${conteudo_final}</body></html>`;

    const docBuffer = await htmlToDocx(htmlCompleto, null, {
      margin: { top: 1701, right: 1134, bottom: 1134, left: 1701 },
    });

    const caminhoFisico = path.join(
      __dirname,
      "../../uploads/gerados",
      nomeArquivo,
    );

    fs.writeFileSync(caminhoFisico, docBuffer);

    await DocumentoGerado.create({
      nome_cliente: nome_cliente || "Não informado",
      caminho_arquivo: `/uploads/gerados/${nomeArquivo}`,
      modelo_titulo: modelo_titulo || "Modelo Avulso",
      UserId: req.userId,
    });

    res.status(201).json({
      message: "Documento arquivado!",
      downloadUrl: `${process.env.API_URL || 'http://localhost:5000'}/uploads/gerados/${nomeArquivo}`,
    });
  } catch (error) {
    console.error("Erro na geração do arquivo:", error);
    res.status(500).json({ error: "Falha ao processar e salvar o documento." });
  }
};

exports.listarHistorico = async (req, res) => {
  try {
    const documentos = await DocumentoGerado.findAll({
      where: { UserId: req.userId },
      order: [["createdAt", "DESC"]],
    });
    res.json(documentos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao carregar histórico." });
  }
};
