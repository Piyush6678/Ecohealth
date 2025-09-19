import { Schema, model } from 'mongoose';

const carbonSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['driving', 'flying', 'energy', 'food'] // Matches frontend config
    },
    activity: {
        type: String,
        required: true
    },
    userInput: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    carbonFootprintKg: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const carbonModel = model("CarbonEntry", carbonSchema);
export default carbonModel;
