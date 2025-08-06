import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!email || !password) {
            setError("Please fill all fields.");
            return;
        }
        if (!email.includes("@") || !email.includes(".")) {
            setError("Please enter a valid email.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8000/login.php", {
                email,
                password,
            });

            if (response.data.status) {
                setSuccess(response.data.message);
                setEmail("");
                setPassword("");
                localStorage.setItem("token", response.data.token);
                navigate("/dashboard");
            } else {
                setError(response.data.message || "Login failed.");
            }
        } catch (err) {
            setError("Login failed. Please try again.");
            console.error(err);
        }
    };

    return (
        <section className="bg-gray-50 min-h-screen flex items-center justify-center px-6 py-8">
            <div className="w-full max-w-md bg-white rounded-lg shadow border p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-900">Login to your account</h1>

                {error && <p className="text-red-600 mb-4">{error}</p>}
                {success && <p className="text-green-600 mb-4">{success}</p>}

                <form className="space-y-4" onSubmit={handleSubmit}>
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
                            Your password
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

                    <div className="flex items-center mb-4">
                        <input
                            id="remember"
                            type="checkbox"
                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50"
                        />
                        <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                            Remember me
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition"
                    >
                        Submit
                    </button>
                </form>

                <p className="mt-4 text-center text-gray-600">
                    Don’t have an account?{" "}
                    <Link to="/" className="text-blue-600 hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </section>
    );
}
