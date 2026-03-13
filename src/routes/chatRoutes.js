const express = require("express");
const router = express.Router();

const { getMessages } = require("../controllers/chatController");

router.get("/:user1/:user2", getMessages);

module.exports = router;