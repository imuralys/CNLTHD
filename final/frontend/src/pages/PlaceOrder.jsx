import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/frontend_assets/assets";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const {
    backendURL,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);
  const [method, setMethod] = useState("cod");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    phone: "",
  });
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };
  const navigate = useNavigate();
  const submitHandler = async (event) => {
    event.preventDefault();
    const amount = getCartAmount() + delivery_fee;
  
    try {
      let orderItems = [];
  
      for (const items in cartItems) {
        const itemInfo = structuredClone(
          products.find((product) => product._id === items)
        );
  
        if (itemInfo) {
          itemInfo.quantity = cartItems[items];
          orderItems.push(itemInfo);
  
          try {
            const response = await axios.post(
              backendURL + "/api/product/update-quantity",
              {
                productId: itemInfo._id,
                quantity: itemInfo.quantity,
              },
              {
                headers: { token },
              }
            );
  
            if (!response.data?.success) {
              toast.error(response.data?.message || "Cập nhật số lượng thất bại!");
            }
          } catch (err) {
            console.error("Lỗi khi cập nhật số lượng:", err);
            const msg = err.response?.data?.message || "Lỗi kết nối tới server";
            toast.error(msg);
          }
        }
      }
  
      // 🆕 Gửi đơn hàng đến backend
      const placeRes = await axios.post(backendURL + "/api/order/place", {
        items: orderItems,
        amount,
        address: `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.city}`,
        phone: formData.phone,
        payment: method,
      }, {
        headers: { token }
      });
  
      if (placeRes.data.success) {
        toast.success("Đặt hàng thành công!");
        setCartItems({});
        navigate("/my-orders");
      } else {
        toast.error(placeRes.data.message || "Đặt hàng thất bại");
      }
  
    } catch (err) {
      console.error("Lỗi trong submitHandler:", err);
      const msg = err.response?.data?.message || err.message || "Lỗi không xác định";
      toast.error(msg);
    }
  };

  const getUserData = async () => {
    try {
      const response = await axios.post(
        backendURL + "/api/user/profile",
        {},
        {
          headers: { token },
        }
      );
      if (response.data.success) {
        const { email, address, phone, name } = response.data.userData;
        const nameParts = name.split(" ");
        const firstName = nameParts.slice(0, nameParts.length - 1).join(" ");
        const lastName = nameParts[nameParts.length - 1];

        setFormData({
          firstName,
          lastName,
          email,
          address,
          city: "",
          district: "",
          ward: "",
          phone,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, [token]);

  return (
    <form
      onSubmit={submitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* ---------- LEFT SIDE ----------- */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-2">
          <Title text1={"THÔNG TIN"} text2={"THANH TOÁN"} />
        </div>
        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Họ"
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            required
          />
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Tên"
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            required
          />
        </div>
        <input
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="email"
          placeholder="Email"
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          required
        />
        <input
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="text"
          placeholder="Địa chỉ"
          onChange={onChangeHandler}
          name="address"
          value={formData.address}
          required
        />
        <input
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="text"
          placeholder="Thành phố"
          onChange={onChangeHandler}
          name="city"
          value={formData.city}
          required
        />
        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Quận/Huyện"
            onChange={onChangeHandler}
            name="district"
            value={formData.district}
            required
          />
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Xã/Phường"
            onChange={onChangeHandler}
            name="ward"
            value={formData.ward}
            required
          />
        </div>
        <input
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="phone"
          placeholder="Số điện thoại"
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          required
        />
      </div>
      {/* ---------- RIGHT SIDE ----------- */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>
        <div className="mt-12">
          <Title text1={"PHƯƠNG THỨC"} text2={"THANH TOÁN"} />
          {/*Payment Method Selection */}
          <div
            onClick={() => setMethod("cod")}
            className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
          >
            <p
              className={`min-w-3.5 h-3.5 border rounded-full ${
                method === "cod" ? "bg-green-400" : ""
              }`}
            ></p>
            <p className="text-gray-500 text-sm font-medium mx-4">
              Thanh toán khi nhận hàng
            </p>
          </div>
          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 text-sm"
            >
              ĐẶT HÀNG
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
