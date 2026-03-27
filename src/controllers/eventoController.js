const { Evento } = require("../models");
const { Op } = require("sequelize");
const ApiResponse = require("../util/ApiResponse");
const httpStatus = require("../util/httpStatus");
const messages = require("../util/messages");

exports.createEvento = async (req, res) => {
  try {
    const evento = await Evento.create(req.body);
    return ApiResponse.success(res, evento, messages.CREATED, httpStatus.CREATED);
  } catch (error) {
    return ApiResponse.error(res, messages.ERROR, httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.getAllEventos = async (req, res) => {
  try {
    const { mes, ano } = req.query;
    const where = {};

    if (mes && ano) {
      const inicio = `${ano}-${String(mes).padStart(2, "0")}-01`;
      const fim = new Date(ano, mes, 0).toISOString().split("T")[0];
      where.data = { [Op.between]: [inicio, fim] };
    }

    const eventos = await Evento.findAll({ where, order: [["data", "ASC"], ["hora", "ASC"]] });
    return ApiResponse.success(res, eventos);
  } catch (error) {
    return ApiResponse.error(res, messages.ERROR, httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.getEventoById = async (req, res) => {
  try {
    const evento = await Evento.findByPk(req.params.id);
    if (!evento) return ApiResponse.error(res, messages.NOT_FOUND, httpStatus.NOT_FOUND);
    return ApiResponse.success(res, evento);
  } catch (error) {
    return ApiResponse.error(res, messages.ERROR, httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.getProximos = async (req, res) => {
  try {
    const hoje = new Date().toISOString().split("T")[0];
    const eventos = await Evento.findAll({
      where: { data: { [Op.gte]: hoje }, status: "pendente" },
      order: [["data", "ASC"], ["hora", "ASC"]],
      limit: 10,
    });
    return ApiResponse.success(res, eventos);
  } catch (error) {
    return ApiResponse.error(res, messages.ERROR, httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.updateEvento = async (req, res) => {
  try {
    const evento = await Evento.findByPk(req.params.id);
    if (!evento) return ApiResponse.error(res, messages.NOT_FOUND, httpStatus.NOT_FOUND);
    await evento.update(req.body);
    return ApiResponse.success(res, evento, messages.UPDATED);
  } catch (error) {
    return ApiResponse.error(res, messages.ERROR, httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.deleteEvento = async (req, res) => {
  try {
    const evento = await Evento.findByPk(req.params.id);
    if (!evento) return ApiResponse.error(res, messages.NOT_FOUND, httpStatus.NOT_FOUND);
    await evento.destroy();
    return ApiResponse.success(res, null, messages.DELETED);
  } catch (error) {
    return ApiResponse.error(res, messages.ERROR, httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};
