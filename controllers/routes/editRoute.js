const asyncWrapper = require("@middleware/asyncWrapper");
const getUuid = require("../../database/getUuid");
const fs = require("fs").promises;
const logger = require("@middleware/logger");

const editRoute = asyncWrapper(async (req, res) => {
  const {
    username,
    routeuuid,
    routeName,
    routeDescription,
    routeCategory,
    routeCondition,
    routeMap,
    startingPin,
  } = req.body;

  const uuid = await getUuid(username);

  try {
    let data = await fs.readFile(`userdata/${uuid}/${routeuuid}.json`, {
      encoding: "utf-8",
    });
    let parsed = JSON.parse(data);
    parsed.name = routeName;
    parsed.description = routeDescription;
    parsed.category = routeCategory;
    parsed.map = routeMap;
    parsed.condition = routeCondition;
    parsed.starting_pin = startingPin;

    await fs.writeFile(
      `userdata/${uuid}/${routeuuid}.json`,
      JSON.stringify(parsed, null, 2)
    );

    logger.log({
      level: "info",
      message: `Route ${routeName} ${routeuuid} was edited by user ${username}`,
    });

    res.status(200).json({ message: "Successfully edited route" });
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error editing route for user ${username}: ${error.message}`,
    });
    res.status(500).json({ message: "Error editing route" });
  }
});

module.exports = {
  editRoute,
};
