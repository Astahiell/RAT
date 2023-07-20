const fs = require("fs").promises;
const asyncWrapper = require("@middleware/asyncWrapper");

const getGames = asyncWrapper(async (req, res) => {
  try {
    const data = await fs.readFile(`data/games.txt`, { encoding: "utf-8" });
    const games = data.split("\n");
    const gamesMatched = games.filter((game) =>
      game.toLowerCase().includes(req.params.letters.toLowerCase())
    );
    res.status(200).json(gamesMatched);
  } catch (error) {
    res.status(500).json({ message: "Error reading games data" });
  }
});

module.exports = {
  getGames,
};
