import axios from 'axios';

async function checkHealthStatus() {
  const healthCheck = async (retry = false) => {
    try {
      const response = await axios.get('https://sispermisosfacil.onrender.com/students/health');
      console.log('✅ Servidor disponible');
    } catch (error) {
      if (retry) {
        console.error('❌ Error después de reintento: El servidor no está disponible.');
      } else {
        console.warn('⚠️ Primer intento fallido. Reintentando en 50 segundos...');
        setTimeout(() => healthCheck(true), 50000); // Reintentar después de 50 segundos
      }
    }
  };

  // Llamada inicial
  healthCheck();
}

export default checkHealthStatus;
