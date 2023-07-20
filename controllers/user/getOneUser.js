const asyncWrapper = require("@middleware/asyncWrapper");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { BadRequestError } = require("@errors");
const logger = require("@middleware/logger");

const getOneUser = asyncWrapper(async (req, res) => {
  const { username } = req.params;
  try {
    const findLogin = await prisma.user.findFirst({
      where: {
        login: username,
      },
    });

    if (!findLogin) {
      throw new BadRequestError("User doesn't exist");
    }

    logger.log({
      level: "info",
      message: `User ${username} details accessed`,
    });

    res.status(200).json(findLogin);
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error accessing user ${username}: ${error.message}`,
    });
    res.status(500).json({ message: "Error accessing user" });
  }
});

module.exports = {
  getOneUser,
};
