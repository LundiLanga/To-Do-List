import mongoose from "mongoose";
const connectDB = async()=>{ 
    const connect = "mongodb+srv://Lundilanga:Aluh@9998@cluster0.2kdek.mongodb.net/tasks_table?retryWrites=true&w=majority&appName=Cluster0"
    await mongoose.connect(connect)
    console.log("Successfully connected to the MongoDB")
}

export default connectDB;