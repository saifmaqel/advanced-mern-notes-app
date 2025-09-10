import express from "express";
import userControllers from "../controllers/userControllers.js";

const router = express.Router();

router
  .route("/")
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

export default router;
