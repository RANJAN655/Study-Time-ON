const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ reply: "API key missing" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const { message } = req.body;

    if (typeof message !== "string") {
      return res.status(400).json({ reply: "Invalid message" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const result = await model.generateContent(message);

    const reply =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response";

    res.status(200).json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: err.message });
  }
}