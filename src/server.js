require('dotenv').config(); 
const express = require('express');
const corsConfig = require('./config/cors.js'); 
const sequelize = require('./config/database.js'); 
const modeloRoutes = require('./routes/modeloRoutes.js');
const authRoutes = require('./routes/authRoutes.js');

const app = express();

app.use(corsConfig);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/modelos', modeloRoutes);

sequelize.sync({ alter: true })
    .then(() => {
        console.log('🟢 Banco de dados CW Advocacia sincronizado!');
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => console.log(`🚀 JuriModelos rodando na porta ${PORT}`));
    })
    .catch(err => {
        console.error('🔴 Erro ao sincronizar banco:', err);
    });