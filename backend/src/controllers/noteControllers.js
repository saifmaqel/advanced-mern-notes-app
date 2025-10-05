import Note from "../models/Note.js";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

// @route GET /notes
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find().lean();
  if (!notes || !notes.length) {
    return res.status(400).json({ message: "No notes found" });
  }

  // Attach usernames to notes
  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean();
      return { ...note, username: user?.username || "Unknown User" };
    })
  );

  return res.json({ notes: notesWithUser });
});

// @route   GET /notes/:id
// @access  Private
const getNoteById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid note ID" });
  }

  const note = await Note.findById(id).lean();

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  return res.status(200).json({ note });
});

// @route POST /notes
// @access Private
const createNewNote = asyncHandler(async (req, res) => {
  // const user_id = req.user._id;
  const { user, title, text, completed } = req.body;
  if (!user || !title || !text) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await Note.findOne({ title }).lean();
  if (duplicate) {
    return res.status(400).json({ message: "Note title is already used" });
  }

  const note = await Note.create({ user, title, text, completed });

  if (!note) {
    return res.status(400).json({ message: "Invalid Note Data received" });
  }

  return res.json({ note });
});

// @route PATCH /notes/:id
// @access Private
const updateNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, text, completed } = req.body;

  if (!title || !text || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid note ID" });
  }

  const duplicate = await Note.findOne({ title }).lean();
  if (duplicate && !duplicate._id.equals(id)) {
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
});

// @route DELETE /notes/:id
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid note ID" });
  }

  const deletedNote = await Note.findByIdAndDelete(id);
  if (!deletedNote) {
    return res.status(404).json({ message: "Note not found" });
  }

  return res.json({ note: deletedNote });
});

const noteControllers = {
  getAllNotes,
  getNoteById,
  createNewNote,
  updateNote,
  deleteNote,
};

export default noteControllers;
