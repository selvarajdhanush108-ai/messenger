const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {

  const { username, chatId, email, password } = req.body;

  const chatExists = await User.findOne({ chatId });

  if (chatExists) {
    return res.status(400).json({ message: "Chat ID already taken" });
  }

  const emailExists = await User.findOne({ email });

  if (emailExists) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    chatId,
    email,
    password: hashed
  });

  res.json({
    id: user._id,
    chatId: user.chatId,
    token: generateToken(user._id)
  });

};

exports.login = async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.json({
    id: user._id,
    token: generateToken(user._id)
  });

};