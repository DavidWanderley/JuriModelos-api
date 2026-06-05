const { Processo, Cliente, Modelo, Prazo, User } = require('../models');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ApiResponse = require('../util/ApiResponse');
const HTTP_STATUS = require('../util/httpStatus');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../uploads/processos');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const nome = `PROC_${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, nome);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Apenas arquivos PDF são permitidos.'), false);
};

exports.upload = multer({ storage, fileFilter, limits: { fileSize: 20 * 1024 * 1024 } });

exports.criar = async (req, res) => {
  try {
    if (!req.file) return ApiResponse.error(res, 'PDF do processo é obrigatório.', HTTP_STATUS.BAD_REQUEST);
    const processo = await Processo.create({
      ...req.body,
      pdf_url: `/uploads/processos/${req.file.filename}`,
      UserId: req.userId,
      EscritorioId: req.escritorioId,
      ClienteId: req.body.ClienteId || null,
      ModeloId: req.body.ModeloId || null,
    });
    return ApiResponse.created(res, processo, 'Processo criado com sucesso.');
  } catch (error) {
    return ApiResponse.error(res, 'Erro ao criar processo.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.listar = async (req, res) => {
  try {
    const { busca, status, ordem = 'createdAt', direcao = 'DESC' } = req.query;
    const where = { EscritorioId: req.escritorioId };
    if (status) where.status = status;
    if (busca) {
      where[Op.or] = [
        { titulo:          { [Op.iLike]: `%${busca}%` } },
        { numero_processo: { [Op.iLike]: `%${busca}%` } },
        { tipo_acao:       { [Op.iLike]: `%${busca}%` } },
      ];
    }
    const processos = await Processo.findAll({
      where,
      include: [
        { model: Cliente, as: 'cliente', attributes: ['id', 'nome_completo', 'cpf_cnpj'] },
        { model: Modelo,  as: 'modelo',  attributes: ['id', 'titulo'] },
        { model: Prazo,   as: 'prazos',  attributes: ['id', 'titulo', 'data_prazo', 'status', 'tipo'],
          where: { status: 'pendente' }, required: false },
      ],
      order: [[ordem, direcao]],
    });
    return ApiResponse.success(res, processos);
  } catch (error) {
    return ApiResponse.error(res, 'Erro ao listar processos.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.buscar = async (req, res) => {
  try {
    const processo = await Processo.findOne({
      where: { id: req.params.id, EscritorioId: req.escritorioId },
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Modelo,  as: 'modelo',  attributes: ['id', 'titulo', 'categoria'] },
        { model: Prazo,   as: 'prazos',  order: [['data_prazo', 'ASC']] },
        { model: User,    attributes: ['id', 'nome', 'email'] },
      ],
    });
    if (!processo) return ApiResponse.notFound(res, 'Processo não encontrado.');
    return ApiResponse.success(res, processo);
  } catch (error) {
    return ApiResponse.error(res, 'Erro ao buscar processo.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.atualizar = async (req, res) => {
  try {
    const processo = await Processo.findOne({
      where: { id: req.params.id, EscritorioId: req.escritorioId },
    });
    if (!processo) return ApiResponse.notFound(res, 'Processo não encontrado.');

    const dados = { ...req.body, ClienteId: req.body.ClienteId || null, ModeloId: req.body.ModeloId || null };
    if (req.file) dados.pdf_url = `/uploads/processos/${req.file.filename}`;

    await processo.update(dados);
    await processo.reload();
    return ApiResponse.success(res, processo, 'Processo atualizado com sucesso.');
  } catch (error) {
    return ApiResponse.error(res, 'Erro ao atualizar processo.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.deletar = async (req, res) => {
  try {
    const processo = await Processo.findOne({
      where: { id: req.params.id, EscritorioId: req.escritorioId },
    });
    if (!processo) return ApiResponse.notFound(res, 'Processo não encontrado.');
    await processo.destroy(); // soft delete via paranoid
    return ApiResponse.noContent(res);
  } catch (error) {
    return ApiResponse.error(res, 'Erro ao excluir processo.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};
