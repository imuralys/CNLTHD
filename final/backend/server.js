import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouters from './routes/userRoute.js'
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// App config
const app = express();
const port = process.env.PORT || 4000;
connectDB()
connectCloudinary()

// middlewares
app.use(express.json());
app.use(cors());

// api endpoints
app.use('/api/user', userRouters)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err.message);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  });

  
app.get("/", (req, res) => {
    res.send("API WORKING");
});

const server = app.listen(port, () => {
    console.log("server start on port: " + port);
});

export {app, server};