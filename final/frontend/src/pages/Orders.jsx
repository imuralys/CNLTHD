import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/frontend_assets/assets";

const Orders = () => {
  const { backendURL, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }
      const response = await axios.post(
        backendURL + "/api/order/user-orders",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrderData(response.data.orders);
      }
    } catch (error) {
      toast.error("Không thể tải dữ liệu đơn hàng");
    }
  };

  const checkOrderStatus = () => {
    loadOrderData();
    toast.success("Đã cập nhật trạng thái đơn hàng");
  };

  const cancelOrder = async (orderId) => {
    try {
      const response = await axios.post(
        backendURL + "/api/order/cancel-order",
        { orderId },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Đơn hàng đã được hủy thành công");
        loadOrderData();
      } else {
        toast.error("Hủy đơn hàng không thành công");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi hủy đơn hàng");
    }
  };

  useEffect(() => {
    if (token) {
      loadOrderData();
    }
  }, [token]);

  return (
    <div className="border-t pt-16">
      <span className="text-sm text-center block mb-8">
        <i>
          Với các đơn hàng thanh toán Momo, nếu đơn hàng các bạn thanh toán
          không thành công, chúng tôi sẽ gọi cho bạn để xác nhận và tiến hành
          phương thức thanh toán khác cho bạn. Nếu bạn không nhắc máy, chúng tôi
          sẽ <strong>hủy</strong> đơn hàng của bạn
        </i>
      </span>
      <div className="text-2xl mb-8">
        <Title text1={"ĐƠN HÀNG"} text2={"CỦA TÔI"} />
      </div>
      <div className="space-y-4">
        {orderData.map((item, index) => (
          <div
            key={index}
            className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex items-start gap-6 text-sm">
              <img className="w-16 sm:w-20" src={assets.order_icon} alt="" />
              <div>
                <p className="mt-1">
                  Mã đơn hàng:{" "}
                  <span className="text-gray-400">
                    {item.orderId ? item.orderId : "Chưa có mã đơn hàng"}
                  </span>
                </p>
                <p className="mt-1">
                  Ngày đặt hàng:{" "}
                  <span className="text-gray-400">
                    {new Date(item.date).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </p>
                <p className="mt-1">
                  Tổng giá trị đơn hàng:{" "}
                  <span className="text-gray-400">
                    {item.amount.toLocaleString()} {currency}
                  </span>
                </p>
                {item.items.map((product, index) => (
                  <div key={index}>
                    <p className="mt-1">
                      {product.name} x {product.quantity}{" "}
                      <a
                        href={`/product/${product._id}`}
                        className="text-blue-500 hover:underline"
                      >
                        Xem sản phẩm
                      </a>
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-2">
                <p
                  className={`min-w-2 h-2 rounded-full ${
                    item.status === "Đã giao"
                      ? "bg-green-500"
                      : item.status === "Đã hủy"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                ></p>
                <p className="text-sm md:text-base">{item.status}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={checkOrderStatus}
                  className="border px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-50"
                >
                  Kiểm tra trạng thái
                </button>
                <button
                  className={`border px-4 py-2 text-sm font-medium rounded-sm ${
                    item.status === "Đã giao" || item.status === "Đã hủy"
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                  onClick={() => cancelOrder(item._id)}
                  disabled={item.status === "Đã giao" || item.status === "Đã hủy"}
                >
                  Hủy đơn hàng
                </button>
              </div>
            </div>
          </div>
        ))}
        {orderData.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Bạn chưa có đơn hàng nào
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
