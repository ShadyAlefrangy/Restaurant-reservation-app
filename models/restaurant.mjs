import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export const Restaurant = mongoose.model('Restaurant', restaurantSchema, 'restaurants');