import React from "react";

export default function Drawer({ isOpen, onClose, children }) {
    return (
        <>
            <div
                className={`fixed inset-0 bg-gray-800 transition-opacity duration-300 z-40 ${isOpen ? "opacity-20 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            ></div>

            <div
                className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 flex flex-col z-50 ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">Your Cart</h2>
                    <button
                        onClick={onClose}
                        className="text-red-600 font-bold px-2 py-1 border border-red-600 rounded hover:bg-red-100"
                    >
                        Close
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">{children}</div>
            </div>
        </>
    );
}
