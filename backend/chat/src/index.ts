import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import chatRoutes from "./routes/chat.js";
import cors from "cors";
import { app, server } from "./config/socket.js";
import multer from "multer";
import { getErrorMessage } from "./config/TryCatch.js";

dotenv.config();

connectDb();

app.use(express.json());

app.use(cors());

app.use("/api/v1", chatRoutes);

app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (res.headersSent) return next(error);

    console.error("Request failed:", error);

    const status =
      error instanceof multer.MulterError
        ? 400
        : typeof error === "object" && error !== null && "http_code" in error
          ? 502
          : 500;

    res.status(status).json({ message: getErrorMessage(error) });
  }
);

const port = Number(process.env.PORT) || 5002;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


