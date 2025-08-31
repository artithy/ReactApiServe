import React, { useEffect, useState } from "react";
import axios from "axios";
import Cart from "./Cart";
import Drawer from "./Drawer";

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
                res.data.item.forEach(item => countsMap[item.food_id] = item.quantity);
                setCounts(countsMap);

                return uniqueItems;
            }
            return [];
        } catch (error) {
            console.error("Failed to update cart:", error);
            return [];
        }
    };

    const increaseCount = async (foodId) => {
        try {
            setIsDrawerOpen(true);

            const newQty = (counts[foodId] || 0) + 1;
            await axios.post(`http://localhost:8000/add_to_cart.php?cart_token=${cartToken}`, { cart_token: cartToken, food_id: foodId, quantity: newQty });

            setCounts(prev => ({ ...prev, [foodId]: newQty }));
            await updateCartItems();
        } catch (error) {
            console.error("Cart update failed:", error);
        }
    };

    const decreaseCount = async (foodId) => {
        try {
            const currentQty = counts[foodId] || 0;
            if (currentQty <= 0) return;

            const newQty = currentQty - 1;

            if (newQty > 0) {
                await axios.post(
                    "http://localhost:8000/add_to_cart.php",
                    { cart_token: cartToken, food_id: foodId, quantity: newQty },
                    { headers: { "Content-Type": "application/json" } }
                );
            } else {
                // Delete item
                await axios.post(
                    "http://localhost:8000/delete_cart.php",
                    { cart_token: cartToken, food_id: foodId },
                    { headers: { "Content-Type": "application/json" } }
                );
            }

            setCounts(prev => {
                const updated = { ...prev };
                if (newQty > 0) {
                    updated[foodId] = newQty;
                } else {
                    delete updated[foodId];
                }
                return updated;
            });

            const updatedItems = await updateCartItems();
            setCartItems(updatedItems);

            if (updatedItems.length === 0) setIsDrawerOpen(false);
        } catch (error) {
            console.error("Cart update failed:", error);
        }
    };




    const calculateCartTotal = () => {
        let total = 0;
        cartItems.forEach(item => {
            const finalPrice = getFinalPrice(item.discount_price, item.vat_price);
            const qty = counts[item.food_id] || 0;
            total += finalPrice * qty;
        });
        return total.toFixed(2);
    };




    const getFinalPrice = (discountPrice, vatPercent) => {
        const price = parseFloat(discountPrice) || 0;
        const vat = parseFloat(vatPercent?.toString().replace("%", "")) || 0;
        return price + (price * vat) / 100;
    };


    return (
        <div className="bg-blue-50 min-h-screen relative flex">
            <div className="flex-1 flex flex-col">
                <header className="w-full p-4 flex justify-between items-center sticky top-0 bg-blue-50 z-30">
                    <h1 className="text-3xl font-bold text-gray-800">Explore Our Food Menu</h1>
                    <button
                        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center shadow-md transition duration-200"
                    >
                        <span className="hidden sm:inline">{isDrawerOpen ? 'Hide Cart' : 'View Cart'}</span>
                        <span className="ml-2 px-2 py-1 bg-white text-purple-800 rounded-full text-sm font-semibold">
                            ${calculateCartTotal()}
                        </span>
                    </button>
                </header>

                <div className="flex mt-2 justify-center space-x-2 mb-6 overflow-x-auto no-scrollbar sticky top-16 bg-blue-50 z-20">
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

                <div
                    className={`transition-all duration-300 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 ${isDrawerOpen ? 'bg-gray-200' : 'bg-blue-50'
                        }`}
                >
                    {filteredFoods.map(food => (
                        <div key={food.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 cursor-pointer overflow-hidden">
                            <div className="relative">
                                <img src={`http://localhost:8000/${food.image}`} alt={food.name} className="w-full h-48 object-cover rounded-t-2xl" />
                                <span className="absolute top-2 right-2 bg-blue-700 text-white text-xs font-bold px-2 py-1 rounded-lg shadow">
                                    VAT: {parseInt(food.vat_price)}%
                                </span>
                            </div>
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">{food.name}</h2>
                                <p className="text-gray-700 text-sm mb-3 line-clamp-3">{food.description || "No description available."}</p>
                                <p className="text-gray-800 text-sm mb-1"><span className="font-semibold">Cuisine:</span> {food.cuisine_name || "N/A"}</p>
                                <p className="text-gray-800 text-sm mb-4"><span className="font-semibold">Stock:</span> {food.stock_quantity || 0}</p>
                                <div className="flex flex-col space-y-1 mb-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-green-700 font-bold text-lg">
                                            ${getFinalPrice(food.discount_price, food.vat_price).toFixed(2)}
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

            </div>

            {isDrawerOpen && cartItems.length > 0 && (
                <Drawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    cartItemsCount={cartItems.length}
                >
                    <Cart
                        cartItems={cartItems}
                        counts={counts}
                        increaseCount={increaseCount}
                        decreaseCount={decreaseCount}
                        calculateCartTotal={calculateCartTotal}
                        setIsDrawerOpen={setIsDrawerOpen}
                        cartToken={cartToken}
                        getFinalPrice={getFinalPrice}
                    />
                </Drawer>

            )}



        </div>
    );
}
