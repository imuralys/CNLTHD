import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Order = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }
    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        const sortedOrders = response.data.orders.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
        setOrders(sortedOrders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const statusHandler = async (e, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: e.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
        toast.success("Cập nhật trạng thái thành công");
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  
  const deleteOrder = async (orderId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      try {
        const response = await axios.post(
          backendUrl + "/api/order/delete",
          { orderId },
          { headers: { token } }
        );
        if (response.data.success) {
          await fetchAllOrders();
          toast.success("Xóa đơn hàng thành công");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error.message);
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="p-5">
      <h2 className="text-2xl font-medium mb-5">Quản lý đơn hàng</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Mã đơn hàng</th>
              <th className="py-2 px-4 border">Ngày đặt</th>
              <th className="py-2 px-4 border">Sản phẩm</th>
              <th className="py-2 px-4 border">Tổng tiền</th>
              <th className="py-2 px-4 border">Trạng thái</th>
              <th className="py-2 px-4 border">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4 border">{order.orderId}</td>
                <td className="py-2 px-4 border">
                  {new Date(order.date).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="py-2 px-4 border">
                  {order.items.map((item, i) => (
                    <div key={i}>
                      {item.name} x {item.quantity}
                    </div>
                  ))}
                </td>
                <td className="py-2 px-4 border text-right">
                  {order.amount.toLocaleString()} {currency}
                </td>
                <td className="py-2 px-4 border">
                  <select
                    className="w-full p-1 border rounded"
                    value={order.status}
                    onChange={(e) => statusHandler(e, order._id)}
                  >
                    <option value="Đã đặt hàng" disabled={order.status !== "Đã đặt hàng"}>Đã đặt hàng</option>
                    <option value="Đang xử lý" disabled={order.status !== "Đang xử lý"}>Đang xử lý</option>
                    <option value="Đang giao"disabled={order.status !== "Đang giao"}>Đang giao</option>
                    <option value="Đã giao" disabled={order.status !== "Đã giao"}>Đã giao</option>
                    <option value="Đã hủy" disabled={order.status !== "Đã hủy"}>Đã hủy</option>
                  </select>
                </td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orders.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          Chưa có đơn hàng nào
        </div>
      )}
    </div>
  );
};

export default Order;
