import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // ✅ debug (move here)
  console.log("KEY:", process.env.GEMINI_API_KEY);

  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    // ✅ explicit check
    if (!apiKey) {
      return res.status(500).json({
        reply: "API key missing"
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const { message } = req.body;

    // ✅ strict validation
    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        reply: "Valid message is required"
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const result = await model.generateContent(message);

    const reply =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("API ERROR:", err);

    return res.status(500).json({
      reply: err.message || "Something went wrong"
    });
  }
}