// server/index.js - API proxy for AI Tutor
import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.API_PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ─── /api/chat ───────────────────────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  const { provider = "groq", messages, model } = req.body;

  if (provider === "groq") {
    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GROK_API_KEY is not set." });
    }

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model || "llama-3.3-70b-versatile",
            messages,
            temperature: 0.7,
          }),
        }
      );

      if (!response.ok) {
        const err = await response.text();
        return res.status(502).json({ error: `Groq API error: ${response.status} – ${err}` });
      }

      const data = await response.json();
      return res.json({ content: data.choices[0].message.content });
    } catch (err) {
      return res.status(502).json({ error: "Failed to reach Groq API." });
    }
  }

  // Ollama fallback
  try {
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model || "llama3.1:8b",
        messages,
        stream: false,
      }),
    });

    if (!response.ok) {
      return res.status(502).json({ error: `Ollama error: ${response.status}` });
    }

    const data = await response.json();
    return res.json({ content: data.message.content });
  } catch {
    return res.status(502).json({ error: "Cannot reach Ollama." });
  }
});

// ─── /api/narrate ────────────────────────────────────────────────────────────
const NARRATE_SYSTEM = `You are a script writer for a spoken AI tutor avatar named David.
Your job is to convert markdown responses into natural spoken English that David will say.
Rules:
- Write ONLY what David should say
- Speak like a knowledgeable teacher
- Skip exhaustive lists, hit key points
- No markdown syntax (no asterisks, hashes, backticks)
- Convert math/code to plain English
- Match natural speaking pace`;

app.post("/api/narrate", async (req, res) => {
  const { provider = "groq", model, content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Missing content" });
  }

  // Skip LLM for short simple responses
  const isSimple = content.length < 120 && !/[`#*|\\^_]/.test(content);
  if (isSimple) {
    return res.json({ script: content });
  }

  if (provider === "groq") {
    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
      return res.json({ script: content, fallback: true });
    }

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model || "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: NARRATE_SYSTEM },
              { role: "user", content },
            ],
            temperature: 0.3,
            max_tokens: 600,
          }),
        }
      );

      if (!response.ok) {
        return res.json({ script: content, fallback: true });
      }

      const data = await response.json();
      return res.json({ script: data.choices[0].message.content });
    } catch {
      return res.json({ script: content, fallback: true });
    }
  }

  return res.json({ script: content, fallback: true });
});

// ─── /api/tts ────────────────────────────────────────────────────────────────
const DEFAULT_TTS_MODEL = "aura-2-apollo-en";

app.post("/api/tts", async (req, res) => {
  const apiKey = process.env.EDACTLY_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "EDACTLY_API_KEY is not set." });
  }

  const { text, model } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Missing 'text'." });
  }

  try {
    const response = await fetch(
      `https://api.deepgram.com/v1/speak?model=${encodeURIComponent(model || DEFAULT_TTS_MODEL)}&encoding=mp3`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${apiKey}`,
        },
        body: JSON.stringify({ text }),
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      return res.status(502).json({ error: `Deepgram error ${response.status}: ${errBody}` });
    }

    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString("base64");
    return res.json({ audioBase64 });
  } catch {
    return res.status(502).json({ error: "Failed to reach Deepgram API." });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
