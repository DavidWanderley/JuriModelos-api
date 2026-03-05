const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");
const crypto = require("crypto");
const { Op } = require("sequelize");
const mail = require('../services/mail');

exports.register = async (req, res) => {
  try {
    const {
      nome,
      email,
      senha,
      oab,
      cpf,
      telefone,
      sexo,
      nacionalidade,
      cep,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
    } = req.body;

    const userExists = await User.findOne({
      where: {
        [Op.or]: [{ email }, { cpf }],
      },
    });

    if (userExists) {
      const field = userExists.email === email ? "E-mail" : "CPF";
      return res
        .status(400)
        .json({ message: `Este ${field} já está cadastrado.` });
    }

    const user = await User.create({
      nome,
      email,
      password: senha,
      oab,
      cpf,
      telefone,
      sexo,
      nacionalidade,
      cep,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      perfil: "user",
    });

    res.status(201).json({
      message: "Advogado registrado com sucesso!",
      user: { id: user.id, nome: user.nome, email: user.email },
    });
  } catch (error) {
    console.error("Erro no Registro:", error);
    res
      .status(500)
      .json({ message: "Erro ao registrar usuário", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const token = jwt.sign(
      {
        id: user.id,
        perfil: user.perfil,
      },
      authConfig.secret,
      { expiresIn: authConfig.expiresIn },
    );

    res.json({
      token,
      user: {
        nome: user.nome,
        email: user.email,
        perfil: user.perfil,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(200).json({
        message: "Se este e-mail estiver cadastrado, as instruções foram enviadas.",
      });
    }

    const token = crypto.randomBytes(20).toString("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    await user.update({
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    });

    const linkRecuperacao = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    try {
      await mail.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: "Recuperação de Senha - JuriModelos",
        html: `
          <div style="font-family: sans-serif; color: #0e1e3f; max-width: 600px;">
            <h1 style="color: #f59e0b;">JuriModelos</h1>
            <p>Olá, <strong>${user.nome}</strong>,</p>
            <p>Recebemos uma solicitação para redefinir a senha da sua conta na <strong>CW Advocacia</strong>.</p>
            <p>Para prosseguir, clique no botão abaixo (válido por 1 hora):</p>
            <a href="${linkRecuperacao}" 
               style="background-color: #0e1e3f; color: white; padding: 15px 25px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">
              Redefinir Minha Senha
            </a>
            <p style="margin-top: 30px; font-size: 12px; color: #64748b;">
              Se você não solicitou esta alteração, ignore este e-mail.
            </p>
          </div>
        `,
      });
    } catch (mailError) {
      console.error("❌ Erro ao enviar email:", mailError);
      return res.status(500).json({ 
        message: "Erro ao enviar e-mail. Verifique as configurações de SMTP.",
        error: mailError.message 
      });
    }

    res.status(200).json({
      message: "Instruções de recuperação enviadas para o e-mail informado.",
    });
  } catch (error) {
    console.error("❌ Erro no forgot-password:", error);
    res.status(500).json({ 
      message: "Erro ao processar solicitação.",
      error: error.message 
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          [Op.gt]: new Date(), 
        },
      },
    });

    if (!user) {
      return res.status(400).json({ 
        message: "O link de recuperação é inválido ou expirou. Solicite um novo." 
      });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({ 
      message: "Senha atualizada com sucesso! A CW Advocacia agradece a sua segurança." 
    });

  } catch (error) {
    console.error("ERRO NO RESET PASSWORD:", error);
    return res.status(500).json({ 
      message: "Erro interno ao redefinir senha.", 
      error: error.message 
    });
  }
};