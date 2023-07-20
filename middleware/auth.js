const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { login } = decoded;
    req.user = { login };
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(401).json({ message: "Not authorized to access this route" });
  }
};

module.exports = { authenticationMiddleware };
