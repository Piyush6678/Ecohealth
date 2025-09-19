import { Schema, model } from 'mongoose';

const mealSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to your User model
      required: true,
    },
    items: [{
      foodName: { type: String, required: true },
      quantityGrams: { type: Number, default: 100 }, // Assuming a default for now
      calories: { type: Number, required: true },
      nutrition: {
        protein: { type: Number, required: true },
        carbs: { type: Number, required: true },
        fat: { type: Number, required: true },
      },
    }]
  },
  {
    timestamps: true
  }
);

const mealModel = model("Meal", mealSchema);
export default mealModel;
