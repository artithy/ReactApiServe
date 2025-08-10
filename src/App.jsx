import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Registration from './components/Registration';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import FoodMenu from './components/FoodMenu';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ToastContainer />
      <Routes>

        <Route path="/" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/menu" element={<FoodMenu />} />

      </Routes>
    </>
  )
}

export default App;
