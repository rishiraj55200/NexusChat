import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("error", (err) => {
  console.error("Redis Error:", err);
});

export async function connectRedis() {
  try {
    await redis.connect();
    console.log("✅ Redis Connected");
  } catch (error) {
    console.error("Failed to connect Redis", error);
  }
}

export default redis;