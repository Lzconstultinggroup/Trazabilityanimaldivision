// src/components/MyWorkers.js
import React, { useEffect, useState } from 'react';
import api from '../api';
import '../styles/MyWorkers.css';

const MyWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/api/users/my-workers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Trabajadores recibidos:', response.data);
        setWorkers(response.data);
      } catch (err) {
        console.error('Error al obtener trabajadores:', err);
        setError('No se pudieron cargar los trabajadores.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  return (
    <div className="my-workers-container">
      <h2>Mis Trabajadores</h2>

      {loading && <p>Cargando trabajadores...</p>}
      {error && <p className="error">{error}</p>}

      <div className="workers-list">
        {workers.map((worker) => (
          <div key={worker._id} className="worker-card">
            <img
              src={worker.photo?.startsWith('http') ? worker.photo : `${process.env.REACT_APP_API_URL}/${worker.photo}`}
              alt={worker.fullName}
              className="worker-photo"
            />
            <div className="worker-info">
              <h4>{worker.fullName}</h4>
              <p><strong>Rol:</strong> {worker.role}</p>
              <p><strong>Email:</strong> {worker.email}</p>
              <p><strong>DNI:</strong> {worker.dni}</p>
              <p><strong>Teléfono:</strong> {worker.phoneNumber}</p>
            </div>
          </div>
        ))}
        {!loading && workers.length === 0 && (
          <p>No hay trabajadores registrados.</p>
        )}
      </div>
    </div>
  );
};

export default MyWorkers;
