import { useContext } from "react"
import { ShopContext } from "../context/ShopContext" 
import { Link } from "react-router-dom"

const ProductItem = ({id, image, name, price}) => {
    const {currency} = useContext(ShopContext);
    return (
        <Link className="text-gray-700 cursor-pointer flex flex-col h-full" to={`/product/${id}`}>
            <div className="overflow-hidden aspect-square">
                <img className="w-full h-full object-cover hover:scale-110 transition ease-in-out" src={image[0].url} alt="" />
            </div>
            <div className="flex flex-col flex-grow pt-3">
                <p className="text-md line-clamp-2">{name}</p>
                <p className="text-md font-bold mt-auto">{price} {currency}</p>
            </div>
        </Link>
    )
}

export default ProductItem
