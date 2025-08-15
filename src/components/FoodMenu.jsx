import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export default function FoodMenu() {
    const [foods, setFoods] = useState([]);
    const [counts, setCounts] = useState([]);
    const [selectedCuisine, setSelectedCuisine] = useState("All");
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const res = await axios.get("http://localhost:8000/get_food.php");
                if (res.data.status) {
                    setFoods(res.data.data || []);
                } else {
                    console.error("Failed to load foods:", res.data.message);
                }
            } catch (err) {
                console.error("Error fetching foods:", err);
            }
        };

        fetchFoods();
    }, []);


    useEffect(() => {
        try {
            const cartData = JSON.parse(localStorage.getItem("local_cart") || "{}");
            const updatedCart = Object.entries(cartData)
                .map(([id, qty]) => {
                    const food = foods.find(food => food.id === +id);
                    if (!food) {
                        return null;
                    }
                    return {
                        food_id: food.id,
                        food_name: food.name,
                        quantity: qty,
                        price: food.discount_price,
                        item_total: qty * food.discount_price,
                        image: food.image
                    };
                })
                .filter(Boolean);
            setCartItems(updatedCart);
        } catch (error) {
            setCartItems([]);
        }
    }, [foods]);

    const cuisine = ["All"];
    foods.forEach(food => {
        const Cuisine = food.cuisine_name || "N/A";
        if (!cuisine.includes(Cuisine)) {
            cuisine.push(Cuisine);
        }
    });

    const filteredFoods = selectedCuisine === "All"
        ? foods
        : foods.filter(food => (food.cuisine_name || "N/A") === selectedCuisine);


    const increaseCount = (id) => {
        setCounts((prev) => ({
            ...prev,
            [id]: (prev[id] || 0) + 1,

        }));

    }

    const decreaseCount = (id) => {
        setCounts((prev) => {
            const current = prev[id] || 0;
            if (current <= 0) return prev;
            return {
                ...prev,
                [id]: current - 1,
            }
        })
    }

    return (
        <div className="p-8 bg-blue-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-center mb-12 text-blue-800 tracking-wide">
                Explore Our Delicious Menu
            </h1>


            <div className="flex justify-center space-x-2 mb-6 overflow-x-auto no-scrollbar">
                {cuisine.map((cuisine) => {
                    return (
                        <button
                            key={cuisine}
                            onClick={() => setSelectedCuisine(cuisine)}
                            className={
                                "px-3 py-2 rounded-full font-semibold whitespace-nowrap text-sm transition " +
                                (selectedCuisine === cuisine
                                    ? "bg-blue-700 text-white shadow-md"
                                    : "bg-white text-blue-700 border border-blue-700 hover:bg-blue-100"
                                )
                            }>
                            {cuisine}

                        </button>
                    );
                })}


            </div>


            {filteredFoods.length === 0 ? (
                <p className="text-center text-gray-600 text-lg">No food items available.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredFoods.map((food) => (
                        <div
                            key={food.id}
                            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 cursor-pointer overflow-hidden"
                        >
                            <div className="relative">
                                <img
                                    src={`http://localhost:8000/${food.image}`}
                                    alt={food.name}
                                    className="w-full h-48 object-cover rounded-t-2xl"
                                />
                                <div className="absolute top-4 right-4 bg-blue-700 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                                    VAT {Math.round(food.vat_price)}%
                                </div>
                            </div>
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">{food.name}</h2>

                                <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                                    {food.description || "No description available."}
                                </p>

                                <p className="text-gray-800 text-sm mb-1">
                                    <span className="font-semibold">Cuisine:</span> {food.cuisine_name || "N/A"}
                                </p>

                                <p className="text-gray-800 text-sm mb-4">
                                    <span className="font-semibold">Stock:</span> {food.stock_quantity || 0}
                                </p>

                                <div className="flex items-center justify-between">
                                    <span className="text-green-700 font-bold text-lg">
                                        ${food.discount_price}
                                    </span>
                                    {parseFloat(food.discount_price) < parseFloat(food.price) && (
                                        <span className="text-gray-400 line-through text-sm">
                                            ${food.price}
                                        </span>
                                    )}
                                </div>
                            </div>


                            <div className="flex items-center justify-center space-x-4 py-2">



                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        decreaseCount(food.id);
                                    }}
                                    className="border border-gray-700 text-gray-600 font-semibold rounded-full w-9 h-9 flex items-center justify-center text-xl hover:bg-gray-200 "
                                >
                                    -

                                </button>

                                <span className="font-semibold text-gray-900 min-w-[28px] text-center text-lg">
                                    {counts[food.id] || 0}
                                </span>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        increaseCount(food.id);
                                    }}
                                    className="border border-gray-700 text-gray-600 font-semibold rounded-full w-9 h-9 flex items-center justify-center text-xl hover:bg-gray-200 "
                                >
                                    +

                                </button>




                            </div>




                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
