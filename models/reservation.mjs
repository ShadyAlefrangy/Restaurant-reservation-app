import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        default: 'No notes'
    }
}, {
    timestamps: true
});

export const Reservation = mongoose.model('Reservation', reservationSchema, 'reservations');