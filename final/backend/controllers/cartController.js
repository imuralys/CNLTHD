import userModel from '../models/userModel.js'

// add products to user cart
const addToCart = async () => {
    if (!token) {
      toast.error("Đăng nhập để thêm vào giỏ hàng!");
      return;
    }
  
    try {
      const res = await axios.post(
        `${backendUrl}/api/cart/add`,
        { userId: user._id, itemId: productId },
        { headers: { token } }
      );
  
      if (res.data.success) {
        toast.success(res.data.message || "Đã thêm vào giỏ hàng");
      } else {
        toast.error(res.data.message || "Thêm vào giỏ hàng thất bại");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi thêm vào giỏ hàng");
    }
  };
  

// update user cart
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, quantity } = req.body;
        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;

        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: 'Giỏ hàng đã được cập nhật' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// get user cart data
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId)
        const cartData = await userData.cartData
        res.json({ success: true, cartData })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}


export { addToCart, updateCart, getUserCart }