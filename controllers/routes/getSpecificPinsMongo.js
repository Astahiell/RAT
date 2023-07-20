const asyncWrapper = require("@middleware/asyncWrapper");
const getUuid = require("../../database/getUuid");
const fs = require("fs").promises;
const logger = require("@middleware/logger");
const { PrismaClient: PrismaClientNoSQL } = require("@generated/client-nosql");
const prismaNoSQL = new PrismaClientNoSQL();
const { UnauthenticatedError } = require("@errors");

const getSpecificRoute = asyncWrapper(async (req, res) => {
  const { username, routeuuid } = req.params;
  const uuid = await getUuid(username);

  const route = prismaNoSQL.route.findUnique({
    where: {
      owner: uuid,
      uuid: routeuuid,
    },
  });
  console.log(route)

    logger.log({
      level: "info",
      message: `Route ${routeuuid} was accessed by user ${username}`,
    });

    res.status(200).send(routeParsed);
   
});

module.exports = {
  getSpecificRoute,
};
