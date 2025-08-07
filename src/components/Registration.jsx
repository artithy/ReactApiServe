import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function SignupForm() {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userName || !email || !password || !confirmPassword) {
            toast.error("Please fill all fields.");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        if (!email.includes("@") || !email.includes(".")) {
            toast.error("Please enter a valid email.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8000/signup.php", {
                user_name: userName,
                email,
                password,
            });

            if (response.data.status && response.data.token) {
                toast.success(response.data.message);
                setUserName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");

                localStorage.setItem("token", response.data.token);
                setTimeout(() => {
                    navigate("/dashboard");
                }, 2000);
            } else {
                toast.error(response.data.message || "Signup failed.");
            }
        } catch (err) {
            toast.error("Signup failed. Please try again.");
            console.error(err);
        }
    };

    return (
        <section className="bg-gray-50 min-h-screen flex items-center justify-center px-6 py-8">
            <div className="w-full max-w-md bg-white rounded-lg shadow border p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-900">Create an account</h1>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="user_name" className="block mb-2 text-sm font-medium text-gray-900">
                            Your name
                        </label>
                        <input
                            type="text"
                            id="user_name"
                            className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 w-full text-gray-900"
                            placeholder="Your name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                            Your email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 w-full text-gray-900"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 w-full text-gray-900"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900">
                            Confirm password
                        </label>
                        <input
                            type="password"
                            id="confirm-password"
                            className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 w-full text-gray-900"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex items-center mb-4">
                        <input
                            id="terms"
                            type="checkbox"
                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50"
                            required
                        />
                        <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                            I accept the{" "}
                            <a href="#" className="text-blue-600 hover:underline">
                                Terms and Conditions
                            </a>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition"
                    >
                        Create an account
                    </button>
                </form>

                <p className="mt-4 text-center text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login here
                    </Link>
                </p>
            </div>

            <ToastContainer position="top-right" autoClose={3000} />
        </section>
    );
}
