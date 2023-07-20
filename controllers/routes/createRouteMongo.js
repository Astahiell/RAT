const asyncWrapper = require("@middleware/asyncWrapper");
const { PrismaClient: PrismaClientSQL } = require("@prisma/client");
const { PrismaClient: PrismaClientNoSQL } = require("@generated/client-nosql");
const prismaSQL = new PrismaClientSQL();
const prismaNoSQL = new PrismaClientNoSQL();
const logger = require("@middleware/logger");
const { v4: uuidv4 } = require("uuid");

const createRoute = asyncWrapper(async (req, res) => {
  const { username, routeName, imageLink } = req.body;
  const user = await prismaSQL.user.findFirst({
    where: {
      login: username,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const routeuuid = uuidv4();
  const newRoute = await prismaNoSQL.route.create({
    data: {
      uuid: routeuuid,
      name: routeName,
      description: "Your Amazing Description",
      category: null,
      condition: "Private",
      map: imageLink,
      startingPin: "AA1111",
      owner: user.uuid,
      sharedWith: null,
      pins: {
        create: [
          {
            pinId: "AA1111",
            name: "Your Pin",
            groups: "Your First Group",
            description: "Your Amazing Pin",
            image: "https://imgur.com/testowy",
            lat: 0,
            lng: 0,
            icon: null,
          },
        ],
      },
      groups: {
        create: [
          {
            name: "Your First Group",
            color: "red",
          },
        ],
      },
    },
  });
});

module.exports = {
  createRoute,
};
