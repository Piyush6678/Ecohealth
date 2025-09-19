 import { Router } from "express";
import  {addCarbonEntry ,calculateFootprint } from "../controllers/carbon.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const carbonRouter=Router()



carbonRouter.route("/calculate").post(calculateFootprint)// add weiight and goals 

carbonRouter.route("/addcO2").post(authMiddleware,addCarbonEntry)




export default carbonRouter