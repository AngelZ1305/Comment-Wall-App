const jwt = require("jsonwebtoken");

function createAuthenticateToken(jwtSecret) {
  return function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const headerToken = authHeader && authHeader.split(" ")[1];
    const cookieToken = req.cookies.token;
    const token = headerToken || cookieToken;

    if (!token) {
      return res.status(401).json({ error: "Token requerido" });
    }

    jwt.verify(token, jwtSecret, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Token invalido o expirado" });
      }

      req.user = user;
      return next();
    });
  };
}

module.exports = createAuthenticateToken;
