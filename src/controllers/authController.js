const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth'); 

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: "Este e-mail já está em uso." });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ 
            name, 
            email, 
            password: hashedPassword 
        });

        res.status(201).json({
            message: "Usuário registrado com sucesso!",
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: "Erro ao registrar usuário", error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: "Usuário não encontrado" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }
        
        const token = jwt.sign(
            { id: user.id }, 
            authConfig.secret, 
            { expiresIn: authConfig.expiresIn }
        );
        
        res.json({ 
            token, 
            user: { name: user.name, email: user.email } 
        });
    } catch (error) {
        res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
};