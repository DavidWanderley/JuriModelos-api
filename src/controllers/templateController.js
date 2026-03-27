const { Template } = require("../models");
const ApiResponse = require("../util/ApiResponse");
const httpStatus = require("../util/httpStatus");
const messages = require("../util/messages");

exports.createTemplate = async (req, res) => {
  try {
    const template = await Template.create(req.body);
    return ApiResponse.success(res, template, messages.CREATED, httpStatus.CREATED);
  } catch (error) {
    return ApiResponse.error(res, messages.ERROR, httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await Template.findAll({ order: [["createdAt", "DESC"]] });
    return ApiResponse.success(res, templates);
  } catch (error) {
    return ApiResponse.error(res, messages.ERROR, httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.getTemplateById = async (req, res) => {
  try {
    const template = await Template.findByPk(req.params.id);
    if (!template) {
      return ApiResponse.error(res, messages.NOT_FOUND, httpStatus.NOT_FOUND);
    }
    return ApiResponse.success(res, template);
  } catch (error) {
    return ApiResponse.error(res, messages.ERROR, httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.updateTemplate = async (req, res) => {
  try {
    const template = await Template.findByPk(req.params.id);
    if (!template) {
      return ApiResponse.error(res, messages.NOT_FOUND, httpStatus.NOT_FOUND);
    }
    await template.update(req.body);
    return ApiResponse.success(res, template, messages.UPDATED);
  } catch (error) {
    return ApiResponse.error(res, messages.ERROR, httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findByPk(req.params.id);
    if (!template) {
      return ApiResponse.error(res, messages.NOT_FOUND, httpStatus.NOT_FOUND);
    }
    await template.destroy();
    return ApiResponse.success(res, null, messages.DELETED);
  } catch (error) {
    return ApiResponse.error(res, messages.ERROR, httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};
