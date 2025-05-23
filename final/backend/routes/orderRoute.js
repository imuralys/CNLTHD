import express from "express";
import { placeOrder, placeOrderMoMo, allOrders, userOrders, updateStatus, callbackMomo, transactionStatus, cancelOrder, deleteOrder } from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// Payment routes
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/momo", authUser, placeOrderMoMo);
orderRouter.post("/callback", callbackMomo);
orderRouter.post("/transaction", transactionStatus);

// Admin routes
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);
orderRouter.post("/delete", adminAuth, deleteOrder);

// User routes
orderRouter.post("/user-orders", authUser, userOrders);
orderRouter.post("/cancel-order", authUser, cancelOrder);

export default orderRouter;
