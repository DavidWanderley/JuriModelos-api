const sgMail = require('@sendgrid/mail');

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const sendMail = async (mailOptions) => {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY não configurada');
  }
  
  const msg = {
    to: mailOptions.to,
    from: mailOptions.from || process.env.MAIL_USER,
    subject: mailOptions.subject,
    html: mailOptions.html,
  };

  await sgMail.send(msg);
  return { messageId: 'sendgrid-' + Date.now() };
};

module.exports = { sendMail };
