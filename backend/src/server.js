import express from "express";
import dotenv from "dotenv";
import path from "path";
import root from "./routes/root.js";
import { logger, logEvents } from "../middleware/logger.js";
import errorHandler from "../middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { corsOptions } from "../config/corsOptions.js";
import connectDB from "../config/dbConn.js";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";

dotenv.config();
const PORT = process.env.PORT || 3500;

connectDB();

const app = express();

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/", express.static(path.join(process.cwd(), "public")));
app.use("/", root);
app.use("/users", userRoutes);
app.use("/notes", noteRoutes);

app.use((req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(process.cwd(), "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});
app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("CONNECTED TO MONGODB");
  app.listen(PORT, () => {
    console.log("server running on port ", PORT);
  });
});

mongoose.connection.on("error", (error) => {
  console.log(error);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
