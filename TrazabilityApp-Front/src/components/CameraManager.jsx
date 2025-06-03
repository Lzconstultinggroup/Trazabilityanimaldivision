// CameraManager.jsx - frontend completo para listar, agregar y eliminar cámaras

import React, { useEffect, useState } from 'react';

const CameraManager = () => {
  const [cameras, setCameras] = useState([]);
  const [form, setForm] = useState({ ip: '', name: '', location: '', streamKey: '' });
  const adminId = localStorage.getItem('adminId') || 'admin-default'; // simulación temporal

  const fetchCameras = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/cameras/my', {
        headers: { 'x-admin-id': adminId }
      });
      const data = await res.json();
      setCameras(data);
    } catch (err) {
      console.error('Error al obtener cámaras', err);
    }
  };

  const addCamera = async () => {
    if (!form.ip || !form.name || !form.streamKey) return alert('Faltan datos obligatorios');

    try {
      const res = await fetch('http://localhost:4000/api/cameras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...form, adminId })
      });

      if (res.status === 201) {
        alert('Cámara guardada');
        setForm({ ip: '', name: '', location: '', streamKey: '' });
        fetchCameras();
      } else {
        const err = await res.json();
        alert(err.error || 'Error al guardar');
      }
    } catch (err) {
      console.error('Error al agregar cámara', err);
    }
  };

  const deleteCamera = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/cameras/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-id': adminId }
      });
      const data = await res.json();
      if (data.deleted) {
        alert('Cámara eliminada');
        fetchCameras();
      } else {
        alert('No se pudo eliminar');
      }
    } catch (err) {
      console.error('Error al eliminar cámara', err);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>📷 Cámaras del administrador</h2>

      <div style={{ marginBottom: 20 }}>
        <input placeholder="IP" value={form.ip} onChange={e => setForm({ ...form, ip: e.target.value })} />
        <input placeholder="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Ubicación" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
        <input placeholder="StreamKey" value={form.streamKey} onChange={e => setForm({ ...form, streamKey: e.target.value })} />
        <button onClick={addCamera}>➕ Guardar cámara</button>
      </div>

      <ul>
        {cameras.map((cam) => (
          <li key={cam._id}>
            <b>{cam.name}</b> - {cam.ip} ({cam.location || 'sin ubicación'})
            <button onClick={() => deleteCamera(cam._id)} style={{ marginLeft: 10 }}>🗑 Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CameraManager;
// Este componente permite a los administradores gestionar cámaras IP, incluyendo agregar y eliminar cámaras de su lista.
// Se utiliza un estado local para almacenar la lista de cámaras y el formulario de entrada.
// Se realizan solicitudes a un backend para obtener, agregar y eliminar cámaras.
// El componente también maneja la validación de datos y muestra mensajes de error o éxito según corresponda.
// Asegúrate de que el backend esté corriendo y que la URL de la API sea correcta.