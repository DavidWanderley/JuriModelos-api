const { Cliente, DocumentoGerado, Modelo, Template, Escritorio, User } = require('../models');
const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');
const ApiResponse = require('../util/ApiResponse');
const logger = require('../config/logger');

exports.getStats = async (req, res) => {
  try {
    const [totalClientes, totalDocumentos, totalModelos, totalTemplates] = await Promise.all([
      Cliente.count({ where: { EscritorioId: req.escritorioId } }),
      DocumentoGerado.count({ where: { EscritorioId: req.escritorioId } }),
      Modelo.count({ where: { EscritorioId: req.escritorioId } }),
      Template.count({ where: { EscritorioId: req.escritorioId } })
    ]);

    const documentosPorMes = await sequelize.query(`
      SELECT 
        TO_CHAR("createdAt", 'YYYY-MM') AS mes,
        COUNT(*) AS total
      FROM documentos_gerados
      WHERE "EscritorioId" = :escritorioId
        AND "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY mes
      ORDER BY mes ASC
    `, { replacements: { escritorioId: req.escritorioId }, type: QueryTypes.SELECT });

    const clientesPorCidade = await sequelize.query(`
      SELECT cidade, COUNT(*) AS total
      FROM clientes
      WHERE "EscritorioId" = :escritorioId AND cidade IS NOT NULL AND cidade != ''
      GROUP BY cidade
      ORDER BY total DESC
      LIMIT 5
    `, { replacements: { escritorioId: req.escritorioId }, type: QueryTypes.SELECT });

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

// admin_site: métricas globais do sistema
exports.getStatsGlobais = async (req, res) => {
  try {
    const [totalEscritorios, totalUsuarios, totalClientes, totalDocumentos, totalModelos] = await Promise.all([
      Escritorio.count(),
      User.count(),
      Cliente.count(),
      DocumentoGerado.count(),
      Modelo.count(),
    ]);

    const escritoriosAtivos = await Escritorio.count({ where: { isActive: true } });

    const crescimentoEscritorios = await sequelize.query(`
      SELECT
        TO_CHAR("createdAt", 'YYYY-MM') AS mes,
        COUNT(*) AS total
      FROM escritorios
      WHERE "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY mes
      ORDER BY mes ASC
    `, { type: QueryTypes.SELECT });

    const topEscritorios = await sequelize.query(`
      SELECT e.id, e.nome, e.plano,
        COUNT(DISTINCT u.id) AS membros,
        COUNT(DISTINCT c.id) AS clientes,
        COUNT(DISTINCT d.id) AS documentos
      FROM escritorios e
      LEFT JOIN "Users" u ON u."EscritorioId" = e.id
      LEFT JOIN clientes c ON c."EscritorioId" = e.id
      LEFT JOIN documentos_gerados d ON d."EscritorioId" = e.id
      GROUP BY e.id, e.nome, e.plano
      ORDER BY documentos DESC
      LIMIT 5
    `, { type: QueryTypes.SELECT });

    return ApiResponse.success(res, {
      totais: { escritorios: totalEscritorios, escritoriosAtivos, usuarios: totalUsuarios, clientes: totalClientes, documentos: totalDocumentos, modelos: totalModelos },
      crescimentoEscritorios: crescimentoEscritorios.map(d => ({ mes: d.mes, total: parseInt(d.total) })),
      topEscritorios: topEscritorios.map(e => ({ ...e, membros: parseInt(e.membros), clientes: parseInt(e.clientes), documentos: parseInt(e.documentos) })),
    });
  } catch (error) {
    logger.error('Erro ao buscar estatísticas globais:', error);
    return ApiResponse.error(res, 'Erro ao buscar estatísticas globais.', 500, error.message);
  }
};
