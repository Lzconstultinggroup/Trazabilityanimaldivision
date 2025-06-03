import React, { useEffect, useState } from 'react';
import CameraSetup from './Camera/CameraSetup';
import CameraViewer from './Camera/CameraViewer';

const CamerasSection = () => {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/api/cameras/my', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('No se pudieron obtener las cámaras.');
        }

        const data = await res.json();
        setCameras(data);
      } catch (err) {
        console.error('Error al obtener las cámaras:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCameras();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gestión de Cámaras IP</h2>
      <p>Agregá, iniciá y visualizá las cámaras IP conectadas en tu red.</p>

      <section style={{ marginBottom: '40px' }}>
        <CameraSetup />
      </section>

      <hr />

      <section style={{ marginTop: '40px' }}>
        {loading ? (
          <p>🔄 Cargando cámaras...</p>
        ) : cameras.length === 0 ? (
          <p>No hay cámaras registradas.</p>
        ) : (
          cameras.map((cam) => (
            <div key={cam._id} style={{ marginBottom: '30px' }}>
              <h4>{cam.name} — {cam.location || 'sin ubicación'}</h4>
              <CameraViewer streamKey={cam.streamKey} />
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default CamerasSection;
