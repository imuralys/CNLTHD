import Hero from "../components/Hero"
import LatestCollection from "../components/LatestCollection"
import Loader from "./Loader"
import { useState, useEffect  } from "react"

function Home() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return(
        <div>
            {loading ? <Loader /> : (
                <>
                    {/* Banner Section */}
                    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
                            style={{ 
                                backgroundImage: `url(https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)`
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-blue-900/70 flex items-center justify-center">
                                <div className="text-center text-white">
                                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400" style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: '2px' }}>GAMIFY STORE</h1>
                                    <p className="text-lg md:text-xl mb-6">Thế giới game đích thực dành cho bạn</p>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <LatestCollection />
                </>
            )}
        </div>
    )
}

export default Home