import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        reply: "Message is required"
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
    console.error(err);

    return res.status(500).json({
      reply: err.message || "Something went wrong"
    });
  }
}