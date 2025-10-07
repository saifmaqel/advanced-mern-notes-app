import express from "express";
import authController from "../controllers/authController.js";
import loginLimiter from "../../middleware/loginLimiter.js";

const router = express.Router();

router.post("/", loginLimiter, authController.login);

router.post("/signup", authController.signup);

router.get("/refresh", authController.refresh);

router.post("/logout", authController.logout);

export default router;
