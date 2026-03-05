const { Cliente, DocumentoGerado, Modelo } = require('../models');
const ApiResponse = require('../util/ApiResponse');
const logger = require('../config/logger');

exports.getStats = async (req, res) => {
  try {
    const [totalClientes, totalDocumentos, totalModelos] = await Promise.all([
      Cliente.count({ where: { UserId: req.userId } }),
      DocumentoGerado.count({ where: { UserId: req.userId } }),
      Modelo.count()
    ]);

    return ApiResponse.success(res, {
      totalClientes,
      totalDocumentos,
      totalModelos
    });
  } catch (error) {
    logger.error('Erro ao buscar estatísticas:', error);
    return ApiResponse.error(res, 'Erro ao buscar estatísticas.', 500, error.message);
  }
};
