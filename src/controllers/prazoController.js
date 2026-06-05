const { Prazo, Cliente, Modelo } = require('../models');
const ApiResponse = require('../util/ApiResponse');
const HTTP_STATUS = require('../util/httpStatus');

exports.criar = async (req, res) => {
  try {
    const prazo = await Prazo.create({
      ...req.body,
      UserId: req.userId,
      EscritorioId: req.escritorioId,
    });
    return ApiResponse.created(res, prazo, 'Prazo criado com sucesso.');
  } catch (error) {
    return ApiResponse.error(res, 'Erro ao criar prazo.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.listar = async (req, res) => {
  try {
    const prazos = await Prazo.findAll({
      where: { EscritorioId: req.escritorioId },
      include: [
        { model: Cliente, as: 'cliente', attributes: ['id', 'nome_completo', 'cpf_cnpj'] },
        { model: Modelo,  as: 'modelo',  attributes: ['id', 'titulo', 'categoria'] },
      ],
      order: [['data_prazo', 'ASC']],
    });
    return ApiResponse.success(res, prazos);
  } catch (error) {
    return ApiResponse.error(res, 'Erro ao listar prazos.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.buscar = async (req, res) => {
  try {
    const prazo = await Prazo.findOne({
      where: { id: req.params.id, EscritorioId: req.escritorioId },
      include: [
        { model: Cliente, as: 'cliente', attributes: ['id', 'nome_completo', 'cpf_cnpj'] },
        { model: Modelo,  as: 'modelo',  attributes: ['id', 'titulo', 'categoria'] },
      ],
    });
    if (!prazo) return ApiResponse.notFound(res, 'Prazo não encontrado.');
    return ApiResponse.success(res, prazo);
  } catch (error) {
    return ApiResponse.error(res, 'Erro ao buscar prazo.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.atualizar = async (req, res) => {
  try {
    const [updated] = await Prazo.update(req.body, {
      where: { id: req.params.id, EscritorioId: req.escritorioId },
    });
    if (!updated) return ApiResponse.notFound(res, 'Prazo não encontrado.');
    const prazo = await Prazo.findByPk(req.params.id, {
      include: [
        { model: Cliente, as: 'cliente', attributes: ['id', 'nome_completo'] },
        { model: Modelo,  as: 'modelo',  attributes: ['id', 'titulo'] },
      ],
    });
    return ApiResponse.success(res, prazo, 'Prazo atualizado com sucesso.');
  } catch (error) {
    return ApiResponse.error(res, 'Erro ao atualizar prazo.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.deletar = async (req, res) => {
  try {
    const deleted = await Prazo.destroy({ where: { id: req.params.id, EscritorioId: req.escritorioId } });
    if (!deleted) return ApiResponse.notFound(res, 'Prazo não encontrado.');
    return ApiResponse.noContent(res);
  } catch (error) {
    return ApiResponse.error(res, 'Erro ao deletar prazo.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.concluir = async (req, res) => {
  try {
    const [updated] = await Prazo.update(
      { status: 'concluido' },
      { where: { id: req.params.id, EscritorioId: req.escritorioId } }
    );
    if (!updated) return ApiResponse.notFound(res, 'Prazo não encontrado.');
    return ApiResponse.success(res, null, 'Prazo marcado como concluído.');
  } catch (error) {
    return ApiResponse.error(res, 'Erro ao concluir prazo.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};
