const express = require("express");
const router = express.Router();

const { loginUser } = require("@controllers/user/loginUser");
const { createUser } = require("@controllers/user/createUser");
const { getOneUser } = require("@controllers/user/getOneUser");
const { createRoute } = require("@controllers/routes/createRoute");
const { deleteRoute } = require("@controllers/routes/deleteRoute");
const { getUserRoutes } = require("@controllers/routes/getUserRoutes");
const { getSpecificRoute } = require("@controllers/routes/getSpecificRoute");
const { getSpecificPins } = require("@controllers/routes/getSpecificPins");
const { getSpecificGroups } = require("@controllers/routes/getSpecificGroups");
const { saveRoute } = require("@controllers/routes/saveRoute");
const { editRoute } = require("@controllers/routes/editRoute");
const { editGroups } = require("@controllers/routes/editGroups");
const { authenticationMiddleware } = require("@middleware/auth");
const { getAllUsers } = require("@controllers/user/getAllUsers");
const { getUserProfile } = require("@controllers/user/getUserProfile");
const { getGames } = require("@controllers/games/getGames");

router.route("/routes/:username").get(getUserRoutes);
router.route("/routes/edit").put(editRoute);
router.route("/routes/groups/edit").put(editGroups);
router.route("/routes/create").post(createRoute);
router.route("/routes/delete").delete(deleteRoute);
router.route("/routes/save").post(saveRoute);
router.route("/routes/:username/:routeuuid").get(getSpecificRoute);
router.route("/routes/:username/:routeuuid/pins").get(getSpecificPins);
router.route("/routes/:username/:routeuuid/groups").get(getSpecificGroups);

router.route("/users/authenticate").post(loginUser);
router.route("/users/register").post(createUser);
router.route("/users/:username").get(getOneUser);
router.route("/users/:username/profile").get(getUserProfile);
router.route("/users").get(getAllUsers);

router.route("/games/:letters").get(getGames);

router.route("/verify").get(authenticationMiddleware);

module.exports = router;
