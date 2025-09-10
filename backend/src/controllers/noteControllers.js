import Note from "../models/Note.js";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
// @route get /notes
// @access private
const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find().lean();
  if (!notes || !notes.length) {
    return res.status(400).json(notes);
  }
  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean();
      return { ...note, username: user.username };
    })
  );

  return res.json(notesWithUser);
});

// @route post /notes
// @access private
const createNewNote = asyncHandler(async (req, res) => {
  const { user, title, text } = req.body;
  if (!user || !title || !text) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await Note.findOne({ title }).lean();

  if (duplicate) {
    return res.status(400).json({ message: "Note title is already used" });
  }

  const note = await Note.create({
    user,
    title,
    text,
  });

  if (!note) {
    return res.status(400).json({ message: "Invalid Note Data recieved" });
  }

  return res.json({ message: "New Note has been created", note });
});

// @route patch /notes
// @access private
const updateNote = asyncHandler(async (req, res) => {
  const { id, title, text, completed } = req.body;

  if (!id || !title || !text || typeof completed !== "boolean") {
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

// @route delete /notes
// @access private
const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Note id is required" });
  }

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
  createNewNote,
  updateNote,
  deleteNote,
};

export default noteControllers;
