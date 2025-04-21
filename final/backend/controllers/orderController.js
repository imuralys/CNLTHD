import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import crypto from "crypto";
import axios from "axios";

// Placing order using COD
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    if (items.length === 0) {
      return res.status(400).json({ success: false, message: "Không có sản phẩm trong giỏ hàng" });
    }
    if (address.address === "") {
      return res.status(400).json({ success: false, message: "Địa chỉ không được để trống" });
    }
    if (address.firstName === "" || address.lastName === "") {
      return res.status(400).json({ success: false, message: "Họ và Tên không được để trống" });
    }
    if (address.city === "" || address.district === "" || address.ward === "") {
      return res.status(400).json({ success: false, message: "Vui lòng chọn đầy đủ địa chỉ" });
    }
    if (address.phone === "") {
      return res.status(400).json({ success: false, message: "Số điện thoại không được để trống" });
    }
    
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      orderId: "COD" + new Date().getTime(),
      date: Date.now(),
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    res.status(200).json({ success: true, message: "Đặt hàng thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Place order using MoMo
const placeOrderMoMo = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const orderId = new Date().getTime();
    const requestId = orderId;
    const orderInfo = "Thanh toan don hang";
    const redirectUrl = "http://localhost:3000/orders";
    const ipnUrl = "http://localhost:5000/api/order/callback";
    const requestType = "captureWallet";
    const extraData = "";
    const partnerCode = "MOMO";
    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
    const signature = crypto.createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');
    const requestBody = {
      partnerCode: partnerCode,
      accessKey: accessKey,
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
      lang: "vi"
    };
    
    try {
      const response = await axios.post("https://test-payment.momo.vn/v2/gateway/api/create", requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.resultCode === 0) {
        const orderData = {
          userId,
          items,
          address,
          amount,
          paymentMethod: "MoMo",
          payment: false,
          date: Date.now(),
          orderId,
        };
        const newOrder = new orderModel(orderData);
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });
        
        return res.status(200).json({ success: true, payUrl: response.data.payUrl });
      }
      else {
        return res.status(400).json({ success: false, message: response.data.message });
      }

    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// MoMo payment callback
const callbackMomo = async (req, res) => {
  try {
    const { orderId, resultCode } = req.body;
    if (resultCode === 0) {
      await orderModel.findOneAndUpdate({ orderId }, { payment: true });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check transaction status
const transactionStatus = async (req, res) => {
  try {
    const { orderId } = req.body;
    const requestId = orderId;
    const partnerCode = "MOMO";
    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const rawSignature = "accessKey=" + accessKey + "&orderId=" + orderId + "&partnerCode=" + partnerCode + "&requestId=" + requestId;
    const signature = crypto.createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');
    const requestBody = {
      partnerCode: partnerCode,
      accessKey: accessKey,
      requestId: requestId,
      orderId: orderId,
      signature: signature,
      lang: "vi"
    };

    const response = await axios.post("https://test-payment.momo.vn/v2/gateway/api/query", requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.resultCode === 0) {
      await orderModel.findOneAndUpdate({ orderId }, { payment: true });
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all orders (Admin)
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find().sort({ date: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user orders
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status (Admin)
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findOneAndUpdate({ orderId }, { status });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    await orderModel.findOneAndUpdate({ orderId }, { status: "Đã hủy" });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderMoMo,
  callbackMomo,
  transactionStatus,
  allOrders,
  userOrders,
  updateStatus,
  cancelOrder
};
