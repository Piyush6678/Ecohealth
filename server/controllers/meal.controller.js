import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "node:fs";
import path from "path";
// Assuming 'prompt' from your config is for the image analysis
import { prompt as imagePrompt } from "../config/prompt.js";

/**
 * @description Analyzes a food item from an uploaded image.
 * @route POST /api/v1/user/meal/nutrition-by-image
 */
export const getNutritionByImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const imagePath = path.join(process.cwd(), 'uploads', req.file.filename);
        const imagePart = {
            inlineData: {
                data: fs.readFileSync(imagePath).toString("base64"),
                mimeType: req.file.mimetype,
            },
        };

        const result = await model.generateContent([imagePrompt, imagePart]);
        const response = result.response;
        const text = response.text();

        // Clean up the uploaded file
        fs.unlinkSync(imagePath);

        res.status(200).json({ nutritionInfo: text });

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500).send("Failed to analyze image.");
    }
};

/**
 * @description Analyzes a food item from a text name.
 * @route POST /api/v1/user/meal/nutrition-by-name
 */
export const getNutritionByName = async (req, res) => {
    const { food_name } = req.body;

    if (!food_name) {
        return res.status(400).json({ error: "The 'food_name' field is required." });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // A new, specific prompt for text-based queries
        const textPrompt = `Analyze the nutritional information for the food item: "${food_name}". Your response MUST be only the JSON object, with the exact same structure as if you were analyzing an image. The structure is:
        {
          "item_name": "...",
          "nutrition_totals": { "calories_kcal": ..., "protein_g": ..., "carbs_g": ..., "fat_g": ..., "fiber_g": ... },
          "allergens": [...]
        }`;

        const result = await model.generateContent(textPrompt);
        const response = result.response;
        const text = response.text();

        res.status(200).json({ nutritionInfo: text });

    } catch (error) {
        console.error("Error calling Gemini API for text input:", error);
        res.status(500).send("Failed to get nutritional data.");
    }
};