const nodemailer = require('nodemailer');

// Configurar transporter do Gmail
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: process.env.MAIL_PORT || 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Função para enviar email
const sendMail = async (mailOptions) => {
  console.log('🔵 [MAIL] Iniciando envio de email...');
  console.log('🔵 [MAIL] Para:', mailOptions.to);
  console.log('🔵 [MAIL] De:', mailOptions.from || process.env.MAIL_USER);
  console.log('🔵 [MAIL] MAIL_USER:', process.env.MAIL_USER);
  console.log('🔵 [MAIL] MAIL_PASS configurado?', !!process.env.MAIL_PASS);
  
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    const error = new Error('MAIL_USER ou MAIL_PASS não configurados');
    console.error('❌ [MAIL]', error.message);
    throw error;
  }
  
  try {
    console.log('🔵 [MAIL] Enviando via Gmail SMTP...');
    const info = await transporter.sendMail({
      from: mailOptions.from || `"JuriModelos" <${process.env.MAIL_USER}>`,
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: mailOptions.html,
    });
    
    console.log('✅ [MAIL] Email enviado:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ [MAIL] Erro:', error.message);
    console.error('❌ [MAIL] Stack:', error.stack);
    throw error;
  }
};

module.exports = { sendMail };