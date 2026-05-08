import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      reply: "Method not allowed",
    });
  }

  try {

    const apiKey = process.env.GEMINI_API_KEY;

    const { message } = req.body;

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const result =
      await model.generateContent(message);

    const reply = result.response.text();

    return res.status(200).json({
      reply,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      reply: err.message,
    });
  }
}