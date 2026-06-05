const cron = require('node-cron');
const { Op } = require('sequelize');
const { Evento, Modelo, User, Prazo, Notificacao } = require('../models');
const { sendMail } = require('./mail');

const formatData = (data) => {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
};

const buildEmailHtml = (nomeUsuario, eventos, modelosAudiencia) => {
  const totalItens = eventos.length + modelosAudiencia.length;

  const linhasEventos = eventos.map(e => `
    <tr>
      <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9;">
        <strong style="color: #1e293b;">${e.titulo}</strong>
        <span style="display:block; font-size:12px; color:#64748b;">${e.tipo} ${e.hora ? '· ' + e.hora : ''} ${e.local ? '· ' + e.local : ''}</span>
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; text-align:right;">
        <span style="background:#fef3c7; color:#d97706; font-size:11px; font-weight:bold; padding:3px 8px; border-radius:20px;">${e.prioridade}</span>
      </td>
    </tr>
  `).join('');

  const linhasModelos = modelosAudiencia.map(m => `
    <tr>
      <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9;">
        <strong style="color: #1e293b;">${m.titulo}</strong>
        <span style="display:block; font-size:12px; color:#64748b;">Audiência ${m.hora_audiencia ? '· ' + m.hora_audiencia : ''}</span>
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; text-align:right;">
        <span style="background:#fef3c7; color:#d97706; font-size:11px; font-weight:bold; padding:3px 8px; border-radius:20px;">Modelo</span>
      </td>
    </tr>
  `).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
      <div style="background: #0e1e3f; padding: 32px; text-align: center;">
        <h1 style="color: #f59e0b; margin: 0; font-size: 24px;">JuriModelos</h1>
        <p style="color: #94a3b8; margin: 8px 0 0; font-size: 14px;">Plataforma Jurídica</p>
      </div>

      <div style="padding: 32px;">
        <h2 style="color: #1e293b; margin: 0 0 8px;">Olá, ${nomeUsuario}! 👋</h2>
        <p style="color: #64748b; margin: 0 0 24px;">
          Você tem <strong>${totalItens} compromisso(s)</strong> agendado(s) para amanhã.
        </p>

        <table style="width:100%; border-collapse:collapse; background:#fff; border-radius:12px; overflow:hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <thead>
            <tr style="background:#f1f5f9;">
              <th style="padding:12px 16px; text-align:left; font-size:11px; color:#94a3b8; text-transform:uppercase; letter-spacing:1px;">Compromisso</th>
              <th style="padding:12px 16px; text-align:right; font-size:11px; color:#94a3b8; text-transform:uppercase; letter-spacing:1px;">Tipo</th>
            </tr>
          </thead>
          <tbody>
            ${linhasEventos}
            ${linhasModelos}
          </tbody>
        </table>

        <div style="margin-top: 24px; text-align: center;">
          <a href="${process.env.FRONTEND_URL}/agenda"
             style="background:#f59e0b; color:#fff; padding:14px 28px; border-radius:10px; font-weight:bold; text-decoration:none; display:inline-block;">
            Ver Agenda Completa
          </a>
        </div>
      </div>

      <div style="padding: 20px 32px; text-align:center; font-size:12px; color:#94a3b8; border-top: 1px solid #e2e8f0;">
        © ${new Date().getFullYear()} JuriModelos
      </div>
    </div>
  `;
};

const enviarNotificacoesAmanha = async () => {
  try {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    const dataAmanha = amanha.toISOString().split('T')[0];

    const usuarios = await User.findAll({ where: { isActive: true } });

    for (const usuario of usuarios) {
      const [eventos, modelos] = await Promise.all([
        Evento.findAll({
          where: { UserId: usuario.id, data: dataAmanha, status: 'pendente' },
          order: [['hora', 'ASC']],
        }),
        Modelo.findAll({
          where: { UserId: usuario.id, data_audiencia: dataAmanha },
        }),
      ]);

      if (eventos.length === 0 && modelos.length === 0) continue;

      const html = buildEmailHtml(usuario.nome, eventos, modelos);

      await sendMail({
        to: usuario.email,
        from: process.env.MAIL_USER,
        subject: `📅 ${eventos.length + modelos.length} compromisso(s) para amanhã - ${formatData(dataAmanha)}`,
        html,
      });
    }
  } catch (error) {
    console.error('Erro ao enviar notificações:', error.message);
  }
};

const iniciarNotificacoes = () => {
  cron.schedule('0 20 * * *', enviarNotificacoesAmanha, { timezone: 'America/Fortaleza' });
  cron.schedule('0 20 * * *', verificarPrazos,          { timezone: 'America/Fortaleza' });
};

const verificarPrazos = async () => {
  try {
    const hoje   = new Date();
    const d1     = new Date(hoje); d1.setDate(d1.getDate() + 1);
    const d7     = new Date(hoje); d7.setDate(d7.getDate() + 7);

    const toStr  = (d) => d.toISOString().split('T')[0];
    const datas  = [toStr(hoje), toStr(d1), toStr(d7)];

    const prazos = await Prazo.findAll({
      where: { data_prazo: { [Op.in]: datas }, status: 'pendente' },
      include: [
        { model: User,    attributes: ['id', 'nome', 'email'] },
        { association: 'cliente', attributes: ['nome_completo'] },
        { association: 'modelo',  attributes: ['titulo'] },
      ],
    });

    for (const prazo of prazos) {
      const diasRestantes = Math.round((new Date(prazo.data_prazo) - hoje) / (1000 * 60 * 60 * 24));
      const quando = diasRestantes === 0 ? 'HOJE' : diasRestantes === 1 ? 'amanhã' : 'em 7 dias';
      const mensagem = `⚖️ Prazo "${prazo.titulo}" vence ${quando} (${prazo.data_prazo})${prazo.numero_processo ? ` — Proc. ${prazo.numero_processo}` : ''}`;

      // Notificação no sino
      const jaExiste = await Notificacao.findOne({
        where: { UserId: prazo.UserId, PrazoId: prazo.id, mensagem },
      });
      if (!jaExiste) {
        await Notificacao.create({ UserId: prazo.UserId, PrazoId: prazo.id, mensagem, tipo: 'prazo' });
      }

      // E-mail
      await sendMail({
        to: prazo.User.email,
        from: process.env.MAIL_USER,
        subject: `⚖️ Prazo processual vence ${quando} - ${prazo.titulo}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background:#0e1e3f; padding:24px; text-align:center;">
              <h1 style="color:#f59e0b; margin:0;">JuriModelos</h1>
            </div>
            <div style="padding:32px;">
              <h2 style="color:#1e293b;">⚖️ Alerta de Prazo Processual</h2>
              <p>Olá, <strong>${prazo.User.nome}</strong>!</p>
              <table style="width:100%; border-collapse:collapse; background:#f8fafc; border-radius:8px;">
                <tr><td style="padding:10px 16px; font-weight:bold; color:#64748b;">Processo</td><td style="padding:10px 16px;">${prazo.titulo}</td></tr>
                ${prazo.numero_processo ? `<tr><td style="padding:10px 16px; font-weight:bold; color:#64748b;">Nº Processo</td><td style="padding:10px 16px;">${prazo.numero_processo}</td></tr>` : ''}
                ${prazo.cliente ? `<tr><td style="padding:10px 16px; font-weight:bold; color:#64748b;">Cliente</td><td style="padding:10px 16px;">${prazo.cliente.nome_completo}</td></tr>` : ''}
                ${prazo.modelo ? `<tr><td style="padding:10px 16px; font-weight:bold; color:#64748b;">Documento</td><td style="padding:10px 16px;">${prazo.modelo.titulo}</td></tr>` : ''}
                <tr><td style="padding:10px 16px; font-weight:bold; color:#64748b;">Data do Prazo</td><td style="padding:10px 16px; color:#ef4444; font-weight:bold;">${prazo.data_prazo}${prazo.hora ? ' às ' + prazo.hora : ''}</td></tr>
                <tr><td style="padding:10px 16px; font-weight:bold; color:#64748b;">Vencimento</td><td style="padding:10px 16px; color:#f59e0b; font-weight:bold;">${quando.toUpperCase()}</td></tr>
              </table>
              <div style="margin-top:24px; text-align:center;">
                <a href="${process.env.FRONTEND_URL}/prazos" style="background:#0e1e3f; color:#fff; padding:14px 28px; border-radius:10px; font-weight:bold; text-decoration:none;">Ver Prazos</a>
              </div>
            </div>
          </div>
        `,
      });
    }
  } catch (error) {
    console.error('Erro ao verificar prazos:', error.message);
  }
};

module.exports = { iniciarNotificacoes, enviarNotificacoesAmanha, verificarPrazos };
