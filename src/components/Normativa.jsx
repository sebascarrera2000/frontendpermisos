import React from 'react';

function Normativa() {
  const pdfURL = "Lineamiento para Permisos Académicos.pdf"; // Reemplázalo por tu URL de PDF

  return (
    <div className="container my-5">
      <h2 className="text-center text-primary mb-4">📜 Normativas y Lineamientos</h2>
      <div className="card shadow-lg" style={{ borderRadius: '15px' }}>
        <div className="card-body">
          <h4 className="card-title text-center text-secondary">
            📚 Reglas y Normativas
          </h4>
          <p className="card-text text-muted text-center">
            Consulta el documento oficial con las normativas y lineamientos aplicables:
          </p>
          <div className="text-center">
            <iframe
              src={pdfURL}
              title="Normativa PDF"
              width="100%"
              height="600px"
              style={{ border: 'none', borderRadius: '10px' }}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Normativa;
