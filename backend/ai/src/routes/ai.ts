import express from "express";
import { getSuggestions } from "../controllers/ai.js";

const router = express.Router();

router.post("/suggestions", getSuggestions);

export default router;