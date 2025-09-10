import express from "express";
import noteControllers from "../controllers/noteControllers.js";

const router = express.Router();

router
  .route("/")
  .get(noteControllers.getAllNotes)
  .post(noteControllers.createNewNote)
  .patch(noteControllers.updateNote)
  .delete(noteControllers.deleteNote);

export default router;
