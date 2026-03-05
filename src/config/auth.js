module.exports = {
  secret: process.env.JWT_SECRET,
  expiresIn: '1h',
  refreshThreshold: 15 * 60
};