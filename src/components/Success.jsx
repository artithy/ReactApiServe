import React from "react";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";


export default function SuccessPage() {
    const location = useLocation();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get("order_id");
    const invoiceId = queryParams.get("invoice");

    useEffect(() => {
        const fetchPaymentStatus = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8000/success.php?order_id=${orderId}&invoice=${invoiceId}`
                );
                setResult(res.data);
            } catch (err) {
                setResult({ status: false, message: "Server error" });
            } finally {
                setLoading(false);
            }
        };

        if (orderId && invoiceId) {
            fetchPaymentStatus();
        } else {
            setResult({ status: false, message: "Missing parameters" });
            setLoading(false);
        }
    }, [orderId, invoiceId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-blue-50">
                <div className="text-center text-gray-600 text-lg animate-pulse">
                    Checking payment...
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-50">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <h1 className={`text-2xl font-bold mb-3 ${result?.status ? "text-blue-700" : "text-red-600"}`}>
                    {result?.status ? "Order Successful!" : "Payment Failed!"}
                </h1>

                <p className="text-gray-600 mb-4">{result?.message || "Thank you for your purchase."}</p>

                {result?.order_id && (
                    <p className="text-lg font-semibold text-gray-800 mb-2">
                        Your Order Id: <span className="text-blue-600">{result.order_id}</span>
                    </p>

                )}

                {result?.invoice_id && (
                    <p className="text-lg font-semibold text-gray-800 mb-4">
                        Invoice Id: <span className="text-blue-600">{result.invoice_id}</span>
                    </p>
                )}

                <Link
                    to="/menu"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );

}