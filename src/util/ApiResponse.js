const HTTP_STATUS = require('./httpStatus');

class ApiResponse {
  static success(res, data, message = null, statusCode = HTTP_STATUS.OK) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static error(res, message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, details = null) {
    const response = {
      success: false,
      message
    };

    if (process.env.NODE_ENV === 'development' && details) {
      response.details = details;
    }

    return res.status(statusCode).json(response);
  }

  static created(res, data, message = 'Criado com sucesso') {
    return this.success(res, data, message, HTTP_STATUS.CREATED);
  }

  static noContent(res) {
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  }

  static notFound(res, message = 'Recurso não encontrado') {
    return this.error(res, message, HTTP_STATUS.NOT_FOUND);
  }

  static badRequest(res, message = 'Requisição inválida') {
    return this.error(res, message, HTTP_STATUS.BAD_REQUEST);
  }

  static unauthorized(res, message = 'Não autorizado') {
    return this.error(res, message, HTTP_STATUS.UNAUTHORIZED);
  }
}

module.exports = ApiResponse;
