const asyncWrapper = require("@middleware/asyncWrapper");
const getUuid = require("../../database/getUuid");
const fs = require("fs").promises;
const logger = require("@middleware/logger");

const editGroups = asyncWrapper(async (req, res) => {
  const { groups, username, routeuuid } = req.body;
  const uuid = await getUuid(username);

  try {
    await fs.writeFile(
      `userdata/${uuid}/groups-${routeuuid}.json`,
      JSON.stringify(groups, null, 2)
    );

    logger.log({
      level: "info",
      message: `Groups in ${routeuuid} were edited by user ${username}`,
    });

    res.status(200).json({ msg: "Successfully edited group" });
  } catch (err) {
    logger.log({
      level: "error",
      message: `Error editing groups for user ${username}: ${err.message}`,
    });
    res.status(500).json({ message: "Error editing groups" });
  }
});

module.exports = {
  editGroups,
};
