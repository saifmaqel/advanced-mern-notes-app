import express from "express";
import noteControllers from "../controllers/noteControllers.js";
import verifyJWT from "../../middleware/verifyJWT.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/", noteControllers.getAllNotes);

router.get("/:id", noteControllers.getNoteById);

router.post("/", noteControllers.createNewNote);

router.patch("/:id", noteControllers.updateNote);

router.delete("/:id", noteControllers.deleteNote);

export default router;
