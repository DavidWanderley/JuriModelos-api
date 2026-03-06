const sgMail = require('@sendgrid/mail');
const logger = require('../config/logger');

// Configurar SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  logger.info('✅ SendGrid configurado');
}

// Função para enviar email
const sendMail = async (mailOptions) => {
  try {
    const msg = {
      to: mailOptions.to,
      from: mailOptions.from || process.env.MAIL_USER,
      subject: mailOptions.subject,
      html: mailOptions.html,
    };

    await sgMail.send(msg);
    return { messageId: 'sendgrid-' + Date.now() };
  } catch (error) {
    logger.error('❌ Erro SendGrid:', error.response?.body || error.message);
    throw error;
  }
};

module.exports = { sendMail };