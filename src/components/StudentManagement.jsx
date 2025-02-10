import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: '',
    last_name: '',
    email: '',
    semester: '',
    studentId: '',
  });

  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchStudentId, setSearchStudentId] = useState('');
  const [activeSemester, setActiveSemester] = useState('1');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      window.location.href = '/login';
    } else {
      fetchStudents();
    }
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://sispermisosfacil.onrender.com/students', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });

      const sortedStudents = response.data
        .filter(student => student.studentId)
        .sort((a, b) => a.studentId.localeCompare(b.studentId));

      setStudents(sortedStudents);

      const semesters = [...new Set(sortedStudents.map(student => student.semester))].sort((a, b) => parseInt(a) - parseInt(b));
      const initialSemester = semesters.includes('1') ? '1' : semesters[0] || 'Todos';
      setActiveSemester(initialSemester);
      filterBySemester(initialSemester);

      toast.success('Estudiantes cargados correctamente. ✅');
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
      toast.error('Error al cargar los estudiantes. ❌');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const handleSearchByStudentId = () => {
    if (searchStudentId.trim() === '') {
      filterBySemester(activeSemester);
    } else {
      const filtered = students.filter(student => 
        student.studentId.toLowerCase().includes(searchStudentId.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  };

  const filterBySemester = (semester) => {
    setActiveSemester(semester);
    if (semester === 'Todos') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student => student.semester === semester);
      setFilteredStudents(filtered);
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
        const studentData = {
            name: `${newStudent.name} ${newStudent.last_name}`, // Unimos nombre y apellido
            email: newStudent.email,
            semester: newStudent.semester,
            studentId: newStudent.studentId,
          };
      await axios.post('https://sispermisosfacil.onrender.com/students', studentData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      toast.success('Estudiante creado correctamente. 🎉');
      setNewStudent({ name: '', last_name: '', email: '', semester: '', studentId: '' });
      fetchStudents();
    } catch (error) {
      console.error('Error al crear estudiante:', error);
      toast.error('Error al crear el estudiante. ❌');
    }
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();
    try {
        const studentData = {
            name: `${newStudent.name} ${newStudent.last_name}`, // Unimos nombre y apellido
            email: newStudent.email,
            semester: newStudent.semester,
            studentId: newStudent.studentId,
          };
      await axios.put(`https://sispermisosfacil.onrender.com/students/${editingStudent._id}`, studentData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      toast.success('Estudiante editado correctamente. ✏️');
      setEditingStudent(null);
      setNewStudent({ name: '', last_name: '', email: '', semester: '', studentId: '' });
      fetchStudents();
    } catch (error) {
      console.error('Error al editar estudiante:', error);
      toast.error('Error al editar el estudiante. ❌');
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este estudiante?')) return;

    try {
      await axios.delete(`https://sispermisosfacil.onrender.com/students/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      toast.success('Estudiante eliminado correctamente. 🗑️');
      fetchStudents();
    } catch (error) {
      console.error('Error al eliminar estudiante:', error);
      toast.error('Error al eliminar el estudiante. ❌');
    }
  };

  const semesters = [...new Set(students.map(student => student.semester))]
    .filter(semester => semester)
    .sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary mb-4">Gestión de Estudiantes</h2>
      <ToastContainer />

      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar estudiante por cedula..."
          value={searchStudentId}
          onChange={(e) => setSearchStudentId(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearchByStudentId}>
          🔍 Buscar
        </button>
      </div>

      <ul className="nav nav-tabs">
        {semesters.map(semester => (
          <li className="nav-item" key={semester}>
            <button
              className={`nav-link ${activeSemester === semester ? 'active' : ''}`}
              onClick={() => filterBySemester(semester)}
            >
              Semestre {semester}
            </button>
          </li>
        ))}
        <li className="nav-item">
          <button
            className={`nav-link ${activeSemester === 'Todos' ? 'active' : ''}`}
            onClick={() => filterBySemester('Todos')}
          >
            Todos
          </button>
        </li>
      </ul>

      <div className="table-responsive mt-3">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Cedula</th>
              <th>Nombre Completo</th>
              <th>Correo</th>
              <th>Semestre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={student._id}>
                <td>{index + 1}</td>
                <td>{student.studentId || 'N/A'}</td>
                <td>{student.name} {student.last_name}</td>
                <td>{student.email}</td>
                <td>{student.semester}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setEditingStudent(student);
                      setNewStudent(student);
                    }}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteStudent(student._id)}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form className="mt-4" onSubmit={editingStudent ? handleEditStudent : handleCreateStudent}>
        <h4>{editingStudent ? 'Editar Estudiante' : 'Agregar Estudiante'}</h4>
        <div className="row">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control mb-3"
              name="name"
              value={newStudent.name}
              onChange={handleChange}
              placeholder="Nombre"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control mb-3"
              name="last_name"
              value={newStudent.last_name}
              onChange={handleChange}
              placeholder="Apellido"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="email"
              className="form-control mb-3"
              name="email"
              value={newStudent.email}
              onChange={handleChange}
              placeholder="Correo Institucional"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control mb-3"
              name="semester"
              value={newStudent.semester}
              onChange={handleChange}
              placeholder="Semestre"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control mb-3"
              name="studentId"
              value={newStudent.studentId}
              onChange={handleChange}
              placeholder="Cedula"
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          {editingStudent ? 'Guardar Cambios' : 'Crear Estudiante'}
        </button>
      </form>
    </div>
  );
}

export default StudentManagement;
