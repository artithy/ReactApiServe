import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function SuccessPage() {
    const location = useLocation();
    const { orderId } = location.state || {};

    return (

        <div className="flex items-center justify-center min-h-screen bg-blue-50">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <h1 className="text-2xl font-bold text-blue-700 mb-3">Order Successful!</h1>
                <p className="text-gray-600 mb-4"> Thank you for your purchase. Your order has been placed successfully.</p>
                {orderId && (
                    <p className="text-lg font-semibold text-gray-800 mb-4">
                        Your Order Id: <span className="text-blue-600">{orderId}</span>
                    </p>
                )}
                <Link to="/menu"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Back to home</Link>

            </div>

        </div>
    );

}