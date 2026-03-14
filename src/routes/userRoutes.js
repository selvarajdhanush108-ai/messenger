const express = require("express");
const router = express.Router();

const { findUser, updateUser } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

// IMPORTANT: Put /update BEFORE /:chatId so it doesn't get confused
router.put("/update", protect, updateUser);

router.get("/:chatId", findUser);

module.exports = router;
