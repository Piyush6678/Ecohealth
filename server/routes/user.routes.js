import { Router } from "express";
import { login, register, updateUserGoals } from "../controllers/user.controller.js";
import mealRouter from "./meal.routes.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getAnalysisData } from "../controllers/analysze.controller.js";
const userRouter=Router()



userRouter.route("/register").post(register)// add weiight and goals 
userRouter.route("/login").post(login)
userRouter.route("/goals").put( authMiddleware ,updateUserGoals)
userRouter.route("/analysis").get( authMiddleware ,getAnalysisData)


userRouter.use("/meal",mealRouter)
//logout

//get photo input out nutrition
//post  nutrition to user detail 
// get avg calories 
// get avg protien  
// get avg carbs
// get daily calorie intake    

//carobon - get activity 


export default userRouter