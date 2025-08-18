import React from 'react';

export default function Drawer({ isOpen, onClose, cartItemsCount, children }) {
    return (
        <div className="h-full w-full relative bg-white p-0 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-bold">Your Cart ({cartItemsCount})</h2>
                <button
                    onClick={onClose}
                    className="text-red-600 font-bold px-2 py-1 border border-red-600 rounded hover:bg-red-100"
                >
                    close
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {children}
            </div>
        </div>
    );
}
