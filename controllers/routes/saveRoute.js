const asyncWrapper = require("@middleware/asyncWrapper");
const getUuid = require("../../database/getUuid");
const fs = require("fs").promises;
const logger = require("@middleware/logger");

const saveRoute = asyncWrapper(async (req, res) => {
  const { pins, username, uuid } = req.body;
  const useruuid = await getUuid(username);

  try {
    await fs.writeFile(
      `userdata/${useruuid}/pins-${uuid}.json`,
      JSON.stringify(pins, null, 2)
    );

    logger.log({
      level: "info",
      message: `Route ${uuid} saved by user ${username}`,
    });

    res.status(200).json({ msg: "Successfully saved pins" });
  } catch (err) {
    logger.log({
      level: "error",
      message: `Error saving route for user ${username}: ${err.message}`,
    });
    res.status(500).json({ message: "Error saving route" });
  }
});

module.exports = {
  saveRoute,
};
