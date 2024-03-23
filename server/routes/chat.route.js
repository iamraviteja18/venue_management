const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth.middleware");
const ChatController = require("../controllers/chat.controller");

router.post("/send", auth, ChatController.SendMessage);
router.get("/messages", auth, ChatController.GetMessages);

module.exports = router;