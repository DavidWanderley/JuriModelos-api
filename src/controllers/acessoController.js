const { AcessoIndividual, User, Role } = require('../models');
const ApiResponse = require('../util/ApiResponse');
const HTTP_STATUS = require('../util/httpStatus');

// Mapeamento padrão de complexidade por role
const COMPLEXIDADE_POR_ROLE = {
  admin_site:       ['Baixa', 'Média', 'Alta'],
  admin_escritorio: ['Baixa', 'Média', 'Alta'],
  advogado:         ['Baixa', 'Média'],
  funcionario:      ['Baixa', 'Média'],
  estagiario:       ['Baixa'],
};

// Retorna as complexidades que o usuário pode acessar (role + exceções individuais)
const resolverComplexidades = async (userId, roleName) => {
  const base = COMPLEXIDADE_POR_ROLE[roleName] || ['Baixa'];

  const excecoes = await AcessoIndividual.findAll({
    where: { UserId: userId, tipo: 'complexidade' },
  });

  const liberadas = new Set(base);
  for (const ex of excecoes) {
    if (ex.granted) liberadas.add(ex.valor);
    else liberadas.delete(ex.valor);
  }

  return [...liberadas];
};

// Retorna ids de modelos com acesso individual explícito (granted ou blocked)
const resolverModelosIndividuais = async (userId) => {
  const excecoes = await AcessoIndividual.findAll({
    where: { UserId: userId, tipo: 'modelo' },
  });
  return {
    liberados: excecoes.filter(e => e.granted).map(e => parseInt(e.valor)),
    bloqueados: excecoes.filter(e => !e.granted).map(e => parseInt(e.valor)),
  };
};

exports.resolverComplexidades = resolverComplexidades;
exports.resolverModelosIndividuais = resolverModelosIndividuais;

// GET /escritorios/meu/acessos/:membroId — listar acessos individuais de um membro
exports.listarAcessos = async (req, res) => {
  try {
    const membro = await User.findOne({
      where: { id: req.params.membroId, EscritorioId: req.escritorioId },
    });
    if (!membro) return ApiResponse.notFound(res, 'Membro não encontrado.');

    const acessos = await AcessoIndividual.findAll({ where: { UserId: membro.id } });
    return ApiResponse.success(res, acessos);
  } catch (error) {
    return ApiResponse.error(res, 'Erro ao listar acessos.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

// PUT /escritorios/meu/acessos/:membroId — salvar acessos individuais de um membro
exports.salvarAcessos = async (req, res) => {
  try {
    const membro = await User.findOne({
      where: { id: req.params.membroId, EscritorioId: req.escritorioId },
    });
    if (!membro) return ApiResponse.notFound(res, 'Membro não encontrado.');

    // acessos: [{ tipo, valor, granted }]
    const { acessos } = req.body;
    if (!Array.isArray(acessos)) {
      return ApiResponse.error(res, 'Campo acessos deve ser um array.', HTTP_STATUS.BAD_REQUEST);
    }

    // Remove todos os acessos anteriores e recria
    await AcessoIndividual.destroy({ where: { UserId: membro.id, EscritorioId: req.escritorioId } });

    const criados = await AcessoIndividual.bulkCreate(
      acessos.map(a => ({
        UserId: membro.id,
        EscritorioId: req.escritorioId,
        tipo: a.tipo,
        valor: String(a.valor),
        granted: a.granted !== false,
      }))
    );

    return ApiResponse.success(res, criados, 'Acessos atualizados com sucesso.');
  } catch (error) {
    return ApiResponse.error(res, 'Erro ao salvar acessos.', HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

// GET /escritorios/meu/complexidades — retorna mapeamento padrão por role
exports.listarComplexidadesPorRole = async (req, res) => {
  return ApiResponse.success(res, COMPLEXIDADE_POR_ROLE);
};
