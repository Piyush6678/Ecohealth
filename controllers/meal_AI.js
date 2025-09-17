// The corrected import statement
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import "dotenv/config";

const nutritionData = async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    try {
        // Use the correct class name 'GoogleGenAI'
        const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const imagePath = `uploads/${req.file.filename}`;

        const contents = [
            { text: "Analyze the food in this image and provide an estimated nutritional breakdown." },
            {
                inlineData: {
                    data: fs.readFileSync(imagePath).toString("base64"),
                    mimeType: req.file.mimetype,
                },
            },
            {
                inlineData: {
                    mimeType: 'text/plain',
                    data: Buffer.from(fs.readFileSync("prompt.txt")).toString("base64")
                },
            },

        ]

        /*const imagePart = {
            inlineData: {
                data: fs.readFileSync(imagePath).toString("base64"),
                mimeType: req.file.mimetype,
            },
        };*/

        //const prompt = "Analyze the food in this image and provide an estimated nutritional breakdown (calories, protein, carbs, fat).";

        const result = await model.generateContent({
            contents: contents
        });
        const response = result.response;
        const text = response.text();

        console.log(text);

        res.status(200).json({ nutritionInfo: text });

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500).send("Failed to analyze image.");
    }
};

export { nutritionData };