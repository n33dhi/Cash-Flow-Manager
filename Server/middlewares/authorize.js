const jwt = require("jsonwebtoken");

const AuthController = (allowedRoles) => {
  return (req, res, next) => {
    const authToken = req.headers['authorization'];
    const token = authToken && authToken.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Access token required" });
  
    jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid access token" });
      const userRole = decoded.Role;
      
      if (allowedRoles.includes(userRole)) {
        req.user = { id: decoded.Id, email: decoded.Email, role: userRole };
        next()
      } else {
        return res.status(403).json({ message: "Unauthorized User!" });
      }
    })
  }
}

module.exports = AuthController;