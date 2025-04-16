const jwt = require("jsonwebtoken");
const JWT_SECRET = "db53923ddce989dd5308ebf237810860d93fca48cc3f67a2a4dca553de193ac1"; // Use environment variables for security in production

const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  // Check if Authorization header is provided
  if (!authHeader) {
    return res.status(401).json({ message: "Access denied, no token provided" });
  }

  // Token is expected to be in the format "Bearer <token>"
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied, invalid token format" });
  }

  try {
    // Verify token and extract payload
    const verified = jwt.verify(token, JWT_SECRET);

    // Attach the user ID to the request (assuming the token contains the userId)
    req.userId = verified.userId;  // This will depend on how you encoded the token, make sure it's the correct field
    
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateToken;
