import express from "express";
import userControllers from "../controllers/userControllers.js";
import verifyJWT from "../../middleware/verifyJWT.js";
import { verifyRoles } from "../../middleware/verifyRoles.js";

const router = express.Router();

router.use(verifyJWT);
router.use(verifyRoles("Admin", "Manager"));

router.get("/", userControllers.getAllUsers);

router.get("/:id", userControllers.getUserById);

router.post("/", userControllers.createUser);

router.patch("/:id", userControllers.updateUser);

router.delete("/:id", userControllers.deleteUser);

export default router;
