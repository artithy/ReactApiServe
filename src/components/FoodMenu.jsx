import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FoodMenu() {
    const [foods, setFoods] = useState([]);
    const [counts, setCounts] = useState({});
    const [selectedCuisine, setSelectedCuisine] = useState("All");
    const [cartItems, setCartItems] = useState([]);
    const [cartToken, setCartToken] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const res = await axios.get("http://localhost:8000/get_food.php");
                if (res.data.status) setFoods(res.data.data || []);
            } catch (err) {
                console.error("Error fetching foods:", err);
            }
        };
        fetchFoods();
    }, []);

    useEffect(() => {
        const initCart = async () => {
            try {
                const res = await axios.post("http://localhost:8000/create_guest_cart.php", {});
                if (res.data.status) setCartToken(res.data.cart_token);
            } catch (err) {
                console.error("Failed to create cart:", err);
            }
        };
        initCart();
    }, []);

    useEffect(() => {
        if (!cartToken || foods.length === 0) return;

        const fetchCartItems = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/get_cart_item_with_food.php?cart_token=${cartToken}`);
                if (res.data.status) {
                    setCartItems(res.data.item);
                    const countsMap = {};
                    res.data.item.forEach(item => countsMap[item.food_id] = item.quantity);
                    setCounts(countsMap);
                }
            } catch (err) {
                console.error("Failed to fetch cart items:", err);
            }
        };
        fetchCartItems();
    }, [cartToken, foods]);

    const cuisine = ["All"];
    foods.forEach(food => {
        const c = food.cuisine_name || "N/A";
        if (!cuisine.includes(c)) cuisine.push(c);
    });

    const filteredFoods = selectedCuisine === "All"
        ? foods
        : foods.filter(food => (food.cuisine_name || "N/A") === selectedCuisine);

    const updateCartItems = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/get_cart_item_with_food.php?cart_token=${cartToken}`);

            if (res.data.status) {
                const uniqueItems = [];
                const seenFoodIds = [];

                res.data.item.forEach(item => {
                    if (!seenFoodIds.includes(item.food_id)) {
                        uniqueItems.push(item);
                        seenFoodIds.push(item.food_id);
                    }
                });

                setCartItems(uniqueItems);

                const countsMap = {};
                res.data.item.forEach(item => {
                    countsMap[item.food_id] = item.quantity;
                });

                setCounts(countsMap);
            }
        } catch (error) {
            console.error("Failed to update cart:", error);
        }
    };

    const increaseCount = async (foodId) => {
        try {
            const currentQty = counts[foodId] || 0;
            const newQty = currentQty + 1;

            await axios.post(`http://localhost:8000/add_to_cart.php?cart_token=${cartToken}`, {
                cart_token: cartToken,
                food_id: foodId,
                quantity: newQty
            });

            setCounts(prev => ({ ...prev, [foodId]: newQty }));

            await updateCartItems();
            setIsDrawerOpen(true);
        } catch (error) {
            console.error("Cart update failed:", error);
        }
    };

    const decreaseCount = async (foodId) => {
        try {
            const currentQty = counts[foodId] || 0;
            if (currentQty <= 0) return;

            const newQty = currentQty - 1;

            await axios.post(`http://localhost:8000/add_to_cart.php?cart_token=${cartToken}`, {
                cart_token: cartToken,
                food_id: foodId,
                quantity: newQty
            });

            setCounts(prev => ({ ...prev, [foodId]: newQty }));

            await updateCartItems();
            if (newQty === 0) setIsDrawerOpen(false);
        } catch (error) {
            console.error("Cart update failed:", error);
        }
    };

    const calculateCartTotal = () => {
        let total = 0;
        cartItems.forEach(item => {
            const price = parseFloat(item.discount_price) || 0;
            const qty = counts[item.food_id] || 0;
            total += price * qty;
        });
        return total.toFixed(2);
    };

    return (
        <div className="p-8 bg-blue-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-center mb-12 text-blue-800 tracking-wide">
                Explore Our Delicious Menu
            </h1>

            <div className="flex justify-center mb-6">
                <button
                    onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow-md"
                >
                    Cart: ${calculateCartTotal()}
                </button>
            </div>

            <div className="flex justify-center space-x-2 mb-6 overflow-x-auto no-scrollbar">
                {cuisine.map(c => (
                    <button
                        key={c}
                        onClick={() => setSelectedCuisine(c)}
                        className={`px-3 py-2 rounded-full font-semibold whitespace-nowrap text-sm transition ${selectedCuisine === c ? "bg-blue-700 text-white shadow-md" : "bg-white text-blue-700 border border-blue-700 hover:bg-blue-100"
                            }`}
                    >
                        {c}
                    </button>
                ))}
            </div>

            {filteredFoods.length === 0 ? (
                <p className="text-center text-gray-600 text-lg">No food items available.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredFoods.map(food => (
                        <div
                            key={food.id}
                            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 cursor-pointer overflow-hidden"
                        >
                            <img src={`http://localhost:8000/${food.image}`} alt={food.name} className="w-full h-48 object-cover rounded-t-2xl" />
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">{food.name}</h2>
                                <p className="text-gray-700 text-sm mb-3 line-clamp-3">{food.description || "No description available."}</p>
                                <p className="text-gray-800 text-sm mb-1"><span className="font-semibold">Cuisine:</span> {food.cuisine_name || "N/A"}</p>
                                <p className="text-gray-800 text-sm mb-4"><span className="font-semibold">Stock:</span> {food.stock_quantity || 0}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-green-700 font-bold text-lg">${food.discount_price}</span>
                                    {parseFloat(food.discount_price) < parseFloat(food.price) && (
                                        <span className="text-gray-400 line-through text-sm">${food.price}</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-center space-x-4 py-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); decreaseCount(food.id); }}
                                        className="border border-gray-700 text-gray-600 font-semibold rounded-full w-9 h-9 flex items-center justify-center text-xl hover:bg-gray-200">-</button>

                                    <span className="font-semibold text-gray-900 min-w-[28px] text-center text-lg">{counts[food.id] || 0}</span>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); increaseCount(food.id); }}
                                        className="border border-gray-700 text-gray-600 font-semibold rounded-full w-9 h-9 flex items-center justify-center text-xl hover:bg-gray-200">+</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}
