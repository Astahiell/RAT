const asyncWrapper = require("@middleware/asyncWrapper");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { BadRequestError } = require("@errors");
const logger = require("@middleware/logger");

const loginUser = asyncWrapper(async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) {
    throw new BadRequestError("Login and password must be provided");
  }
  const user = await prisma.user.findFirst({
    where: {
      login: login,
    },
  });
  if (user == null) {
    throw new BadRequestError("User doesn't exist");
  }
  const matched = await bcrypt.compare(password, user.password);
  const token = jwt.sign({ login }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  if (matched) {
    logger.log({
      level: "info",
      message: `${login} logged in.`,
    });
    return res.status(200).json({ login: user.login, token: token, level:user.userLevel });
  }
});

module.exports = {
  loginUser,
};
