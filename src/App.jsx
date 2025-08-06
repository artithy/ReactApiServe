import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Registration from './components/Registration';
import './App.css';
import Login from './components/Login';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App;
