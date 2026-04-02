const { Cliente, DocumentoGerado, Modelo, Template } = require('../models');
const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');
const ApiResponse = require('../util/ApiResponse');
const logger = require('../config/logger');

exports.getStats = async (req, res) => {
  try {
    const [totalClientes, totalDocumentos, totalModelos, totalTemplates] = await Promise.all([
      Cliente.count({ where: { UserId: req.userId } }),
      DocumentoGerado.count({ where: { UserId: req.userId } }),
      Modelo.count(),
      Template.count()
    ]);

    const documentosPorMes = await sequelize.query(`
      SELECT 
        TO_CHAR("createdAt", 'YYYY-MM') AS mes,
        COUNT(*) AS total
      FROM "DocumentoGerados"
      WHERE "UserId" = :userId
        AND "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY mes
      ORDER BY mes ASC
    `, { replacements: { userId: req.userId }, type: QueryTypes.SELECT });

    const clientesPorCidade = await sequelize.query(`
      SELECT cidade, COUNT(*) AS total
      FROM "Clientes"
      WHERE "UserId" = :userId AND cidade IS NOT NULL AND cidade != ''
      GROUP BY cidade
      ORDER BY total DESC
      LIMIT 5
    `, { replacements: { userId: req.userId }, type: QueryTypes.SELECT });

    return ApiResponse.success(res, {
      totalClientes,
      totalDocumentos,
      totalModelos,
      totalTemplates,
      documentosPorMes: documentosPorMes.map(d => ({ mes: d.mes, total: parseInt(d.total) })),
      clientesPorCidade: clientesPorCidade.map(c => ({ cidade: c.cidade, total: parseInt(c.total) }))
    });
  } catch (error) {
    logger.error('Erro ao buscar estatísticas:', error);
    return ApiResponse.error(res, 'Erro ao buscar estatísticas.', 500, error.message);
  }
};
