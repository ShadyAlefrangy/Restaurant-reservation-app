import mongoose from "mongoose";

export async function dbConnect() {
    try {
        await mongoose.connect('mongodb+srv://shady:*******@cluster0.4rv4jja.mongodb.net/?retryWrites=true&w=majority');
        console.log('Connected to MongoDB');
        return mongoose.connection;
    } catch (error) {
        console.log(error);
    }
}