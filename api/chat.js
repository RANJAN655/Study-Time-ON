const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      reply: "Method not allowed"
    });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        reply: "API key missing"
      });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        reply: "Message missing"
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const result = await model.generateContent(message);

    const reply = result.response.text();

    return res.status(200).json({
      reply
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      reply: "Server Error"
    });
  }
};