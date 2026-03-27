const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

const loginSlowDown = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 5,
  delayMs: (hits) => (hits - 5) * 500,
  maxDelayMs: 10000,
});

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
