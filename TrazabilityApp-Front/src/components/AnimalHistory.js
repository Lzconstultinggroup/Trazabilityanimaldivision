// src/components/AnimalHistory.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AnimalHistory = () => {
  const { uid } = useParams();
  const [animal, setAnimal] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`http://localhost:3000/api/animals/${uid}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnimal(res.data.animal);
      } catch (error) {
        alert('Error al obtener historial');
        console.error(error);
      }
    };
    fetchHistory();
  }, [uid]);

  return (
    <div>
      <h2>Historial del Animal: {uid}</h2>
      {animal ? (
        <pre>{JSON.stringify(animal, null, 2)}</pre>
      ) : (
        <p>Cargando historial...</p>
      )}
    </div>
  );
};

export default AnimalHistory;
