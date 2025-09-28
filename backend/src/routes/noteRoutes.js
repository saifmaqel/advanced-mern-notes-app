import express from "express";
import noteControllers from "../controllers/noteControllers.js";

const router = express.Router();

router.get("/", noteControllers.getAllNotes);

router.post("/", noteControllers.createNewNote);

router.patch("/:id", noteControllers.updateNote);

router.delete("/:id", noteControllers.deleteNote);

export default router;
