const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

// Após 5 tentativas, começa a adicionar 500ms de delay por tentativa extra
const loginSlowDown = slowDown({
  windowMs: 15 * 60 * 1000, // janela de 15 minutos
  delayAfter: 5,
  delayMs: (hits) => (hits - 5) * 500, // 500ms, 1000ms, 1500ms...
  maxDelayMs: 10000, // máximo de 10s de delay
});

// Bloqueia após 10 tentativas em 15 minutos
const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Muitas tentativas de login. Tente novamente em 15 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginSlowDown, loginRateLimit };
