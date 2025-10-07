import Note from "../models/Note.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// @route GET /notes
// @access Private
const getAllNotes = async (req, res) => {
  try {
    const roles = req.roles;
    const username = req.user;

    let notes;

    if (roles.includes("Manager") || roles.includes("Admin")) {
      notes = await Note.find().lean();
    } else {
      const user = await User.findOne({ username }).lean();
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      notes = await Note.find({ user: user._id }).lean();
    }

    if (!notes || notes.length === 0) {
      return res.status(404).json({ message: "No notes found" });
    }

    const notesWithUser = await Promise.all(
      notes.map(async (note) => {
        const user = await User.findById(note.user).lean();
        return { ...note, username: user?.username || "Unknown User" };
      })
    );

    return res.status(200).json({ notes: notesWithUser });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// @route GET /notes/:id
// @access Private
const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const note = await Note.findById(id).lean();

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.status(200).json({ note });
  } catch (error) {
    console.error("Error fetching note by ID:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// @route POST /notes
// @access Private
const createNewNote = async (req, res) => {
  try {
    const { title, text, completed } = req.body;
    const username = req.user;

    if (!title || !text) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ username }).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const duplicate = await Note.findOne({ user: user._id, title }).lean();
    if (duplicate) {
      return res.status(409).json({ message: "Note title is already in use" });
    }

    const note = await Note.create({
      user: user._id,
      title,
      text,
      completed,
    });

    return res.status(201).json({ note });
  } catch (error) {
    console.error("Error creating note:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// @route PATCH /notes/:id
// @access Private
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, text, completed } = req.body;
    const username = req.user;

    if (!title || !text || typeof completed !== "boolean") {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const user = await User.findOne({ username }).lean();
    if (!user || !user.active) {
      return res.status(404).json({ message: "User not found or inactive" });
    }

    const duplicate = await Note.findOne({ user: user._id, title }).lean();
    if (duplicate && duplicate._id.toString() !== id) {
      return res.status(409).json({ message: "Note title is already in use" });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, text, completed },
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.status(200).json({ note: updatedNote });
  } catch (error) {
    console.error("Error updating note:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// @route DELETE /notes/:id
// @access Private
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const deletedNote = await Note.findByIdAndDelete(id);
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.status(200).json({ note: deletedNote });
  } catch (error) {
    console.error("Error deleting note:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const noteControllers = {
  getAllNotes,
  getNoteById,
  createNewNote,
  updateNote,
  deleteNote,
};

export default noteControllers;
