const asyncWrapper = require("@middleware/asyncWrapper");
const getUuid = require("../../database/getUuid");
const fs = require("fs").promises;
const logger = require("@middleware/logger");
const { UnauthenticatedError } = require("@errors");

const getSpecificRoute = asyncWrapper(async (req, res) => {
  const { username, routeuuid } = req.params;
  const uuid = await getUuid(username);

  try {
    const filePath = `userdata/${uuid}/${routeuuid}.json`;
    await fs.access(filePath);

    const data = await fs.readFile(filePath, { encoding: "utf-8" });
    const routeParsed = JSON.parse(data);

    logger.log({
      level: "info",
      message: `Route ${routeuuid} was accessed by user ${username}`,
    });

    res.status(200).send(routeParsed);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new UnauthenticatedError(
        `You don't have permission for this route`
      );
    } else {
      throw error;
    }
  }
});

module.exports = {
  getSpecificRoute,
};
