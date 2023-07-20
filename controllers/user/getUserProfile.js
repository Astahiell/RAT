const asyncWrapper = require("@middleware/asyncWrapper");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { BadRequestError } = require("@errors");
const logger = require("@middleware/logger");

const getUserProfile = asyncWrapper(async (req, res) => {
  const { username } = req.params;

  try {
    const findLogin = await prisma.profile.findFirst({
      where: {
        userLogin: username,
      },
      select: {
        userLogin: true,
        bio: true,
        image: true,
      },
    });
    if (!findLogin) {
      throw new BadRequestError("User doesn't exist");
    }

    logger.log({
      level: "info",
      message: `${username} was searched`,
    });

    res.status(200).json(findLogin);
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error accessing profile for user ${username}: ${error.message}`,
    });
    res.status(500).json({ message: "Error accessing profile" });
  }
});

module.exports = {
  getUserProfile,
};
