import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import checkHealthStatus from './checkHealthStatus'; // Importa la función

function HomePage() {
  const navigate = useNavigate();

   useEffect(() => {
    checkHealthStatus(); // Llama a la función cuando se monta el componente

    // Health check cada 20 minutos
    const interval = setInterval(checkHealthStatus, 1200000);

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
  }, []);

  const handleNavigate = () => navigate('/formulario');
  const handleNavigateNorm = () => navigate('/normativa');
  const handleNavigateSoporte = () => navigate('/soporte');

  return (
    <div
      className="home-page"
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f8ff',
        color: 'black',
        paddingTop: '50px',
        paddingBottom: '50px',
      }}
    >
      <div className="container text-center d-md-flex align-items-center justify-content-between">
        {/* Columna Izquierda */}
        <div className="text-md-start text-center">
          <h1 className="display-3" style={{ fontWeight: 'bold', color: '#12163c' }}>
            Sistema de permisos <span style={{ color: '#4a90e2' }}>Facil</span>
          </h1>
          <p className="lead" style={{ marginTop: '20px', color: 'black' }}>
            🎉 <strong>¡Bienvenido al sistema de permisos del programa de Ingeniería de Sistemas!</strong> 🎓  
            <br /><br />
            💻✨ Olvídate de venir hasta la sala de profesores para saber si tu permiso fue aceptado o denegado.  
            <br /><br />
            Ahora, recibirás una notificación 📩 directamente en tu correo.  
            <br /><br />
            ¡Rápido, fácil y sin complicaciones! 🚀  
            <br /><br />
            🙌 <strong>¡Simplificamos tu vida académica!</strong>
          </p>

          <button onClick={handleNavigate} className="btn btn-primary btn-lg mt-4" style={{ backgroundColor: '#4a90e2', border: 'none' }}>
            Solicita tu permiso 📥
          </button>
          <br />
          <button onClick={handleNavigateNorm} className="btn btn-primary btn-lg mt-4" style={{ backgroundColor: '#4a90e2', border: 'none' }}>
            Normativa 🧾
          </button>
          <br />
          <button onClick={handleNavigateSoporte} className="btn btn-primary btn-lg mt-4" style={{ backgroundColor: '#4a90e2', border: 'none' }}>
            Soporte 🧑‍💻
          </button>
        </div>

        {/* Imagen (Columna Derecha) */}
        <div className="mt-4 mt-md-0">
          <img
            src="https://r2.fivemanage.com/kzc7UxO7zNX25M8FPK9d1/images/image-removebg-preview(1).png"
            alt="Man with Laptop"
            className="img-fluid"
            style={{ maxWidth: '400px', borderRadius: '10px' }}
          />
        </div>
      </div>

      {/* Footer */}
      <footer
        className="mt-5"
        style={{
          backgroundColor: '#0D6EFD',
          padding: '5px',
          color: 'white',
        }}
      >
        <div className="container">
          <div className="text-center mt-4">
            <p className="mb-0">Desarrollado por © 2025 Juan Sebastian Carrera Bolaños. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
