import axios from 'axios';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function FoodList() {
    const [foods, setFoods] = useState([]);

    const fetchFoods = async () => {
        try {
            const res = await axios.get("http://localhost:8000/get_food.php");
            if (res.data.status) {
                setFoods(res.data.data || []);
            } else {
                toast.error(res.data.message || "Failed to load foods");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error fetching foods");
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this food?")) return;

        try {
            const res = await axios.post(
                "http://localhost:8000/delete_food.php",
                { id },
                { headers: { "Content-Type": "application/json" } }
            );

            if (res.data.status) {
                toast.success(res.data.message);
                fetchFoods();
            } else {
                toast.error(res.data.message || "Failed to delete food");
            }
        } catch (error) {
            console.error(error);
            toast.error("Delete request failed");
        }
    };

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 py-4 overflow-x-auto">
                <h2 className="text-3xl font-bold text-center mb-6">Food List</h2>
                <ToastContainer position="top-right" autoClose={3000} />

                <table className="min-w-[800px] w-full text-sm border border-gray-200">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="px-4 py-2">Image</th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Description</th>
                            <th className="px-4 py-2">Price</th>
                            <th className="px-4 py-2">Discount</th>
                            <th className="px-4 py-2">VAT %</th>
                            <th className="px-4 py-2">Stock</th>
                            <th className="px-4 py-2">Created</th>
                            <th className="px-4 py-2">Delete</th>
                        </tr>
                    </thead>

                    <tbody>
                        {foods.map((food, index) => (
                            <tr key={food.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                <td className="px-4 py-2">
                                    {food.image ? (
                                        <img
                                            src={`http://localhost:8000/${food.image}`}
                                            alt={food.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                    ) : (
                                        "No Image"
                                    )}
                                </td>
                                <td className="px-4 py-2">{food.name}</td>
                                <td className="px-4 py-2">{food.description}</td>
                                <td className="px-4 py-2">{food.price}</td>
                                <td className="px-4 py-2">{food.discount_price}</td>
                                <td className="px-4 py-2">{food.vat_price}%</td>
                                <td className="px-4 py-2">{food.stock_quantity}</td>
                                <td className="px-4 py-2">{moment(food.created_at).format("YYYY-MM-DD")}</td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => handleDelete(food.id)}
                                        className="bg-red-500 text-white px-3 py-1"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
