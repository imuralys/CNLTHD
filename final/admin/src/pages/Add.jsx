import { assets } from "../assets/assets";
import { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({token}) => {
  const [image1,setImage1] = useState(false)
  const [image2,setImage2] = useState(false)
  const [image3,setImage3] = useState(false)
  const [image4,setImage4] = useState(false)

  const [name,setName] = useState('')
  const [description,setDescription] = useState('')
  const [category,setCategory] = useState('Console')
  const [price,setPrice] = useState('')
  const [bestseller,setBestseller] = useState(false)
  const [isSubmit,setIsSubmit] = useState(false)
  const [quantity,setQuantity] = useState(0)

  // Highlights and includes
  const [highlights,setHighlights] = useState([''])
  const [includes,setIncludes] = useState([''])

  const addHighlight = () => {
    setHighlights([...highlights, ''])
  }

  const removeHighlight = (index) => {
    const newHighlights = highlights.filter((_, i) => i !== index)
    setHighlights(newHighlights)
  }

  const updateHighlight = (index, value) => {
    const newHighlights = [...highlights]
    newHighlights[index] = value
    setHighlights(newHighlights)
  }

  const addInclude = () => {
    setIncludes([...includes, ''])
  }

  const removeInclude = (index) => {
    const newIncludes = includes.filter((_, i) => i !== index)
    setIncludes(newIncludes)
  }

  const updateInclude = (index, value) => {
    const newIncludes = [...includes]
    newIncludes[index] = value
    setIncludes(newIncludes)
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (isSubmit) return
    if (!price || price <= 0) {
      toast.error("Giá sản phẩm không được để trống hoặc nhỏ hơn 0!");
      return;
    }
  
    if (!quantity || quantity <= 0) {
      toast.error("Số lượng sản phẩm không được để trống hoặc nhỏ hơn 0!");
      return;
    }

    
  
    setIsSubmit(true)
    try {
      const formData = new FormData()
      image1 && formData.append('image1',image1)
      image2 && formData.append('image2',image2)
      image3 && formData.append('image3',image3)
      image4 && formData.append('image4',image4)
      formData.append('name',name)
      formData.append('description',description)
      formData.append('category',category)
      formData.append('price',price)
      formData.append('bestseller',bestseller)
      formData.append('quantity',quantity)
      
      // Highlights and includes
      formData.append('highlights', JSON.stringify(highlights.filter(h => h)))
      formData.append('includes', JSON.stringify(includes.filter(i => i)))

      const response = await axios.post(backendUrl + "/api/product/add",formData,{headers:{token}})
      if (response.data.success){
        toast.success(response.data.message)
        // Reset form
        setName('')
        setDescription('')
        setCategory('Console')
        setPrice('')
        setQuantity(0)
        setBestseller(false)
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setHighlights([''])
        setIncludes([''])
        setIsSubmit(false)
      }
      else{
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      <div>
        <p className="mb-2">Tải hình ảnh</p>
        <div className="flex gap-2">
          <label htmlFor="image1">
            <img className="w-20" src={!image1 ? assets.upload_area : URL.createObjectURL(image1) } alt="" />
            <input onChange={(e)=>setImage1(e.target.files[0])} type="file" id="image1" hidden />
          </label>
          <label htmlFor="image2">
            <img className="w-20" src={!image2 ? assets.upload_area : URL.createObjectURL(image2) } alt="" />
            <input onChange={(e)=>setImage2(e.target.files[0])} type="file" id="image2" hidden />
          </label>
          <label htmlFor="image3">
            <img className="w-20" src={!image3 ? assets.upload_area : URL.createObjectURL(image3) } alt="" />
            <input onChange={(e)=>setImage3(e.target.files[0])} type="file" id="image3" hidden />
          </label>
          <label htmlFor="image4">
            <img className="w-20" src={!image4 ? assets.upload_area : URL.createObjectURL(image4) } alt="" />
            <input onChange={(e)=>setImage4(e.target.files[0])} type="file" id="image4" hidden />
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="w-full">Tên sản phẩm</p>
        <input
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Nhập tại đây..."
          onChange={(e)=>setName(e.target.value)}
          value={name}
          required
        />
      </div>

      <div className="w-full">
        <p className="w-full">Mô tả sản phẩm</p>
        <textarea
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Nhập mô tả chi tiết về sản phẩm..."
          required
          onChange={(e)=>setDescription(e.target.value)}
          value={description}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Phân loại sản phẩm</p>
          <select onChange={(e)=>setCategory(e.target.value)} className="w-full px-3 py-2">
            <option value="Console">Console</option>
            <option value="Phụ kiện">Phụ kiện</option>
            <option value="Game">Game</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Giá sản phẩm</p>
          <input
            className="w-full px-3 py-2"
            type="number"
            placeholder="Nhập tại đây"
            onChange={(e)=>setPrice(e.target.value)}
            value={price}
            required
          />
        </div>

        <div>
          <p className="mb-2">Số lượng sản phẩm</p>
          <input
            className="w-full px-3 py-2"
            type="number"
            placeholder="Nhập tại đây"
            onChange={(e)=>setQuantity(e.target.value)}
            value={quantity}
            required
          />
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input onChange={()=>setBestseller(prev => !prev)} checked={bestseller} className="cursor-pointer" type="checkbox" id="bestseller" />
        <label htmlFor="bestseller">Chuyển thành sản phẩm bán chạy</label>
      </div>

      <button
        className={`w-40 py-3 mt-4 bg-black text-white ${
          isSubmit ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isSubmit}
      >
        {isSubmit ? "Đang thêm..." : "Thêm sản phẩm"}
      </button>
    </form>
  );
};

export default Add;
