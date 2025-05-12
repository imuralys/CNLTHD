import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("MongoDB connected");
        });

        mongoose.connection.on('error', (err) => {
            console.error("MongoDB connection error:", err);
        });

        await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'Gamifystore',
        });
    } catch (err) {
        console.error("Failed to connect MongoDB:", err.message);
        process.exit(1); // Dừng container nếu kết nối thất bại
    }
};

export default connectDB;
