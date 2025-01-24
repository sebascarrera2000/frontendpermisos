import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('https://sispermisosfacil.onrender.com/admin/login', credentials);
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setMessage('Credenciales inválidas. Por favor, inténtalo de nuevo.');
      } else {
        setMessage('Ocurrió un error. Por favor, inténtalo más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f8ff',
      }}
    >
      <div
        className="shadow-lg rounded d-flex"
        style={{
          backgroundColor: '#ffffff',
          maxWidth: '900px',
          width: '100%',
          overflow: 'hidden',
          borderRadius: '10px',
        }}
      >
        {/* Lado izquierdo con imagen */}
        <div
          className="p-4 d-none d-md-flex align-items-center justify-content-center"
          style={{
            flex: '1',
            backgroundColor: '#007bff',
            color: '#ffffff',
          }}
        >
          <div className="text-center">
            <h2 className="mb-3" style={{ fontWeight: 'bold' }}>
              ¡Hola administrador!
            </h2>
            <p style={{ lineHeight: '1.6' }}>
              Administra tus permisos de forma rápida y sencilla. Por favor, inicia sesión para continuar.
            </p>
          </div>
        </div>

        {/* Lado derecho con formulario */}
        <div
          className="p-4"
          style={{
            flex: '1.5',
          }}
        >
          <h3 className="text-primary text-center mb-4" style={{ fontWeight: 'bold' }}>
            Inicio de Sesión
          </h3>
          {message && (
            <div
              className={`alert ${message.includes('inválidas') ? 'alert-danger' : 'alert-success'}`}
              role="alert"
            >
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">📧 Correo Electrónico</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="usuario@umariana.edu.co"
                required
                style={{
                  borderRadius: '25px',
                  padding: '10px 15px',
                }}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">🔒 Contraseña</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Ingrese su contraseña"
                required
                style={{
                  borderRadius: '25px',
                  padding: '10px 15px',
                }}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 mt-3"
              disabled={loading}
              style={{
                borderRadius: '25px',
                padding: '10px 15px',
                fontWeight: 'bold',
                backgroundColor: '#007bff',
                border: 'none',
              }}
            >
              {loading ? '⏳ Iniciando sesión...' : '🚀 Iniciar Sesión'}
            </button>
          </form>
          <div className="text-center mt-4">
            <p className="text-secondary" style={{ fontSize: '14px' }}>
     Sistema de gestion de permisos (Unicamente Admin)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
