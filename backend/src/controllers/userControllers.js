import User from "../models/User.js";
import Note from "../models/Note.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users || !users.length) {
    return res.status(400).json({ message: "No users found" });
  }
  return res.json({ users });
});

// @route POST /users
// @access Private
const createUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await User.findOne({ username }).lean();
  if (duplicate) {
    return res.status(409).json({ message: "Username is already used" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userObj = { username, password: hashedPassword, roles };

  const user = await User.create(userObj);

  if (user) {
    return res.json(user);
  } else {
    return res.status(400).json({ message: "Invalid user data received" });
  }
});

// @route PATCH /users/:id
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, password, roles, active } = req.body;

  if (
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const duplicate = await User.findOne({ username }).lean();
  if (duplicate && !duplicate._id.equals(id)) {
    return res.status(409).json({ message: "Username is already used" });
  }

  const updateFields = {
    username,
    roles,
    active,
  };

  if (password) {
    updateFields.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return res.status(400).json({ message: "User not found" });
  }

  return res.json(updatedUser);
});

// @route DELETE /users/:id
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const note = await Note.findOne({ user: id }).lean();
  if (note) {
    return res.status(400).json({ message: "User has assigned notes" });
  }

  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) {
    return res.status(400).json({ message: "User not found" });
  }

  return res.json(deletedUser);
});

const userControllers = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};

export default userControllers;
