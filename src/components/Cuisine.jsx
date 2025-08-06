import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Cuisine() {
    const [name, setName] = useState("");
    const [cuisines, setCuisines] = useState([]);
    const [id, setId] = useState(null);
    const token = localStorage.getItem("token");

    const fetchAllCuisines = async () => {
        try {
            const res = await axios.get("http://localhost:8000/get_cuisine.php");
            if (res.data.status) {
                setCuisines(res.data.data);
            } else {
                alert("Failed to load cuisines");
            }
        } catch {
            alert("Failed to load cuisines");
        }
    };

    const handleAddCuisine = async (e) => {
        e.preventDefault();
        if (!name) {
            alert("Please enter cuisine name");
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:8000/create_cuisine.php",
                { name },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(res.data.message);
            setName("");
            fetchAllCuisines();
        } catch {
            alert("Add failed");
        }
    };

    const handleEditClick = (editId, editName) => {
        setId(editId);
        setName(editName);
    };

    const handleUpdateCuisine = async (e) => {
        e.preventDefault();
        if (!name || !id) return;

        try {
            const res = await axios.post(
                "http://localhost:8000/update_cuisine.php",
                { id, name },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(res.data.message);
            setId(null);
            setName("");
            fetchAllCuisines();
        } catch {
            alert("Update failed");
        }
    };

    const handleDeleteCuisine = async (id) => {
        try {
            const res = await axios.post(
                "http://localhost:8000/delete_cuisine.php",
                { id: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(res.data.message);
            fetchAllCuisines();
        } catch {
            alert("Delete failed");
        }
    };


    useEffect(() => {
        fetchAllCuisines();
    }, []);

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
                {id ? "Update Cuisine" : "Add Cuisine"}
            </h2>

            <form
                onSubmit={id ? handleUpdateCuisine : handleAddCuisine}
                className="flex gap-4 mb-6"
            >
                <input
                    type="text"
                    placeholder="Cuisine name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 border border-gray-300 px-4 py-2 rounded"
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                >
                    {id ? "Update" : "Add"}
                </button>
                {id && (
                    <button
                        type="button"
                        onClick={() => {
                            setId(null);
                            setName("");
                        }}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded"
                    >
                        Cancel
                    </button>
                )}
            </form>

            <h3 className="text-xl font-semibold mb-2 text-gray-700">All Cuisines</h3>
            {cuisines.length === 0 ? (
                <p className="text-gray-500 text-center">No cuisines available.</p>
            ) : (
                <ul className="space-y-3">
                    {cuisines.map((cuisine) => (
                        <li
                            key={cuisine.id}
                            className="flex justify-between items-center bg-gray-100 px-4 py-3 rounded"
                        >
                            <span className="text-gray-800">{cuisine.name}</span>
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleEditClick(cuisine.id, cuisine.name)}
                                    className="text-yellow-600 hover:text-yellow-700"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteCuisine(cuisine.id)}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
