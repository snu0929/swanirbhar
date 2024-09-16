// aiService.js

const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const getTaskPrioritySuggestions = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    return { suggestions: result.response.text() };
  } catch (error) {
    console.error("Error with AI API:", error);
    throw new Error("Failed to get AI suggestions");
  }
};

module.exports = { getTaskPrioritySuggestions };
