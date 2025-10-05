import express from "express";
import userControllers from "../controllers/userControllers.js";
import verifyJWT from "../../middleware/verifyJWT.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/", userControllers.getAllUsers);

router.get("/:id", userControllers.getUserById);

router.post("/", userControllers.createUser);

router.patch("/:id", userControllers.updateUser);

router.delete("/:id", userControllers.deleteUser);

export default router;
