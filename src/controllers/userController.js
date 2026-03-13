const User = require("../models/User");

exports.findUser = async (req, res) => {

  const { chatId } = req.params;

  const user = await User.findOne({ chatId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);

};