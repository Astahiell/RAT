const asyncWrapper = require("@middleware/asyncWrapper");
const getUuid = require("../../database/getUuid");
const fs = require("fs").promises;
const logger = require("@middleware/logger");

const deleteRoute = asyncWrapper(async (req, res) => {
  const { username, routeuuid } = req.body;
  const uuid = await getUuid(username);

  

  try {
    await Promise.all([
      fs.rm(`userdata/${uuid}/${routeuuid}.json`, {
        recursive: true,
        force: true,
      }),
      fs.rm(`userdata/${uuid}/pins-${routeuuid}.json`, {
        recursive: true,
        force: true,
      }),
      fs.rm(`userdata/${uuid}/groups-${routeuuid}.json`, {
        recursive: true,
        force: true,
      }),
    ]);

    logger.log({
      level: "info",
      message: `Route ${routeuuid} was deleted by user ${username}`,
    });

    res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error deleting route for user ${username}: ${error.message}`,
    });
    res.status(500).json({ message: "Error deleting route" });
  }
});

module.exports = {
  deleteRoute,
};
