import React from "react";
import { useNavigate } from "react-router-dom";

export default function Cart({
    cartItems,
    counts,
    increaseCount,
    decreaseCount,
    calculateCartTotal,
    setIsDrawerOpen,
    cartToken,
}) {

    const navigate = useNavigate();
    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                Your Cart is empty
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
                {cartItems.map((item) => (
                    <div
                        key={item.food_id}
                        className="flex justify-between items-center border-b border-gray-200 pb-2"
                    >
                        <img
                            src={`http://localhost:8000/${item.image}`}
                            className="w-16 h-16 rounded-lg object-cover mr-2"
                        />
                        <div className="flex-1">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-gray-600">
                                ${parseFloat(item.discount_price).toFixed(2)} x{" "}
                                {counts[item.food_id] || 0} = $
                                {(
                                    (parseFloat(item.discount_price) || 0) *
                                    (counts[item.food_id] || 0)
                                ).toFixed(2)}
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => decreaseCount(item.food_id)}
                                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                            >
                                -
                            </button>
                            <span className="w-6 text-center">
                                {counts[item.food_id] || 0}
                            </span>
                            <button
                                onClick={() => increaseCount(item.food_id)}
                                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t bg-white">
                <div className="font-bold text-lg mb-2">
                    Total: ${calculateCartTotal()}
                </div>
                <button
                    onClick={() => {
                        navigate("/order", {
                            state: {
                                cartItems,
                                counts,
                                totalPrice: calculateCartTotal(),
                                cartToken,
                            },
                        });
                        setIsDrawerOpen(false);
                    }}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Checkout
                </button>

            </div>
        </div>
    );
}
