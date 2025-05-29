import { useState } from 'react';
import emailjs from 'emailjs-com';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css';

function Soporte() {
  const [formData, setFormData] = useState({
    reason: '',
    description: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const serviceID = 'service_ecgkkfs';
    const templateID = 'template_4zgc4sk';
    const userID = 'dyrybFuJrw0gUTdLO';

    emailjs.send(serviceID, templateID, formData, userID)
      .then(() => {
        toast.success('📧 Soporte enviado con éxito.');
        setFormData({ reason: '', description: '', email: '' });
      })
      .catch((error) => {
        console.error('Error al enviar el soporte:', error);
        toast.error('❌ Ocurrió un error al enviar el soporte.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="container my-5">
      <div className="card shadow-lg" style={{ borderRadius: '15px', overflow: 'hidden' }}>
        <div className="row g-0">
          <div className="col-md-6 d-flex align-items-center justify-content-center bg-primary text-white">
            <div className="text-center p-4 animate__animated animate__fadeInLeft">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3159/3159310.png"
                alt="Soporte"
                className="img-fluid mb-3"
                style={{ width: '150px' }}
              />
              <h3 className="fw-bold">¡Estamos aquí para ayudarte! 🛠️</h3>
              <p className="text-light">Completa el formulario para enviarnos tu consulta y te responderemos lo antes posible.</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card-body">
              <h4 className="card-title text-center text-primary fw-bold mb-4">📞 Centro de Soporte</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">📝 Razón del Soporte</label>
                  <input
                    type="text"
                    className="form-control"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="¿En qué podemos ayudarte?"
                    required
                    style={{ borderRadius: '8px' }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">📄 Descripción</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe tu situación"
                    required
                    style={{ borderRadius: '8px' }}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">📧 Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tucorreo@ejemplo.com"
                    required
                    style={{ borderRadius: '8px' }}
                  />
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-success w-100"
                    disabled={loading}
                    style={{ borderRadius: '8px', fontWeight: 'bold' }}
                  >
                    {loading ? '⏳ Enviando...' : '📤 Enviar Soporte'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Soporte;
