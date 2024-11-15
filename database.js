import mongoose from "mongoose";
import dotenv from "dotenv";
const connect ="mongodb+srv://Lundilanga:Aluh%409998@cluster0.2kdek.mongodb.net/tasks_table?retryWrites=true&w=majority";

dotenv.config();


const connectDB = async () => {
    try {
        await mongoose.connect(connect);
        console.log("Successfully connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

export default connectDB;
