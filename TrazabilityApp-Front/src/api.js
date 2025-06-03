// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});
const handleDataRead = async (data) => {
  console.log('Datos NFC leídos:', data);
  try {
    const token = localStorage.getItem('token');
    console.log('Enviando petición a /api/chips/register con UID:', data.serialNumber);
    const response = await api.post('/api/chips/register', { uid: data.serialNumber }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Respuesta del registro:', response.data);
    setStatus(response.data.message);
  } catch (error) {
    console.error('Error registrando chip:', error);
    setStatus('Error registrando chip');
  }
};

export default api;
