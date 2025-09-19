import carbonModel from "../model/carbonfootprint.model.js";
import mealModel from "../model/food.model.js";
import userModel from "../model/user.model.js";

/**
 * @description Aggregates and returns all data needed for the user's analysis page.
 * @route GET /api/v1/analysis
 * @access Private
 */
export const getAnalysisData = async (req, res) => {
    try {
        const userId = req.user;

        // 1. Fetch the primary user document which contains goals and weekly progress
        const user = await userModel.findById(userId).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
 
        // 2. Fetch the 5 most recent meal entries
        const mealHistory = await mealModel.find({ user: userId })
            .sort({ createdAt: -1 }) // Sort by newest first
            .limit(5);

        // 3. Fetch the 5 most recent carbon entries
        const carbonHistory = await carbonModel.find({ user: userId }) 
            .sort({ createdAt: -1 }) // Sort by newest first
            .limit(5);

        // 4. Structure and send the response
        res.status(200).json({
            success: true,
            data: {
                goals: user.goals,
                weeklyProgress: {
                    calories: user.weeklyCalories,
                    protein: user.weeklyProtein,
                    carbon: user.weeklyCarbonFootprint,
                },
                mealHistory,
                carbonHistory,
            }
        });

    } catch (error) {
        console.error('Error fetching analysis data:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching analysis data.' });
    }
};
