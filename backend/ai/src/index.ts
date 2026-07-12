import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRoutes from "./routes/ai.js";
import { connectRedis } from "./config/redis.js";

dotenv.config();

connectRedis();


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/ai", aiRoutes);

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "AI Service Running 🚀",
  });
});

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
  console.log(`AI Service running on ${PORT}`);
});