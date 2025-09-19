import { Router } from "express";

import { addMeal, getNutritionByImage, getNutritionByName } from "../controllers/meal.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const mealRouter=Router()
mealRouter.route("/nutrition-by-image").post(upload.single("meal"),getNutritionByImage)
mealRouter.route("/nutrition-by-name").post(getNutritionByName)
mealRouter.route("/addmeal").post(authMiddleware  ,addMeal)



export default mealRouter