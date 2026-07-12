import { Request, Response } from "express";
import client from "../services/mistral.js";
import redis from "../config/redis.js";
export const getSuggestions = async (
  req: Request,
  res: Response
) => {
  try {
    const { conversation } = req.body;
    const cacheKey = `smart_reply:${conversation}`;

    if (!conversation || typeof conversation !== "string") {
      return res.status(400).json({
        message: "Conversation required",
      });
    }

    const cached = await redis.get(cacheKey);

if (cached) {
  console.log("✅ Redis Cache Hit");

  return res.json(JSON.parse(cached));
}

console.log("❌ Redis Cache Miss");

    const response = await client.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "system",
         content: `
You are an AI Smart Reply assistant for a real-time chat application.

You will receive the recent conversation between two users.

Your job is to generate EXACTLY 3 smart reply suggestions for the LAST message in the conversation.

Rules:

- Understand the full conversation before replying.
- Reply as the receiver of the last message.
- Replies should be short (maximum 8 words).
- Replies should feel natural and human.
- Do not repeat the last message.
- Do not explain anything.
- Do not use markdown.
- Return ONLY valid JSON.

Return format:

{
  "suggestions": [
    "Reply 1",
    "Reply 2",
    "Reply 3"
  ]
}
`,
        },
        {
          role: "user",
          content: conversation,
        },
      ],
    });

    let content = response.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(500).json({
        message: "Empty AI response",
      });
    }

    // Agar SDK array return kare
    if (Array.isArray(content)) {
      content = content
        .map((item: any) => item.text || "")
        .join("");
    }

    // Markdown remove karo
    content = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("AI Raw Response:");
    console.log(content);

    const parsed = JSON.parse(content);

    console.log("Parsed Response:", parsed);

    await redis.setEx(
  cacheKey,
  60 * 60,
  JSON.stringify(parsed)
);

   await redis.setEx(
  cacheKey,
  60 * 60,
  JSON.stringify(parsed)
);

await redis.setEx(
  cacheKey,
  60 * 60,
  JSON.stringify(parsed)
);

   await redis.setEx(
    cacheKey,
    60*60,
    JSON.stringify(parsed)
   );
    console.log("💾 Saved to Redis");
   return res.status(200).json(parsed);

  } catch (error) {
    console.error("AI Error:", error);

    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Unknown Error",
    });
  }
};