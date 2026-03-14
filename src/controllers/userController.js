const User = require("../models/User");

exports.findUser = async (req, res) => {
  const { chatId } = req.params;

  const user = await User.findOne({ chatId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

// NEW: Update user profile
exports.updateUser = async (req, res) => {
  try {
    // req.user comes from our authMiddleware
    const userId = req.user; 
    const { username, email } = req.body;

    // Check if the new email is already taken by someone else
    if (email) {
      const emailExists = await User.findOne({ email, _id: { $ne: userId } });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use by another account" });
      }
    }

    // Update and return the new document
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        ...(username && { username }),
        ...(email && { email }) 
      },
      { new: true, runValidators: true }
    ).select("-password"); // Don't send the password back!

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error updating profile" });
  }
};
