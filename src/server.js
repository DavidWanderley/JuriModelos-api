require('dotenv').config(); 
const express = require('express');
const corsConfig = require('./config/cors.js'); 
const { sequelize } = require('./models');
const modeloRoutes = require('./routes/modeloRoutes.js');
const templateRoutes = require('./routes/templateRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const documentoRoutes = require('./routes/documentoRoutes.js'); 
const clienteRoutes = require('./routes/clienteRoutes');
const userRoutes = require('./routes/userRoutes');
const statsRoutes = require('./routes/statsRoutes');
const cepRoutes = require('./routes/cepRoutes');
const path = require('path');
const fs = require('fs');

const app = express();

const uploadsPath = path.join(__dirname, '..', 'uploads');
const geradosPath = path.join(uploadsPath, 'gerados');

if (!fs.existsSync(geradosPath)) {
    fs.mkdirSync(geradosPath, { recursive: true });
    console.log('📁 Pastas de upload e gerados criadas com sucesso!');
}

app.use(corsConfig);
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'JuriModelos API Online' });
});

app.use('/api/auth', authRoutes);
app.use('/api/modelos', modeloRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/documentos', documentoRoutes); 
app.use('/api/clientes', clienteRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/buscar-cep', cepRoutes);

app.use('/uploads', express.static(uploadsPath));

// Middleware de erro global (deve ser o último)
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

sequelize.sync({ alter: true })
    .then(() => {
        console.log('🟢 Banco de dados CW Advocacia sincronizado!');
        const PORT = process.env.PORT || 10000;
        app.listen(PORT, () => console.log(`🚀 JuriModelos rodando na porta ${PORT}`));
    })
    .catch(err => {
        console.error('🔴 Erro ao sincronizar banco:', err);
    });