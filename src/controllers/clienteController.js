const { Cliente } = require('../models');
const ApiResponse = require('../util/ApiResponse');
const HTTP_STATUS = require('../util/httpStatus');
const MESSAGES = require('../util/messages');
const logger = require('../config/logger');

exports.criarCliente = async (req, res) => {
  try {
    const novoCliente = await Cliente.create({ ...req.body, UserId: req.userId });
    return ApiResponse.created(res, novoCliente, MESSAGES.CLIENTE_CREATED);
  } catch (error) {
    logger.error('Erro ao cadastrar cliente:', error);
    return ApiResponse.error(res, 'Erro ao cadastrar cliente.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.listarClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      where: { UserId: req.userId },
      order: [['nome_completo', 'ASC']]
    });
    return ApiResponse.success(res, clientes);
  } catch (error) {
    logger.error('Erro ao buscar clientes:', error);
    return ApiResponse.error(res, 'Erro ao buscar clientes.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.buscarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findOne({ where: { id, UserId: req.userId } });
    if (!cliente) return ApiResponse.notFound(res, MESSAGES.CLIENTE_NOT_FOUND);
    return ApiResponse.success(res, cliente);
  } catch (error) {
    logger.error('Erro ao buscar cliente:', error);
    return ApiResponse.error(res, 'Erro ao buscar cliente.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.atualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Cliente.update(req.body, { where: { id, UserId: req.userId } });
    if (!updated) return ApiResponse.notFound(res, MESSAGES.CLIENTE_NOT_FOUND);
    const clienteAtualizado = await Cliente.findByPk(id);
    return ApiResponse.success(res, clienteAtualizado, MESSAGES.CLIENTE_UPDATED);
  } catch (error) {
    logger.error('Erro ao atualizar cliente:', error);
    return ApiResponse.error(res, 'Erro ao atualizar cliente.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.deletarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Cliente.destroy({ where: { id, UserId: req.userId } });
    if (!deleted) return ApiResponse.notFound(res, MESSAGES.CLIENTE_NOT_FOUND);
    return ApiResponse.noContent(res);
  } catch (error) {
    logger.error('Erro ao deletar cliente:', error);
    return ApiResponse.error(res, 'Erro ao deletar cliente.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};
