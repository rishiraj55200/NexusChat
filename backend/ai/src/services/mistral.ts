import "dotenv/config";
import { Mistral } from "@mistralai/mistralai";

const apiKey = process.env.MISTRAL_API_KEY;

if (!apiKey) {
  throw new Error("MISTRAL_API_KEY missing");
}

const client = new Mistral({
  apiKey,
});

export default client;