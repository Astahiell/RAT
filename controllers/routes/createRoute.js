const asyncWrapper = require("@middleware/asyncWrapper");
const createExampleRoute = require("@middleware/createExampleRoute");
const createExamplePin = require("@middleware/createExamplePin");
const createExampleGroup = require("@middleware/createExampleGroup");
const fs = require("fs").promises;
const { PrismaClient: PrismaClientSQL } = require("@prisma/client");
// const { PrismaClient: PrismaClientNoSQL } = require("@generated/client-nosql");
const prismaSQL = new PrismaClientSQL();
// const prismaNoSQL = new PrismaClientNoSQL();
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
  const userDir = `userdata/${user.uuid}`;

  // const newRoute = await prismaNoSQL.route.create({
  //   data: {
  //     uuid: routeuuid,
  //     name: routeName,
  //     description: "Your Amazing Description",
  //     category: null,
  //     condition: "Private",
  //     map: imageLink,
  //     startingPin: "AA1111",
  //     owner: user.uuid,
  //     sharedWith: null,
  //     pins: {
  //       create: [
  //         {
  //           pinId: "AA1111",
  //           name: "Your Pin",
  //           groups: "Your First Group",
  //           description: "Your Amazing Pin",
  //           image: "https://imgur.com/testowy",
  //           lat: 0,
  //           lng: 0,
  //           icon: null,
  //         },
  //       ],
  //     },
  //     groups: {
  //       create: [
  //         {
  //           name: "Your First Group",
  //           color: "red",
  //         },
  //       ],
  //     },
  //   },
  // });
  try {
    await Promise.all([
      fs.writeFile(
        `${userDir}/${routeuuid}.json`,
        createExampleRoute(routeName, imageLink, routeuuid)
      ),
      fs.writeFile(`${userDir}/pins-${routeuuid}.json`, createExamplePin()),
      fs.writeFile(`${userDir}/groups-${routeuuid}.json`, createExampleGroup()),
    ]);

    logger.log({
      level: "info",
      message: `Route ${routeName} created by user ${username}`,
    });

    res.status(200).json({ message: "Successfully added route" });
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error creating route for user ${username}: ${error.message}`,
    });
    res.status(500).json({ message: "Error creating route" });
  }
});

module.exports = {
  createRoute,
};
