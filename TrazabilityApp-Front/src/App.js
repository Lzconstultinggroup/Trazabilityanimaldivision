// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CreateWorker from './components/CreateWorker';
import ChipHistory from './components/ChipHistory';
import InstallPrompt from './components/InstallPrompt'; // 👈 Agregalo acá

const App = () => {
  return (
    <Router>
      {/* 👇 El botón para instalar PWA estará siempre disponible */}
      <InstallPrompt />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-worker" element={<CreateWorker />} />
        <Route path="/historial/:uid" element={<ChipHistory />} />
      </Routes>
    </Router>
  );
};

export default App;
