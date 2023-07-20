const asyncWrapper = require("@middleware/asyncWrapper");
const getUuid = require("../../database/getUuid");
const fs = require("fs").promises;
const { UnauthenticatedError } = require("@errors");

const getSpecificGroups = asyncWrapper(async (req, res) => {
  const { username, routeuuid } = req.params;
  const uuid = await getUuid(username);

  try {
    const filePath = `userdata/${uuid}/groups-${routeuuid}.json`;
    await fs.access(filePath);

    const data = await fs.readFile(filePath, { encoding: "utf-8" });
    const groupsParsed = JSON.parse(data);

    res.status(200).send(groupsParsed);
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
  getSpecificGroups,
};
