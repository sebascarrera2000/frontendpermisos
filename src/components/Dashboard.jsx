import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import emailjs from 'emailjs-com';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [reason, setReason] = useState('');
  const [modalAction, setModalAction] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingAdmins, setLoadingAdmins] = useState(false);

  // Verificar autenticación
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Cargar permisos y clasificarlos
  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://sispermisosfacil.onrender.com/admin/requests', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });

      const allPermissions = response.data;

      const pendingPermissions = allPermissions.filter(
        (permission) => permission.status === 'Pendiente'
      );
      const classifiedResponses = allPermissions.filter(
        (permission) => permission.status === 'Aceptado' || permission.status === 'Denegado'
      );

      setPermissions(pendingPermissions);
      setResponses(classifiedResponses);
    } catch (error) {
      console.error('Error al cargar permisos:', error);
      toast.error('Error al cargar los permisos. ❌');
    } finally {
      setLoading(false);
    }
  };

  // Cargar administradores
  const fetchAdmins = async () => {
    setLoadingAdmins(true);
    try {
      const response = await axios.get('https://sispermisosfacil.onrender.com/admin/admins', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });

      setAdmins(response.data);
    } catch (error) {
      console.error('Error al cargar administradores:', error);
      toast.error('Error al cargar los administradores. ❌');
    } finally {
      setLoadingAdmins(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
    fetchAdmins();
  }, []);

  // Manejar acción de aceptar o denegar permisos
  const handleAction = async () => {
    if (!selectedPermission) return;

    try {
      // Actualizar permiso en el backend
      await axios.put(
        `https://sispermisosfacil.onrender.com/admin/requests/${selectedPermission._id}`,
        {
          status: modalAction,
          reason: reason || 'No se especificó ninguna razón.',
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        }
      );

      closeActionModal(); // Cierra el modal tras la acción
      toast.success(
        `Permiso ${modalAction.toLowerCase()} con éxito. 🟢 Estado actualizado.`
      );

      // Enviar correo con EmailJS
      try {
        const serviceID = 'service_ecgkkfs';
        const templateID = 'template_02eei2k';
        const userID = 'dyrybFuJrw0gUTdLO';

        const templateParams = {
          to_email: selectedPermission.institutionalEmail,
          to_name: selectedPermission.fullName,
          status: modalAction === 'Aceptado' ? '✅ Aceptado' : '❌ Denegado',
          reason: reason || 'No se especificó ninguna razón.',
        };

        await emailjs.send(serviceID, templateID, templateParams, userID);
        toast.info(`Correo enviado al solicitante. 📩`);
      } catch (emailError) {
        console.error('Error al enviar el correo:', emailError);
        toast.error('El permiso se actualizó, pero hubo un error al enviar el correo. ❌');
      }

      fetchPermissions();
    } catch (error) {
      console.error(`Error al ${modalAction} el permiso:`, error);
      toast.error(`Error al ${modalAction.toLowerCase()} el permiso. ❌`);
    }
  };

  // Cerrar modal manualmente
  const closeActionModal = () => {
    const modalElement = document.getElementById('actionModal');
    const modal = window.bootstrap.Modal.getInstance(modalElement);
    modal.hide(); // Usamos Bootstrap para cerrar correctamente el modal
  };

  // Abrir modal de acción
  const openActionModal = (permission, action) => {
    setSelectedPermission(permission);
    setModalAction(action);
    setReason('');
    const modalElement = document.getElementById('actionModal');
    const modal = new window.bootstrap.Modal(modalElement);
    modal.show();
  };

  // Abrir modal de detalles
  const openDetailsModal = (permission) => {
    setSelectedPermission(permission);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
  };

  // Eliminar administrador
  const handleDeleteAdmin = async (id) => {
    try {
      await axios.delete(`https://sispermisosfacil.onrender.com/admins/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      fetchAdmins();
      toast.success('Administrador eliminado con éxito. 🗑️');
    } catch (error) {
      console.error('Error al eliminar administrador:', error);
      toast.error('Error al eliminar el administrador. ❌');
    }
  };


  const isPdf = (url) => url.includes('cdn.filestackcontent.com');
  const isImage = (url) => url.includes('r2.fivemanage.com');


  return (
    <div className="container py-5">
      <h2 className="text-center text-primary mb-4">Dashboard de Administración</h2>
      <ToastContainer />
      <ul className="nav nav-tabs" id="dashboardTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="permissions-tab"
            data-bs-toggle="tab"
            data-bs-target="#permissions"
            type="button"
            role="tab"
            aria-controls="permissions"
            aria-selected="true"
          >
            Permisos Pendientes
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="responses-tab"
            data-bs-toggle="tab"
            data-bs-target="#responses"
            type="button"
            role="tab"
            aria-controls="responses"
            aria-selected="false"
          >
            Respuestas
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="admins-tab"
            data-bs-toggle="tab"
            data-bs-target="#admins"
            type="button"
            role="tab"
            aria-controls="admins"
            aria-selected="false"
          >
            Administradores
          </button>
        </li>
      </ul>
      <div className="tab-content" id="dashboardTabsContent">
        {/* Permisos Pendientes */}
        <div className="tab-pane fade show active" id="permissions" role="tabpanel">
          {loading ? (
            <div className="text-center my-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando permisos...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive mt-3">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Fechas Solicitado</th>
                    <th>Fechas Permiso</th>
                    <th>Nombre</th>
                    <th>Correo Institucional</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((permission, index) => (
                    <tr key={permission._id}>
                      <td>{index + 1}</td>
                      <td>{new Date(permission.timestamp).toLocaleDateString("es-ES")}</td>
                      <td>
                        {new Date(permission.startDate).toLocaleDateString("es-ES")}- 
                        {new Date(permission.endDate).toLocaleDateString("es-ES")}
                      </td>
                      
                      <td>{permission.fullName}</td>
                      <td>{permission.institutionalEmail}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => openDetailsModal(permission)}
                        >
                          Ver Detalles
                        </button>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => openActionModal(permission, 'Aceptado')}
                        >
                          Aceptar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => openActionModal(permission, 'Denegado')}
                        >
                          Denegar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Respuestas */}
        <div className="tab-pane fade" id="responses" role="tabpanel">
          <div className="table-responsive mt-3">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Fecha Permiso</th>
                  <th>Cedula</th>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Semestre</th>
                  <th>Razón</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((response, index) => (
                  <tr key={response._id}>
                    <td>{index + 1}</td>
                    <td>
                        {new Date(response.startDate).toLocaleDateString("es-ES")}- 
                        {new Date(response.endDate).toLocaleDateString("es-ES")}
                      </td>
                    <td>{response.studentId}</td>
                    <td>{response.fullName}</td>
                    <td>{response.status}</td>
                    <td>{response.semester}</td>
                    <td>{response.reason}</td>  
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Administradores */}
        <div className="tab-pane fade" id="admins" role="tabpanel">
          {loadingAdmins ? (
            <div className="text-center my-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando administradores...</span>
              </div>
            </div>
          ) : admins.length === 0 ? (
            <p className="text-center mt-3">No hay administradores registrados.</p>
          ) : (
            <div className="table-responsive mt-3">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Correo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin, index) => (
                    <tr key={admin._id}>
                      <td>{index + 1}</td>
                      <td>{admin.email}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteAdmin(admin._id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de acción */}
      <div className="modal fade" id="actionModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{modalAction} Permiso</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <textarea
                className="form-control"
                rows="3"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Escribe una razón"
              ></textarea>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button type="button" className="btn btn-primary" onClick={handleAction}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de detalles */}
      {showDetailsModal && selectedPermission && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalles del Permiso</h5>
                <button type="button" className="btn-close" onClick={closeDetailsModal}></button>
              </div>
              <div className="modal-body">
                <p><strong>Explicación Breve:</strong> {selectedPermission.briefExplanation}</p>
                <button
                  className={`btn ${selectedPermission.expirationStatus === 'En tiempo' ? 'btn-success' : 'btn-warning'}`}
                >
                  {selectedPermission.expirationStatus}
                </button>
                <h6 className="mt-3">Evidencia:</h6>
                {selectedPermission.evidence && isPdf(selectedPermission.evidence) ? (
                  <iframe
                    src={selectedPermission.evidence}
                    title="PDF Viewer"
                    width="100%"
                    height="400px"
                    style={{ border: 'none' }}
                  ></iframe>
                ) : isImage(selectedPermission.evidence) ? (
                  <img
                    src={selectedPermission.evidence}
                    alt="Evidencia"
                    style={{ width: '100%' }}
                  />
                ) : (
                  <p>No hay evidencia disponible.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
