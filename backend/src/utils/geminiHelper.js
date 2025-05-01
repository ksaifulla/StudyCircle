// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const {GEMINI_API_KEY} = require("../config");

// const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// const askGemini = async (prompt) => {
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//   const result = await model.generateContent(prompt);
//   const response = await result.response;
//   return response.text();
// };

// module.exports = {askGemini};

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GEMINI_API_KEY } = require("../config");

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const askGemini = async (userMessage, groupContext = "") => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: groupContext }],
      }
    ],
    generationConfig: {
      temperature: 0.7,
    },
  });

  const result = await chat.sendMessage(userMessage);
  return result.response.text();
};

module.exports = { askGemini };
