const jwt = require("jsonwebtoken");
 // Replace with env variable in production

const authenticateToken = (req, res, next) => {
  const token = req.cookies.userToken; // Get the token from cookies

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Store the verified token payload
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = authenticateToken;
