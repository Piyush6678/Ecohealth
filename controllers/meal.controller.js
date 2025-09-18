import express from 'express'
const app = express();
import mealModel from '../model/food.model';
import { nutritionData } from './meal_AI';

// check what middleware to pass

app.get('/meals', middleware, async function (req, res) {
    const meals = await mealModel.find({})
    res.json({
        meals
    })
} )
// this will return all meals

app.post('/processMeal', middleware, nutritionData(req, res))

app.post('/saveMeal', middleware, async function (req, res) {
    
})