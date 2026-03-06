const nodemailer = require('nodemailer');
const logger = require('../config/logger');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST, 
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_PORT == 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  connectionTimeout: 10000, 
  greetingTimeout: 10000,
  socketTimeout: 10000,
  family: 4,
});

// Verificar conexão ao iniciar
transporter.verify((error, success) => {
  if (error) {
    logger.error('❌ Erro na configuração de email:', error);
  } else {
    logger.info('✅ Servidor de email pronto para enviar mensagens');
  }
});

module.exports = transporter;