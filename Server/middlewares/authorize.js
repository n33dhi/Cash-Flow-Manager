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
        req.user = { email: decoded.Email, role: userRole };
        next()
      } else {
        return res.status(403).json({ message: "Unauthorized User!" });
      }
    })
  }
}

module.exports = AuthController;


// const VerifyUser = (req, res, next) => {
//   const accessToken = req.cookies.accessToken;
//   if (!accessToken) {
//     if (renewToken(req, res)) {
//       next();
//     } else {
//       res.status(401).json({ valid: false, message: "Authentication required" });
//     }
//   } else {
//     jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN, (err, decoded) => {
//       if (err) {
//         return res.status(401).json({ valid: false, message: "Invalid access token" });
//       } else {
//         req.email = decoded.Email;
//         req.role = decoded.Role;
//         if (decoded.Role === "admin") {
//             res.status(200).json({ valid: true, message: "Authorized" });
//             next();
//         } else {
//             res.status(403).json({ valid: false, message: "Deauthorized" });
//         }
//       }
//     });
//   }
// };

// const renewToken = (req, res) => {
//   const refreshToken = req.cookies.refreshToken;
//   if (!refreshToken) {
//     return res.json({valid: false, message: "no refresh token"})
//   }

//   jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, decoded) => {
//     if (err) {
//       res.status(401).json({ valid: false, message: "Invalid refresh token" });
//       return false;
//     } else {
//       const accessToken = jwt.sign(
//         { Email: decoded.Email, Role: decoded.Role }, 
//         process.env.JWT_ACCESS_TOKEN,
//         { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
//       );

//       res.cookie("accessToken", accessToken, { maxAge: 60000, httpOnly: true }); 
//       return true;
//     }
//   });
// };

// module.exports = VerifyUser;
