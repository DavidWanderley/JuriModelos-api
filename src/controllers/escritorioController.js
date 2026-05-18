const { Escritorio, User, Role, Cliente, DocumentoGerado, Evento } = require('../models');
const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');
const ApiResponse = require('../util/ApiResponse');
const HTTP_STATUS = require('../util/httpStatus');

exports.criar = async (req, res) => {
  try {
    const escritorio = await Escritorio.create(req.body);
    // Apenas vincula ao escritório se não for admin_site
    if (req.userRole !== 'admin_site') {
      await User.update({ EscritorioId: escritorio.id }, { where: { id: req.userId } });
    }
    return ApiResponse.created(res, escritorio, 'Escritório criado com sucesso.');
  } catch (error) {
    return ApiResponse.error(res, 'Erro ao criar escritório.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.buscar = async (req, res) => {
  try {
    const escritorio = await Escritorio.findByPk(req.escritorioId, {
      include: [{ model: User, attributes: ['id', 'nome', 'email', 'oab'], as: 'membros' }]
    });
    if (!escritorio) return ApiResponse.notFound(res, 'Escritório não encontrado.');
    return ApiResponse.success(res, escritorio);
  } catch (error) {
    return ApiResponse.error(res, 'Erro ao buscar escritório.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.atualizar = async (req, res) => {
  try {
    const [updated] = await Escritorio.update(req.body, { where: { id: req.escritorioId } });
    if (!updated) return ApiResponse.notFound(res, 'Escritório não encontrado.');
    const escritorioAtualizado = await Escritorio.findByPk(req.escritorioId);
    return ApiResponse.success(res, escritorioAtualizado, 'Escritório atualizado com sucesso.');
  } catch (error) {
    return ApiResponse.error(res, 'Erro ao atualizar escritório.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

// admin_escritorio: painel com stats e atividade dos membros
exports.painel = async (req, res) => {
  try {
    const membros = await User.findAll({
      where: { EscritorioId: req.escritorioId },
      attributes: ['id', 'nome', 'email', 'oab', 'isActive', 'createdAt'],
      include: [{ model: Role, as: 'role', attributes: ['id', 'name', 'level'] }],
    });

    const statsMembers = await Promise.all(membros.map(async (m) => {
      const [clientes, documentos, eventos] = await Promise.all([
        Cliente.count({ where: { UserId: m.id } }),
        DocumentoGerado.count({ where: { UserId: m.id } }),
        Evento.count({ where: { UserId: m.id } }),
      ]);
      return {
        id: m.id,
        nome: m.nome,
        email: m.email,
        oab: m.oab,
        isActive: m.isActive,
        role: m.role,
        desde: m.createdAt,
        atividade: { clientes, documentos, eventos },
      };
    }));

    const [totalClientes, totalDocumentos, totalEventos] = await Promise.all([
      Cliente.count({ where: { EscritorioId: req.escritorioId } }),
      DocumentoGerado.count({ where: { EscritorioId: req.escritorioId } }),
      Evento.count({ where: { EscritorioId: req.escritorioId } }),
    ]);

    const atividadeRecente = await DocumentoGerado.findAll({
      where: { EscritorioId: req.escritorioId },
      include: [{ model: User, attributes: ['id', 'nome'] }],
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    return ApiResponse.success(res, {
      totais: { clientes: totalClientes, documentos: totalDocumentos, eventos: totalEventos, membros: membros.length },
      membros: statsMembers,
      atividadeRecente,
    });
  } catch (error) {
    return ApiResponse.error(res, 'Erro ao carregar painel.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

// admin_escritorio: alterar role de um membro
exports.atualizarMembroRole = async (req, res) => {
  try {
    const { roleId } = req.body;
    const membro = await User.findOne({ where: { id: req.params.membroId, EscritorioId: req.escritorioId } });
    if (!membro) return ApiResponse.notFound(res, 'Membro não encontrado.');

    // Impede alterar role de outro admin_escritorio ou admin_site
    const roleAtual = await Role.findByPk(membro.RoleId);
    if (roleAtual && ['admin_site', 'admin_escritorio'].includes(roleAtual.name) && membro.id !== req.userId) {
      return ApiResponse.error(res, 'Não é possível alterar o perfil deste membro.', HTTP_STATUS.FORBIDDEN);
    }

    await membro.update({ RoleId: roleId });
    const atualizado = await User.findByPk(membro.id, {
      attributes: ['id', 'nome', 'email'],
      include: [{ model: Role, as: 'role', attributes: ['id', 'name'] }],
    });
    return ApiResponse.success(res, atualizado, 'Perfil do membro atualizado.');
  } catch (error) {
    return ApiResponse.error(res, 'Erro ao atualizar membro.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

// admin_escritorio: remover membro do escritorio
exports.removerMembro = async (req, res) => {
  try {
    const membro = await User.findOne({ where: { id: req.params.membroId, EscritorioId: req.escritorioId } });
    if (!membro) return ApiResponse.notFound(res, 'Membro não encontrado.');
    if (membro.id === req.userId) return ApiResponse.error(res, 'Você não pode remover a si mesmo.', HTTP_STATUS.FORBIDDEN);

    await membro.update({ EscritorioId: null });
    return ApiResponse.success(res, null, 'Membro removido do escritório.');
  } catch (error) {
    return ApiResponse.error(res, 'Erro ao remover membro.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

// admin_escritorio: ativar/desativar membro
exports.toggleMembroStatus = async (req, res) => {
  try {
    const membro = await User.findOne({ where: { id: req.params.membroId, EscritorioId: req.escritorioId } });
    if (!membro) return ApiResponse.notFound(res, 'Membro não encontrado.');
    if (membro.id === req.userId) return ApiResponse.error(res, 'Você não pode alterar seu próprio status.', HTTP_STATUS.FORBIDDEN);

    await membro.update({ isActive: !membro.isActive });
    return ApiResponse.success(res, { isActive: membro.isActive }, `Membro ${membro.isActive ? 'ativado' : 'desativado'}.`);
  } catch (error) {
    return ApiResponse.error(res, 'Erro ao alterar status do membro.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

// admin_site: listar todos os escritórios
exports.listarTodos = async (req, res) => {
  try {
    const escritorios = await Escritorio.findAll({
      include: [{ model: User, attributes: ['id', 'nome', 'email'], as: 'membros' }],
      order: [['createdAt', 'DESC']]
    });

    const resultado = await Promise.all(escritorios.map(async (e) => {
      const [clientes, documentos, eventos] = await Promise.all([
        Cliente.count({ where: { EscritorioId: e.id } }),
        DocumentoGerado.count({ where: { EscritorioId: e.id } }),
        Evento.count({ where: { EscritorioId: e.id } }),
      ]);
      return {
        ...e.toJSON(),
        totais: { clientes, documentos, eventos, membros: e.membros.length },
      };
    }));

    return ApiResponse.success(res, resultado);
  } catch (error) {
    return ApiResponse.error(res, 'Erro ao listar escritórios.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

// admin_site: detalhe de um escritório específico
exports.detalharEscritorio = async (req, res) => {
  try {
    const escritorio = await Escritorio.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'membros',
        attributes: ['id', 'nome', 'email', 'oab', 'isActive', 'createdAt'],
        include: [{ model: Role, as: 'role', attributes: ['id', 'name'] }],
      }],
    });
    if (!escritorio) return ApiResponse.notFound(res, 'Escritório não encontrado.');

    const [clientes, documentos, eventos] = await Promise.all([
      Cliente.count({ where: { EscritorioId: escritorio.id } }),
      DocumentoGerado.count({ where: { EscritorioId: escritorio.id } }),
      Evento.count({ where: { EscritorioId: escritorio.id } }),
    ]);

    return ApiResponse.success(res, {
      ...escritorio.toJSON(),
      totais: { clientes, documentos, eventos, membros: escritorio.membros.length },
    });
  } catch (error) {
    return ApiResponse.error(res, 'Erro ao detalhar escritório.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

// admin_site: ativar/desativar escritório
exports.toggleAtivo = async (req, res) => {
  try {
    const escritorio = await Escritorio.findByPk(req.params.id);
    if (!escritorio) return ApiResponse.notFound(res, 'Escritório não encontrado.');
    await escritorio.update({ isActive: !escritorio.isActive });
    return ApiResponse.success(res, escritorio, `Escritório ${escritorio.isActive ? 'ativado' : 'desativado'}.`);
  } catch (error) {
    return ApiResponse.error(res, 'Erro ao alterar status.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};
