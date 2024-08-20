const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");

// Middleware for handling auth
function authMiddleware(req, res, next) {
  const token = req.headers.authorization;
  console.log(token);
  if (!token) {
    return res
      .status(403)
      .json({ msg: "No token provided, authorization denied" });
  }

  try {
    const jwtToken = token.split(" ")[1]; // Assuming the format is "Bearer <token>"
    const decodedValue = jwt.verify(jwtToken, JWT_SECRET);

    if (decodedValue && decodedValue.username) {
      req.user = decodedValue;
      next();
    } else {
      res.status(403).json({ msg: "You are not authenticated" });
    }
  } catch (err) {
    res.status(403).json({ msg: "Token is not valid" });
  }
}

module.exports = authMiddleware;
