import express from "express";
import userControllers from "../controllers/userControllers.js";

const router = express.Router();

router.get("/", userControllers.getAllUsers);

router.post("/", userControllers.createUser);

router.patch("/:id", userControllers.updateUser);

router.delete("/:id", userControllers.deleteUser);

export default router;
