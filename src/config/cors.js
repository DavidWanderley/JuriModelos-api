const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173',   
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL || 'https://juri-modelos-app.vercel.app', 
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`⚠️ Origem bloqueada por CORS: ${origin}`);
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: [
    'Content-Type',
    'Authorization', 
  ],
  credentials: true, 
};

module.exports = cors(corsOptions);