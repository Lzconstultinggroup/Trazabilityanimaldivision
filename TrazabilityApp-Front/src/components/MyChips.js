// src/components/MyChips.js
import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles/MyChips.css';

const MyChips = () => {
  const [chips, setChips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChips = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/api/chips', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChips(response.data);
      } catch (error) {
        console.error('Error al obtener chips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChips();
  }, []);

  return (
    <div className="chip-list-container">
      <h2>Chips Registrados</h2>
      {loading ? (
        <p>Cargando chips...</p>
      ) : chips.length === 0 ? (
        <p>No hay chips registrados.</p>
      ) : (
        <div className="chip-grid">
          {chips.map((chip) => (
            <div
              className="chip-card"
              key={chip._id}
              onClick={() => navigate(`/historial/${chip.uid}`)}
            >
              <h4>{chip.name || `Chip ${chip.uid}`}</h4>
              <p>UID: {chip.uid}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyChips;
