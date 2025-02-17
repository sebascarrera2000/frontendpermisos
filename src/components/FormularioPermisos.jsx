import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import emailjs from 'emailjs-com';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css';

function FormularioPermisos() {
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    institutionalEmail: '',
    semester: '',
    startDate: null,
    endDate: null,
    briefExplanation: '',
    evidence: ''
  });

  const [studentFound, setStudentFound] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const studentImageURL = "./persona.webp"; // Imagen de estudiante

  // Buscar estudiante por cédula
  const handleSearchStudent = async () => {
    if (!formData.studentId.trim()) {
      toast.error('❌ Debes ingresar un número de cédula.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`https://sispermisosfacil.onrender.com/students/cedula/${formData.studentId}`);
      const { name,last_name, email, semester } = response.data;
      setFormData({
        ...formData,
        fullName: `${name} ${last_name}`,
        institutionalEmail: email,
        semester
      });
      setStudentFound(true);
      toast.success(' 🚀 Estudiante encontrado. Revisa la información. ');
    } catch (error) {
      setStudentFound(false);
      toast.error('⚠️ Estudiante no encontrado. Si el error persiste, contacta soporte 🔧 .');
    } finally {
      setLoading(false);
    }
  };


  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Subir archivo y generar vista previa
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedFormats = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf'];
    if (!allowedFormats.includes(file.type)) {
      toast.error(' 📋 Formato no permitido. Solo se aceptan PNG, JPG, WEBP y PDF.');
      return;
    }

    setUploading(true);
    setPreview(null);

    try {
      let url = '';
      if (file.type === 'application/pdf') {
        url = await uploadPDFToFilestack(file);
        setPreview('https://cdn-icons-png.flaticon.com/512/337/337946.png'); // Icono para PDF
      } else {
        url = await uploadImageToFivemanage(file);
        setPreview(URL.createObjectURL(file)); // Vista previa para imágenes
      }

      setFormData({ ...formData, evidence: url });
      toast.success('📁 Archivo subido correctamente.');
    } catch (error) {
      toast.error('📝 Error al subir el archivo.');
    } finally {
      setUploading(false);
    }
  };

  const uploadPDFToFilestack = async (file) => {
    const API_KEY = 'AH590BxOTwqUPFM7simowz';
    const response = await axios.post(`https://www.filestackapi.com/api/store/S3?key=${API_KEY}`, file, {
      headers: { 'Content-Type': file.type }
    });
    return response.data.url;
  };

  const uploadImageToFivemanage = async (file) => {
    const API_KEY = 'MQwQOAH4mknTzVuQat66cHKyXeqGwrcI';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify({ name: file.name, description: 'Evidencia del permiso' }));

    const response = await axios.post('https://api.fivemanage.com/api/image', formData, {
      headers: { Authorization: API_KEY }
    });
    return response.data.url;
  };

  const sendConfirmationEmail = () => {
    const emailParams = {
      to_name: formData.fullName,
      to_email: formData.institutionalEmail,
      start_date: formData.startDate.toLocaleDateString(),
      end_date: formData.endDate.toLocaleDateString(),
      reason: formData.briefExplanation,
      status: "En revisión",
      status_color: "#ffc107",
      evidence_url: formData.evidence
    };
  
    emailjs.send('service_o7sv4cy', 'template_lyrmh9d', emailParams, 'JofbPOd0j3-L7EVS6')
      .then(() => {
        toast.success('📧 Te debio llegar un correo , verifica los datos.');
      })
      .catch(() => {
        toast.error('❌ Error al enviar el correo de confirmación.');
      });
  };
  

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.startDate || !formData.endDate || formData.endDate < formData.startDate) {
      toast.error('❌ Selecciona fechas válidas.');
      return;
    }
    if (!formData.briefExplanation.trim() || !formData.evidence) {
      toast.error('❌ Debes completar todos los campos y adjuntar evidencia.');
      return;
    }
    setLoading(true);
    try {

      await axios.post('https://sispermisosfacil.onrender.com/requests', formData);
      toast.success('✅ Formulario enviado exitosamente.');
      sendConfirmationEmail();
      setFormData({
        studentId: '',
        fullName: '',
        institutionalEmail: '',
        semester: '',
        startDate: null,
        endDate: null,
        briefExplanation: '',
        evidence: ''
      });
      setStudentFound(false);
      setPreview(null);
    } catch (error) {
      toast.error('❌ Ocurrió un error al enviar el formulario.');
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        
        {/* BARRA DE BÚSQUEDA */}
        <div className="col-md-10">
          <div className="card shadow-lg p-3 mb-4" style={{ borderRadius: '10px' }}>
            <div className="row align-items-center">
              <div className="col-md-8">
              <label className="form-label fw-bold">🔍 Número de Cédula</label>
                <input
                  type="text"
                  className="form-control"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="Ingrese el número de cédula"
                />
              </div>
              <div className="col-md-4 d-flex align-items-end">
                <button className={`btn ${loading ? 'btn-secondary' : 'btn-primary'} w-100`} onClick={handleSearchStudent} disabled={loading}>
                  {loading ? '⏳ Buscando...' : '🔍 Buscar'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* TARJETA DE IDENTIFICACIÓN DEL ESTUDIANTE */}
        {studentFound && (
          <div className="col-md-4">
            <div className="card text-center shadow-lg p-3 animate__animated animate__zoomIn" 
              style={{ borderRadius: '15px', background: '#e3f2fd', border: '3px solid #1976d2' }}>
              <img 
                src={studentImageURL}
                alt="Foto Estudiante" 
                className="img-fluid rounded-circle mx-auto d-block mt-3 animate__animated animate__pulse animate__infinite" 
                style={{ width: '120px', height: '120px' }} 
              />
              <h4 className="mt-3 text-primary fw-bold">{formData.fullName}</h4>
              <p className="text-muted">{formData.institutionalEmail}</p>
              <p className="fw-bold">📚 Semestre: <span className="text-primary">{formData.semester}</span></p>
            </div>
          </div>
        )}

        {/* CARTA DE SOLICITUD DE PERMISO */}
        {studentFound && (
          <div className="col-md-8">
            <div className="card shadow-lg p-4 animate__animated animate__fadeInRight" 
              style={{ borderRadius: '15px', background: '#ffffff', borderLeft: '5px solid #42a5f5' }}>
              <h2 className="text-primary text-center fw-bold">✉️ Solicitud de Permiso</h2>

              <div className="p-3 mt-3" style={{ backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
                <h5 className="text-primary">🗓 Fechas del Permiso</h5>
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">📅 Inicio : </label>
                    <DatePicker
                      selected={formData.startDate}
                      onChange={(date) => setFormData({ ...formData, startDate: date })}
                      className="form-control"
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Seleccione la fecha"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">📅 Final : </label>
                    <DatePicker
                      selected={formData.endDate}
                      onChange={(date) => setFormData({ ...formData, endDate: date })}
                      className="form-control"
                      dateFormat="dd/MM/yyyy"
                      minDate={formData.startDate}
                      placeholderText="Seleccione la fecha"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* CAMPO DE BREVE DESCRIPCIÓN */}
              <div className="p-3 mt-3" style={{ backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
                <h5 className="text-primary">📝 Breve Descripción</h5>
                <textarea
                  className="form-control"
                  name="briefExplanation"
                  value={formData.briefExplanation}
                  onChange={handleChange}
                  required
                  placeholder="Describe brevemente tu solicitud"
                />
              </div>

              {/* VISTA PREVIA DE LA EVIDENCIA */}
              <div className="p-3 mt-3" style={{ backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
                <h5 className="text-primary">📎 Evidencia Adjunta</h5>
                <input type="file" className="form-control" accept=".pdf,image/*" onChange={handleFileUpload} required />
                {preview && (
                  <div className="text-center mt-3">
                    <h5 className="text-primary animate__animated animate__flash">📌 Vista Previa</h5>
                    <img src={preview} alt="Vista previa" className="img-fluid rounded shadow-sm" style={{ maxWidth: '100px' }} />
                  </div>
                )}
              </div>

              {/* BOTÓN DE ENVÍO */}
              <div className="mt-4 text-center">
                <button type="submit" className="btn btn-success w-50" disabled={loading || uploading} onClick={handleSubmit}>
                  {loading ? '⏳ Enviando...' : '🚀 Enviar Solicitud'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
      <ToastContainer />
    </div>
  );
}

export default FormularioPermisos;
