import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AllOrders() {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                "http://localhost:8000/getAllOrdersWithItems.php",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (response.data.status) {
                setOrders(response.data.orders);
            } else {
                toast.error("Failed to load orders");
            }
        } catch (error) {
            toast.error("Failed to load orders", error);
        }
    };
    useEffect(() => {
        fetchOrders();
    }, []);


    const handleMarkAsDelivered = async (orderId) => {
        toast.info("You are making this order as 'Delivered'");
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:8000/update_order_status.php",
                { order_id: orderId, status: "delivered" },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.status) {
                toast.success("Order marked as delivered!");
                fetchOrders();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to update status: ", error);
        }
    };



    return (
        <div className="min-h-screen w-full bg-gray-100 px-5 py-20">
            <h2 className="text-2xl font-bold mb-4">All orders</h2>
            <div className="overflow-x-auto bg-gray-100 ">
                <table className="min-w-full bg-white border border-gray-200 ">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border">ID</th>
                            <th className="px-4 py-2 border">Order ID</th>
                            <th className="px-4 py-2 border">Invoice ID</th>
                            <th className="px-4 py-2 border">Customer</th>
                            <th className="px-4 py-2 border">Phone</th>
                            <th className="px-4 py-2 border">Address</th>
                            <th className="px-4 py-2 border">Items</th>
                            <th className="px-4 py-2 border">Total</th>
                            <th className="px-4 py-2 border">Date</th>
                            <th className="px-4 py-2 border">Status</th>
                            <th className="px-4 py-2 border">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-4 py-2 border">{order.id}</td>
                                <td className="px-4 py-2 border">{order.order_id}</td>
                                <td className="px-4 py-2 border">{order.invoice_id}</td>
                                <td className="px-4 py-2 border">{order.customer_name}</td>
                                <td className="px-4 py-2 border">{order.customer_phone}</td>
                                <td className="px-4 py-2 border">{order.customer_address}</td>
                                <td className="px-4 py-2 border">
                                    <ul className="list-disc list-inside">
                                        {order.order_details?.map((item, idx) => (
                                            <li key={idx}>{item.food_name} × {item.quantity}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="px-4 py-2 border">{parseFloat(order.total_price).toFixed(2)}</td>
                                <td className="px-4 py-2 border">{new Date(order.order_date).toLocaleString()}</td>
                                <td className="px-4 py-2 border">
                                    <span className={
                                        `
                                        px-2 py-1 rounded-full text-xs font-semibold upppercase ${order.status === "pending" ? "bg-yellow-200 text-yellow-800"
                                            : order.status === "processing" ? "bg-blue-200 text-blue-800"
                                                : order.status === "delivered" ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-800"
                                        }
                                        `
                                    }>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-4 py-2 border">{order.status !== "delivered" && (
                                    <button onClick={() => handleMarkAsDelivered(order.id)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rouned text-sm"
                                    >
                                        Mark Delivered
                                    </button>
                                )}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>

    )
};
