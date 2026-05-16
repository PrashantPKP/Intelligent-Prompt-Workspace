import Groq from "groq-sdk";

// Load all available API keys (up to 12)
const apiKeys = [];
for (let i = 1; i <= 12; i++) {
  const key = process.env[`GROQ_API_KEY_${i}`];
  if (key) apiKeys.push(key);
}

let currentKeyIndex = 0;

export function getGroqClient() {
  const key = apiKeys[currentKeyIndex];
  if (!key) {
    throw new Error("No Groq API keys configured");
  }
  return new Groq({ apiKey: key });
}

export function rotateKey() {
  currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
}

export function getCurrentKeyIndex() {
  return currentKeyIndex;
}

export function getTotalKeys() {
  return apiKeys.length;
}
