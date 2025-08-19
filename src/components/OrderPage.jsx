import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function OrderPage() {
    const location = useLocation();
    const {
        cartItems: initialCartItems = [],
        counts = {},
        cartToken,
        totalPrice = 0
    } = location.state || {};

    const [cartItems, setCartItems] = useState(initialCartItems);
    const [order, setOrder] = useState({
        customer_name: "",
        delivery_address: "",
        phone_number: "",
        order_notes: ""
    });
    const [placingOrder, setPlacingOrder] = useState(false);
    const [total] = useState(totalPrice);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrder(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setPlacingOrder(true);

        const payload = {
            cart_token: cartToken,
            customer_name: order.customer_name,
            delivery_address: order.delivery_address,
            phone_number: order.phone_number,
            order_notes: order.order_notes,
            total_price: total,
            items: cartItems.map(item => ({
                food_id: item.food_id,
                food_name: item.name,
                quantity: counts[item.food_id] || 0,
                price: item.discount_price
            }))
        };

        try {
            const res = await axios.post("http://localhost:8000/place_order.php", payload);
            if (res.data.status) {
                toast.success(`${res.data.message} (Order ID: ${res.data.order_id})`);
                setCartItems([]);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setPlacingOrder(false);
        }
    };

    if (!cartItems || cartItems.length === 0) {
        return <p className="p-4 text-center text-gray-500 text-lg">Your Cart is empty</p>
    }

    return (
        <div className="max-w-md mx-auto p-4 bg-gray-50 rounded-xl mt-8 shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Review & Place Order</h2>

            <div>
                {cartItems.map(item => (
                    <div key={item.food_id} className="flex items-center bg-white rounded-lg shadow-sm overflow-hidden">
                        <img src={`http://localhost:8000/${item.image}`} className="w-20 h-20 object-cover" />
                        <div className="flex-1 p-3">
                            <h3 className="text-md font-semibold text-gray-900">{item.name}</h3>
                            <p>Qty: {counts[item.food_id]}</p>
                        </div>
                        <p>${(parseFloat(item.discount_price) * counts[item.food_id]).toFixed(2)}</p>
                    </div>
                ))}
            </div>

            <div className="font-bold text-lg text-right mb-4">
                Total: ${total}
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-3 bg-white p-4 rounded-lg shadow-sm">
                <div className="mb-3">
                    <input
                        type="text"
                        name="customer_name"
                        placeholder="Your Name"
                        value={order.customer_name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="mb-3">
                    <textarea
                        name="delivery_address"
                        placeholder="Delivery Address"
                        value={order.delivery_address}
                        onChange={handleChange}
                        required
                        rows="2"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        name="phone_number"
                        placeholder="Phone Number"
                        value={order.phone_number}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="mb-3">
                    <textarea
                        name="order_notes"
                        placeholder="Order Notes (Optional)"
                        value={order.order_notes}
                        onChange={handleChange}
                        rows="1"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <button type="submit" disabled={placingOrder} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-medium transition duration-200">
                    {placingOrder ? "Processing..." : `Pay $${total}`}
                </button>
            </form>
        </div>
    );
}
