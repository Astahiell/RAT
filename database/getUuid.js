const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getUuid = async (login) => {
  try {
    const user = await prisma.user.findFirst({
      where: { login },
    });
    return user ? user.uuid : null;
  } catch (error) {
    console.error(`Error fetching UUID for login ${login}:`, error);
    return null;
  }
};

module.exports = getUuid;
