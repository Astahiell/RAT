const asyncWrapper = require("@middleware/asyncWrapper");
const { PrismaClient } = require("@prisma/client");
const logger = require("@middleware/logger");
const prisma = new PrismaClient();

const getAllUsers = asyncWrapper(async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    logger.log({
      level: "info",
      message: "List of all users accessed",
    });
    res.status(200).json({ users });
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error accessing list of users: ${error.message}`,
    });
    res.status(500).json({ message: "Error accessing list of users" });
  }
});

module.exports = {
  getAllUsers,
};
