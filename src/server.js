require('dotenv').config(); 
const express = require('express');
const corsConfig = require('./config/cors.js'); 
const sequelize = require('./config/database.js'); 
const modeloRoutes = require('./routes/modeloRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const documentoRoutes = require('./routes/documentoRoutes.js'); 
const path = require('path');
const fs = require('fs');

const User = require('./models/User');
const DocumentoGerado = require('./models/DocumentoGerado'); 

User.hasMany(DocumentoGerado);
DocumentoGerado.belongsTo(User);

const app = express();

const uploadsPath = path.join(__dirname, '..', 'uploads');
const geradosPath = path.join(uploadsPath, 'gerados');

if (!fs.existsSync(geradosPath)) {
    fs.mkdirSync(geradosPath, { recursive: true });
    console.log('📁 Pastas de upload e gerados criadas com sucesso!');
}

app.use(corsConfig);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/modelos', modeloRoutes);
app.use('/api/documentos', documentoRoutes); 

app.use('/uploads', express.static(uploadsPath));

sequelize.sync({ alter: true })
    .then(() => {
        console.log('🟢 Banco de dados CW Advocacia sincronizado!');
        const PORT = process.env.PORT || 3001; 
        app.listen(PORT, () => console.log(`🚀 JuriModelos rodando na porta ${PORT}`));
    })
    .catch(err => {
        console.error('🔴 Erro ao sincronizar banco:', err);
    });