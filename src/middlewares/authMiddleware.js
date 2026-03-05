const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido. Acesso negado." });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ message: "Erro no formato do token." });
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: "Token malformatado." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido ou expirado." });
    }

    req.user = decoded; 
    req.userId = decoded.id;

    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = decoded.exp - now;

    if (timeUntilExpiry < authConfig.refreshThreshold) {
      const newToken = jwt.sign(
        { id: decoded.id, perfil: decoded.perfil },
        authConfig.secret,
        { expiresIn: authConfig.expiresIn }
      );
      
      res.setHeader('X-New-Token', newToken);
    }

    return next(); 
  });
};