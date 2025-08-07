import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddFood() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [discountPrice, setDiscountPrice] = useState("");
    const [vatPrice, setVatPrice] = useState("");
    const [stockQuantity, setStockQuantity] = useState("");
    const [image, setImage] = useState("");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("active");
    const [cuisineId, setCuisineId] = useState("");
    const [cuisines, setCuisines] = useState([]);

    useEffect(() => {
        const fetchCuisines = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:8000/get_cuisine.php", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCuisines(response.data.data);
            } catch (error) {
                console.error("Failed to fetch cuisines:", error);
                setCuisines([]);
            }
        };

        fetchCuisines();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !name ||
            !price ||
            !discountPrice ||
            !vatPrice ||
            !stockQuantity ||
            !cuisineId ||
            !image
        ) {
            toast.error("Please fill all required fields.");
            return;
        }

        const data = {
            name,
            description,
            price,
            discount_price: discountPrice,
            vat_price: vatPrice,
            stock_quantity: stockQuantity,
            image,
            date,
            status,
            cuisine_id: cuisineId,
        };

        try {
            const token = localStorage.getItem("token");

            const res = await axios.post("http://localhost:8000/create_food.php", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            toast.success(res.data.message || "Food added successfully.");

            setName("");
            setDescription("");
            setPrice("");
            setDiscountPrice("");
            setVatPrice("");
            setStockQuantity("");
            setImage("");
            setDate("");
            setStatus("active");
            setCuisineId("");
        } catch (error) {
            console.error("Food creation failed:", error);
            toast.error("Food creation failed.");
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-12">
            <h2 className="text-3xl font-semibold text-center mb-8 text-blue-700">Add New Food</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <input
                    type="text"
                    placeholder="Food Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />

                <select
                    value={cuisineId}
                    onChange={(e) => setCuisineId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                    <option value="">Select Cuisine</option>
                    {cuisines.map((cuisine) => (
                        <option key={cuisine.id} value={cuisine.id}>
                            {cuisine.name}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />

                <input
                    type="number"
                    placeholder="Discount Price"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />

                <input
                    type="number"
                    placeholder="VAT Price"
                    value={vatPrice}
                    onChange={(e) => setVatPrice(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />

                <input
                    type="number"
                    placeholder="Stock Quantity"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />

                <input
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                />

                <input
                    type="text"
                    placeholder="Date (optional)"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
                >
                    Add Food
                </button>
            </form>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                style={{ zIndex: 99999 }}
            />
        </div>
    );
}
