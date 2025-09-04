import React from "react";
export default function DashboardBox({ title, value }) {
    return (
        <div className="p-4 bg-white shadow rounded text center hover:bg-blue-50">
            <h2 className="text-gray-800">{title}</h2>
            <p className="text-xl font-bold">{value}</p>
        </div>
    )
}