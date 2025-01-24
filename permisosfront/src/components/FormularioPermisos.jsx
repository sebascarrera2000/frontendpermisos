
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FormularioPermisos() {
  const [formData, setFormData] = useState({
    fullName: '',
    institutionalEmail: '',
    pdfFile: '',
    evidenceImage: '',
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Manejar cambios en los campos de entrada
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // Subir PDF a Filestack
  const uploadPDFToFilestack = async (file) => {
    const API_KEY = 'AH590BxOTwqUPFM7simowz'; // Reemplaza con tu API Key de Filestack
    const formData = new FormData();
    formData.append('fileUpload', file);

    try {
      const response = await axios.post(`https://www.filestackapi.com/api/store/S3?key=${API_KEY}`, file, {
        headers: {
          'Content-Type': file.type,
        },
      });
      return response.data.url; // Retorna el enlace del archivo
    } catch (error) {
      console.error('Error al subir PDF a Filestack:', error);
      toast.error('❌ Error al subir el PDF. Intenta de nuevo.');
      throw new Error('Error al subir PDF');
    }
  };

  // Subir imagen a la nueva API
  const uploadImageToAPI = async (file) => {
    const API_KEY = 'MQwQOAH4mknTzVuQat66cHKyXeqGwrcI'; // Reemplaza con tu token de la API
    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'metadata',
      JSON.stringify({
        name: file.name,
        description: 'Evidencia del permiso',
      })
    );

    try {
      const response = await axios.post('https://api.fivemanage.com/api/image', formData, {
        headers: {
          Authorization: API_KEY,
        },
      });
      return response.data.url; // Retorna el enlace del archivo
    } catch (error) {
      console.error('Error al subir la imagen a la API:', error);
      toast.error('❌ Error al subir la imagen. Intenta de nuevo.');
      throw new Error('Error al subir imagen');
    }
  };

  // Manejo de subida de archivos
  const handleFileUpload = async (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (!file) return;

    setUploading(true);

    try {
      let url = '';

      // Usar la API correspondiente dependiendo del archivo
      if (name === 'pdfFile') {
        url = await uploadPDFToFilestack(file); // Subir PDF a Filestack
        setFormData((prev) => ({ ...prev, pdfFile: url }));
        toast.success('📄 PDF subido correctamente.');
      } else if (name === 'evidenceImage') {
        url = await uploadImageToAPI(file); // Subir imagen a la nueva API
        setFormData((prev) => ({ ...prev, evidenceImage: url }));
        toast.success('🖼️ Imagen subida correctamente.');
      }
    } catch (error) {
      toast.error('❌ Error al subir el archivo. Intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('https://sispermisosfacil.onrender.com/requests', formData);

      toast.success('✅ Formulario enviado exitosamente.');
      setFormData({
        fullName: '',
        institutionalEmail: '',
        pdfFile: '',
        evidenceImage: '',
      });
    } catch (error) {
      console.error(error);
      toast.error('❌ Ocurrió un error al enviar el formulario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f8ff',
      }}
    >
      {/* Contenedor del formulario */}
      <div
        className="container shadow-lg p-5"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          maxWidth: '900px',
        }}
      >
        <div className="row align-items-center">
          {/* Formulario */}
          <div className="col-md-7">
            <h2 className="text-primary mb-4" style={{ fontWeight: 'bold', animation: 'bounce 1s infinite' }}>
              📝 Solicita tu Permiso
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">👤 Nombre Completo</label>
                <input
                  type="text"
                  className="form-control input-animated"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Ingresa tu nombre completo"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">🏫 Correo Institucional</label>
                <input
                  type="email"
                  className="form-control input-animated"
                  name="institutionalEmail"
                  value={formData.institutionalEmail}
                  onChange={handleChange}
                  required
                  placeholder="Correo institucional (ej: usuario@umariana.edu.co)"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">📄 Formato Diligenciado (PDF)</label>
                <input
                  type="file"
                  className="form-control input-animated"
                  name="pdfFile"
                  onChange={handleFileUpload}
                  accept=".pdf"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">🖼️ Evidencia del Permiso (Imagen)</label>
                <input
                  type="file"
                  className="form-control input-animated"
                  name="evidenceImage"
                  onChange={handleFileUpload}
                  accept="image/*"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 btn-animated"
                disabled={loading || uploading}
                style={{
                  backgroundColor: '#4a90e2',
                  border: 'none',
                  padding: '10px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                {loading ? '⏳ Enviando...' : '🚀 Enviar'}
              </button>
            </form>
          </div>

          {/* Imagen lateral */}
          <div className="col-md-5 text-center d-none d-md-block">
            <img
              src="https://r2.fivemanage.com/kzc7UxO7zNX25M8FPK9d1/images/image-removebg-preview(5).png"
              alt="Formulario Ilustración"
              className="img-fluid"
              style={{ maxWidth: '100%', animation: 'fadeIn 1.5s' }}
            />
          </div>
        </div>
      </div>

      {/* Contenedor para notificaciones */}
      <ToastContainer />
    </div>
  );
}

export default FormularioPermisos;
