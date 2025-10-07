import User from "../models/User.js";
import Note from "../models/Note.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// @route GET /users/:id
// @access Private/Admin
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// @route POST /users
// @access Private
const createUser = async (req, res) => {
  try {
    const { username, password, roles, active } = req.body;

    if (
      !username ||
      !password ||
      !Array.isArray(roles) ||
      roles.length === 0 ||
      active === undefined
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const duplicate = await User.findOne({ username }).lean();
    if (duplicate) {
      return res.status(409).json({ message: "Username is already used" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userObj = { username, password: hashedPassword, roles, active };

    const user = await User.create(userObj);

    return res.status(201).json({ user });
  } catch (error) {
    console.error("Error creating user:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// @route PATCH /users/:id
// @access Private
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, roles, active } = req.body;

    if (
      !username ||
      !Array.isArray(roles) ||
      roles.length === 0 ||
      typeof active !== "boolean"
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const duplicate = await User.findOne({ username }).lean();
    if (duplicate && duplicate._id.toString() !== id) {
      return res.status(409).json({ message: "Username is already used" });
    }

    const updateFields = { username, roles, active };

    if (password) {
      updateFields.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// @route DELETE /users/:id
// @access Private
const deleteUser = async (req, res) => {
  try {
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
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user: deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const userControllers = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

export default userControllers;
