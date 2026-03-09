const sgMail = require('@sendgrid/mail');

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('✅ SendGrid configurado');
} else {
  console.warn('⚠️ SENDGRID_API_KEY não configurada');
}

const sendMail = async (mailOptions) => {
  console.log('🔵 [MAIL] Iniciando envio de email...');
  console.log('🔵 [MAIL] Para:', mailOptions.to);
  console.log('🔵 [MAIL] SendGrid configurado?', !!process.env.SENDGRID_API_KEY);
  
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY não configurada');
  }
  
  try {
    const msg = {
      to: mailOptions.to,
      from: mailOptions.from || process.env.MAIL_USER,
      subject: mailOptions.subject,
      html: mailOptions.html,
    };

    console.log('🔵 [MAIL] Enviando via SendGrid API...');
    await sgMail.send(msg);
    console.log('✅ [MAIL] Email enviado com sucesso!');
    return { messageId: 'sendgrid-' + Date.now() };
  } catch (error) {
    console.error('❌ [MAIL] Erro:', error.response?.body || error.message);
    throw error;
  }
};

module.exports = { sendMail };
