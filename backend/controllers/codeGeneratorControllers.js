import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_API_KEY);

// Define a JSON schema for code generation
const schema = {
  description: "Structured response for generated code and explanation",
  type: SchemaType.OBJECT,
  properties: {
    code: {
      type: SchemaType.STRING,
      description: "Generated code based on the problem statement",
      nullable: false,
    },
    explanation: {
      type: SchemaType.STRING,
      description: "Explanation of the generated code",
      nullable: false,
    },
  },
  required: ["code", "explanation"],
};

// Initialize the model with the specified schema
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
});

// Helper function to format and parse the response
function formatResponse(response) {
  try {
    // Parse the JSON response directly
    const parsedResponse = JSON.parse(response);
    // console.log("Formatted JSON Response:", parsedResponse);
    return parsedResponse;
  } catch (error) {
    console.error("Error formatting response:", error.message);
    throw new Error("Failed to format response to JSON.");
  }
}

const generateCode = async (req, res) => {
  try {
    const { problem, code, language } = req.body;
    if (typeof problem !== "string" || typeof code !== "string" || typeof language !== "string") {
      return res.status(400).json({ error: "Invalid input format." });
    }

    const prompt = `
      Given below is the problem statement. Please generate or complete the provided code in ${language} with proper comments and clear logic as an experienced developer.
      Problem Statement:
      ${problem}
      Code:
      ${code}
      The code could be empty, so you may have to write it from scratch.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse the structured JSON response
    const generatedCode = formatResponse(responseText);
    res.json(generatedCode);
  } catch (error) {
    console.error("Error generating code:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate code." });
    }
  }
};

export { generateCode };
