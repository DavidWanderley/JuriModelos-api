const nodemailer = require('nodemailer');
const logger = require('../config/logger');
const dns = require('dns');

dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  connectionTimeout: 15000, 
  greetingTimeout: 15000,
  socketTimeout: 15000,
  dnsTimeout: 5000,
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  }
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