const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173',   
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'juri-modelos-app.vercel.app', 
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Acesso não permitido por política de CORS: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: [
    'Content-Type',
    'Authorization', 
  ],
  credentials: true, 
};

module.exports = cors(corsOptions);