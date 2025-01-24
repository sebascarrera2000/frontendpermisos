import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import FormularioPermisos from './components/FormularioPermisos';
import Login from './components/login';
import Dashboard from './components/Dashboard'; // Si ya tienes el Dashboard

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/formulario" element={<FormularioPermisos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Página protegida */}
      </Routes>
    </Router>
  );
}

export default App;
