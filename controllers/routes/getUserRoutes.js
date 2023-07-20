const logger = require("@middleware/logger");
const fs = require("fs").promises;
const asyncWrapper = require("@middleware/asyncWrapper");
const getUuid = require("../../database/getUuid");

const getUserRoutes = asyncWrapper(async (req, res) => {
  const { username } = req.params;
  let routes = [];
  const uuid = await getUuid(username);

  try {
    const folder = await fs.readdir(`userdata/${uuid}`);
    const routeFiles = folder.filter(
      (file) => !file.startsWith("pins-") && !file.startsWith("groups-")
    );

    const routePromises = routeFiles.map(async (file) => {
      const data = await fs.readFile(`userdata/${uuid}/${file}`, {
        encoding: "utf-8",
      });
      const statsMain = await fs.stat(`userdata/${uuid}/${file}`);
      const statsGroups = await fs.stat(`userdata/${uuid}/groups-${file}`);
      const statsPins = await fs.stat(`userdata/${uuid}/pins-${file}`);
      const parsed = JSON.parse(data);
      const time = Math.max(
        statsMain.mtime,
        statsGroups.mtime,
        statsPins.mtime
      );
      parsed.time = new Date(time).toLocaleString();
      return parsed;
    });

    routes = await Promise.all(routePromises);

    logger.log({
      level: "info",
      message: `User ${username} accessed his routes`,
    });

    routes.sort((a, b) => a.name.localeCompare(b.name));
    res.status(200).json(routes);
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error accessing routes for user ${username}: ${error.message}`,
    });
    res.status(500).json({ message: "Error accessing routes" });
  }
});

module.exports = {
  getUserRoutes,
};
