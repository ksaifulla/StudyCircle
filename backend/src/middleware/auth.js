const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");

// Middleware for handling auth
async function authMiddleware(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ msg: "Authorization token missing" });
  }

  try {
    const jwtToken = token.split(" ")[1]; // Extract token after "Bearer "
    const decodedValue = jwt.verify(jwtToken, JWT_SECRET);

    if (!decodedValue || !decodedValue.username) {
      return res.status(403).json({ msg: "Invalid token" });
    }

    // Fetch user from the database
    const user = await User.findOne({ username: decodedValue.username });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    req.user = { id: user._id, username: user.username }; // Attach user ID to req.user
    next();
  } catch (error) {
    res
      .status(403)
      .json({ msg: "You are not authenticated", error: error.message });
  }
}
module.exports = authMiddleware;
