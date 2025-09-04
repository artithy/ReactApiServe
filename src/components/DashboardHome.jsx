import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardBox from "./DashboardBox";
import { Chart } from "primereact/chart";


export default function DashboardHome() {
    const [summary, setSummary] = useState({});
    const [ordersByDays, setOrdersByDays] = useState({ labels: [], data: [] });
    const [ordersByHours, setOrdersByHours] = useState({ labels: [], data: [] });

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem("token");
            const summaryRes = await axios.get("http://localhost:8000/dashboard-summary.php", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSummary({

                today_orders: summaryRes.data.todays_orders,
                pending_delivery: summaryRes.data.pending_delivery,
                total_payments: summaryRes.data.total_payments,
                total_completed_orders: summaryRes.data.total_completed_orders,

            });

            const daysRes = await axios.get("http://localhost:8000/orders_by_days.php");
            setOrdersByDays(daysRes.data);

            const hoursRes = await axios.get("http://localhost:8000/orders_by_hours.php");
            setOrdersByHours(hoursRes.data);
        } catch (error) {
            console.error("Error fetching dashboard summary:", error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-15 mt-10">
                <DashboardBox title="Order Today" value={summary.today_orders || 0} />
                <DashboardBox title="Pending Delivery" value={summary.pending_delivery || 0} />
                <DashboardBox title="Payments Today" value={summary.total_payments || 0} />
                <DashboardBox title="Completed Orders" value={summary.total_completed_orders || 0} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white shadow rounded ">
                    <h3>Orders by days</h3>
                    <Chart
                        type="bar"
                        data={{
                            labels: ordersByDays.labels,
                            datasets: [{
                                label: 'Orders', data: ordersByDays.data, backgroundColor: '#6366F1'
                            }]
                        }}
                        options={{ responsive: true }}
                    />

                </div>

                <div className="p-4 bg-white shadow rounded ">
                    <h3>Orders by hours</h3>
                    <Chart
                        type="line"
                        data={{
                            labels: ordersByHours.labels,
                            datasets: [{
                                label: 'Orders', data: ordersByHours.data, backgroundColor: '#10B981', fill: false
                            }]
                        }}
                        options={{ responsive: true }}
                    />

                </div>
            </div>
        </div>
    )
}