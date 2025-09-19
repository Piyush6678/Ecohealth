import { Router } from "express";

import { getNutritionByImage, getNutritionByName } from "../controllers/meal.controller.js";
import upload from "../middlewares/multer.middleware.js";
const mealRouter=Router()
mealRouter.route("/nutrition-by-image").post(upload.single("meal"),getNutritionByImage)
mealRouter.route("/nutrition-by-name").post(getNutritionByName)



export default mealRouter