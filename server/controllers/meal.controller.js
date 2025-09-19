import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "node:fs";
import path from "path";
// Assuming 'prompt' from your config is for the image analysis
import { prompt as imagePrompt } from "../config/prompt.js";
import mealModel from "../model/food.model.js";
import userModel from "../model/user.model.js";
 // Import the user model to update it

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








const isSameWeek = (date1, date2) => {
  // Create copies to avoid modifying the original date objects
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Get the day of the week (0 for Sunday, 6 for Saturday)
  const dayOfWeek1 = d1.getDay();
  const dayOfWeek2 = d2.getDay();

  // Calculate the date of the most recent Sunday for each date
  d1.setDate(d1.getDate() - dayOfWeek1);
  d2.setDate(d2.getDate() - dayOfWeek2);

  // Set the time to midnight to ensure we are only comparing the date part
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);

  // If the calculated Sundays are the same, the dates are in the same week
  return d1.getTime() === d2.getTime();
};


export const addMeal = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user;

    // --- 1. Validation and Authorization Check ---
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Meal items are required.' });
    }
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authorized. Please log in.' });
    }

    // --- 2. Save the New Meal Document ---
    const newMeal = new mealModel({ user: userId, items: items });
    const savedMeal = await newMeal.save();

    // --- 3. ✨ NEW: Fetch User to Check Last Update Time ---
    const user = await userModel.findById(userId);
    if (!user) {
      // This case is unlikely if auth is working, but it's good practice to check
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // --- 4. ✨ NEW: Determine if Weekly Progress Needs a Reset ---
    const now = new Date();
    const lastUpdate = user.lastUpdated;

    // The core logic: check if the last update was in a different week from this one.
    const needsReset = !isSameWeek(lastUpdate, now);

    // --- 5. Calculate Totals from the Current Meal ---
    const totalCaloriesFromMeal = items.reduce((sum, item) => sum + (item.calories || 0), 0);
    const totalProteinFromMeal = items.reduce((sum, item) => sum + (item.nutrition?.protein || 0), 0);
    const currentDayIndex = now.getDay(); // Sunday=0, Monday=1, ..., Friday=5

    // --- 6. ✨ NEW: Prepare and Execute the Conditional Update ---
    let updateQuery;

    if (needsReset) {
      // If it's a new week, create fresh arrays for calories and protein.
      const newWeeklyCalories = [0, 0, 0, 0, 0, 0, 0];
      const newWeeklyProtein = [0, 0, 0, 0, 0, 0, 0];
      
      // Place the current meal's data into the correct day's slot in the new arrays.
      newWeeklyCalories[currentDayIndex] = totalCaloriesFromMeal;
      newWeeklyProtein[currentDayIndex] = totalProteinFromMeal;

      // Prepare a query to use $set to completely overwrite the old weekly data.
      updateQuery = {
        $set: {
          weeklyCalories: newWeeklyCalories,
          weeklyProtein: newWeeklyProtein,
          lastUpdated: now
        }
      };
    } else {
      // If it's the same week, prepare a query to use $inc to simply increment today's values.
      updateQuery = {
        $inc: {
          [`weeklyCalories.${currentDayIndex}`]: totalCaloriesFromMeal,
          [`weeklyProtein.${currentDayIndex}`]: totalProteinFromMeal,
        },
        $set: { lastUpdated: now }
      };
    }
    
    // Atomically update the user document with the correctly prepared query.
    await userModel.findByIdAndUpdate(userId, updateQuery);

    // --- 7. Send Success Response ---
    res.status(201).json({
      success: true,
      message: 'Meal successfully added and progress updated!',
      meal: savedMeal
    });

  } catch (error) {
    console.error('Error in addMeal controller:', error);
    res.status(500).json({ success: false, message: 'Server error while adding meal.' });
  }
};


