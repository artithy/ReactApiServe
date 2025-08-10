import React, { useEffect, useState } from "react";
import axios from "axios";

export default function FoodMenu() {
    const [foods, setFoods] = useState([]);

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

    return (
        <div className="p-8 bg-blue-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-center mb-12 text-blue-800 tracking-wide">
                Explore Our Delicious Menu
            </h1>

            {foods.length === 0 ? (
                <p className="text-center text-gray-600 text-lg">No food items available.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {foods.map((food) => (
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
