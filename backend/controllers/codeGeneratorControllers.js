import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function formatResponse(response) {
    try {
        const cleanedResponse = response.slice(7, -3);
        console.log(cleanedResponse) // Assuming response always has characters to slice
        return JSON.parse(cleanedResponse);
    } catch (error) {
        console.error("Error formatting response:", error);
        throw new Error("Failed to format response.");
    }
}

const generateCode = async (req, res) => {
    try {
        const { problem, code } = req.body;
        if (typeof problem !== "string" || typeof code !== "string") {
            return res.status(400).json({ error: "Invalid input format." });
        }
        const prompt = `
            Given below is the problem statement. Please generate or complete the provided code with proper comments and clear logic as an experienced developer.
            Problem Statement:
            ${problem}
            Code:
            ${code}
            Please provide the code in a JSON format with an object named "code". The code could be empty, so you may have to write it from scratch.
        `;

        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();
        
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
