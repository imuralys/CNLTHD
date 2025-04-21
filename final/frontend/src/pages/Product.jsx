import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import axios from "axios";
import { toast } from "react-toastify";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, backendURL } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchProductData = async () => {
    try {
      // Tìm sản phẩm trong context
      const product = products.find(item => item._id === productId);
      if (product) {
        console.log("Product data:", product); // Log để debug
        setProductData(product);
        setImage(product.images[0]);
      } else {
        // Nếu không tìm thấy trong context, lấy từ API
        const response = await axios.get(`${backendURL}/api/product/${productId}`);
        if (response.data.success) {
          setProductData(response.data.product);
          setImage(response.data.product.images[0]);
        } else {
          toast.error("Không tìm thấy sản phẩm");
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Không thể tải thông tin sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const checkQuantity = async () => {
    try {
      const response = await axios.get(
        `${backendURL}/api/product/check-quantity/${productId}`
      );
      if (response.data.success) {
        setQuantity(response.data.quantity);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error checking quantity:", error);
    }
  };

  useEffect(() => {
    fetchProductData();
    checkQuantity();
  }, [productId, products]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-500">
        <span>Trang chủ</span>
        <span className="mx-2">/</span>
        <span>{productData.category}</span>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{productData.name}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Hình ảnh sản phẩm */}
        <div className="md:w-1/2">
          <div className="mb-4 bg-gray-100 p-4 rounded-lg">
            <img
              className="w-full h-auto rounded-lg transition-opacity duration-300"
              src={image?.url}
              alt={productData.name}
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {productData.images.map((img, index) => (
              <img
                key={index}
                className={`w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity duration-300 ${
                  image?.url === img.url ? 'ring-2 ring-blue-500' : ''
                }`}
                src={img.url}
                alt={`${productData.name} ${index + 1}`}
                onClick={() => setImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="md:w-1/2">
          <div className="mb-4">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {productData.category}
            </span>
            <h1 className="text-2xl font-bold mt-2">{productData.name}</h1>
            <p className="text-gray-500">{productData.brand}</p>
          </div>

          <div className="mb-6">
            <p className="text-3xl font-bold text-red-600">
              {productData.price.toLocaleString()} {currency}
            </p>
            {productData.bestseller && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Bán chạy
              </span>
            )}
            {quantity > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Còn {quantity} sản phẩm
              </p>
            )}
          </div>



          {/* Mô tả sản phẩm */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Mô tả sản phẩm</h2>
            <p className="text-gray-700 whitespace-pre-line">{productData.description}</p>
          </div>

          {/* Nút thêm vào giỏ hàng */}
          <div className="mb-8">
            {quantity > 0 ? (
              <button
                onClick={() => {
                  addToCart(productData._id);
                  toast.success("Đã thêm vào giỏ hàng");
                }}
                className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
              >
                THÊM VÀO GIỎ HÀNG
              </button>
            ) : (
              <p className="text-red-500 font-medium text-center py-3">Hết hàng</p>
            )}
          </div>

          {/* Thông tin bảo hành và vận chuyển */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium">Bảo hành chính hãng</p>
                  <p className="text-sm text-gray-500">12 tháng</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <div>
                  <p className="font-medium">Miễn phí vận chuyển</p>
                  <p className="text-sm text-gray-500">Cho đơn hàng từ 5 triệu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sản phẩm liên quan */}
      <RelatedProducts category={productData.category} />
    </div>
  );
};

export default Product;
