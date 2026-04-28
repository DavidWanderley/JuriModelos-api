const { Escritorio, User } = require('../models');
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

// admin_site: listar todos os escritórios
exports.listarTodos = async (req, res) => {
  try {
    const escritorios = await Escritorio.findAll({
      include: [{ model: User, attributes: ['id', 'nome', 'email'], as: 'membros' }],
      order: [['createdAt', 'DESC']]
    });
    return ApiResponse.success(res, escritorios);
  } catch (error) {
    return ApiResponse.error(res, 'Erro ao listar escritórios.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
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
