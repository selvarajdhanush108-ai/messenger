const express = require("express");
const router = express.Router();

const { findUser } = require("../controllers/userController");

router.get("/:chatId", findUser);

module.exports = router;