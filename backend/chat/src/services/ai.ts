import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function generateSmartReplies(conversation: string) {
  const AI_SERVICE = process.env.AI_SERVICE;

  if (!AI_SERVICE) {
    throw new Error("AI_SERVICE not found in .env");
  }

  try {
    const { data } = await axios.post(
      `${AI_SERVICE}/api/v1/ai/suggestions`,
      {
        conversation,
      }
    );

    console.log("AI Response:", data);

    return data.suggestions ?? [];
  } catch (error) {
    console.error("AI Service Error:", error);
    return [];
  }
}