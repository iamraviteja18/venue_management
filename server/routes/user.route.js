const express = require("express");
const router = express.Router();

const { auth, hasPermission } = require("../middlewares/auth.middleware");
const UserController = require("../controllers/user.controller");

// router.get("/", (req, res) => {
//   res.send("User Route");
// });

router.get("/:id", auth, UserController.GetUserById);

module.exports = router;
