import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('authToken')); // Comprobar si hay un token en el almacenamiento local

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Eliminar el token de autenticación
    navigate('/login'); // Redirigir al login
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-primary">
      <div className="container">
        <Link className="navbar-brand text-white" to="/">
          SISPermisosFácil 🚀
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/formulario">
                Formulario
              </Link>
            </li>
            <li className="nav-item">
              {isLoggedIn ? (
                <Link className="nav-link text-white" to="/dashboard">
                  Dashboard
                </Link>
              ) : (
                <Link className="nav-link text-white" to="/login">
                  Sign In
                </Link>
              )}
            </li>
            {isLoggedIn && (
              <li className="nav-item">
                <button className="btn btn-outline-light ms-2" onClick={handleLogout}>
                  Sign Out
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
