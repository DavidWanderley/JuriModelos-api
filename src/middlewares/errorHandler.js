const HTTP_STATUS = require('../util/httpStatus');

const errorHandler = (err, req, res, next) => {
  console.error('❌ Erro capturado:', err);

  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Erro interno do servidor';

  const response = {
    success: false,
    message
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.details = err.details;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
