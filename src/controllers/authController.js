const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");

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
        [require("sequelize").Op.or]: [{ email }, { cpf }],
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
