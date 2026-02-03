const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database'); 
const modeloRoutes = require('./routers/modeloRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/modelos', modeloRoutes);

sequelize.sync({ alter: true })
    .then(() => {
        console.log('🟢 Banco sincronizado!');
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => console.log(`🚀 Rodando na porta ${PORT}`));
    });