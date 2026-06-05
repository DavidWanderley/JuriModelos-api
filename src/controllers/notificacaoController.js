const { Notificacao, Prazo } = require('../models');
const ApiResponse = require('../util/ApiResponse');
const HTTP_STATUS = require('../util/httpStatus');

exports.listar = async (req, res) => {
  try {
    const notificacoes = await Notificacao.findAll({
      where: { UserId: req.userId },
      include: [{ model: Prazo, as: 'prazo', attributes: ['id', 'titulo', 'data_prazo', 'numero_processo'] }],
      order: [['createdAt', 'DESC']],
      limit: 30,
    });
    const naoLidas = await Notificacao.count({ where: { UserId: req.userId, lida: false } });
    return ApiResponse.success(res, { notificacoes, naoLidas });
  } catch (error) {
    return ApiResponse.error(res, 'Erro ao listar notificações.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.marcarLida = async (req, res) => {
  try {
    await Notificacao.update({ lida: true }, { where: { id: req.params.id, UserId: req.userId } });
    return ApiResponse.success(res, null, 'Notificação marcada como lida.');
  } catch (error) {
    return ApiResponse.error(res, 'Erro ao marcar notificação.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.marcarTodasLidas = async (req, res) => {
  try {
    await Notificacao.update({ lida: true }, { where: { UserId: req.userId, lida: false } });
    return ApiResponse.success(res, null, 'Todas as notificações marcadas como lidas.');
  } catch (error) {
    return ApiResponse.error(res, 'Erro ao marcar notificações.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};
