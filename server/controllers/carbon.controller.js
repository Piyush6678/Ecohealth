/**
 * Note: These are example emission factors. In a real-world application,
 * these would be more complex and might be sourced from a dedicated API or a comprehensive database.
 * The factors can vary significantly by region, country, and specific technology.
 */
const emissionFactors = {
    // Driving (kg CO2e per km)
    'driving_car_petrol': 0.192,
    'driving_car_diesel': 0.171,
    'driving_car_hybrid': 0.120,
    'driving_car_electric': 0.05,
    'driving_motorbike': 0.103,
    'driving_bus': 0.105,
    'driving_train': 0.041,
    'cycling': 0.0,
    'walking': 0.0,

    // Home Energy
    'electricity_usage': 0.475, // kg CO2e per kWh
    'natural_gas': 0.181,     // kg CO2e per kWh
    'heating_oil': 2.5,       // kg CO2e per litre
    'lpg': 1.5,               // kg CO2e per litre

    // Flying (kg CO2e per km)
    'flying_domestic': 0.25,
    'flying_short_haul': 0.15,
    'flying_long_haul': 0.12,
    'flying_business_class': 0.45,
    
    // Food (kg CO2e per day) - These are global averages and can vary widely.
    'food_high_meat': 7.2,    // High meat consumption (100g+ per day)
    'food_medium_meat': 5.6,  // Medium meat consumption (50-99g per day)
    'food_low_meat': 4.7,     // Low meat consumption (<50g per day)
    'food_pescatarian': 3.9,  // Fish but no other meat
    'food_vegetarian': 3.8,   // No meat or fish
    'food_vegan': 2.9,        // No animal products
};

const calculateFootprint = (req, res) => {
    const { activity, value } = req.body;

    // Validate input
    if (!activity || value === undefined || isNaN(value) || value < 0) {
        return res.status(400).json({ message: 'Invalid input: activity and a non-negative numeric value are required.' });
    }

    // Check if the activity is supported and has an emission factor
    if (emissionFactors[activity] === undefined) {
        return res.status(400).json({ message: `Unknown activity: ${activity}. Please select a supported activity.` });
    }

    // Calculate carbon footprint
    const carbonFootprint = value * emissionFactors[activity];

    // Return the calculated footprint
    res.status(200).json({ carbonFootprint: carbonFootprint });
}

const addFootprint = (req, res) => { 
    // This function is not implemented as per your original code.
    res.status(501).json({ message: 'Not Implemented' });
}

export { calculateFootprint, addFootprint };

 