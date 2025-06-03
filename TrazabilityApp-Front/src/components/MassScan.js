import React, { useState } from 'react';
import api from '../api';
import '../styles/MassScan.css';

const MassScan = () => {
  const [uids, setUids] = useState([]);
  const [eventType, setEventType] = useState('');
  const [description, setDescription] = useState('');
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState('');
  const [errorUIDs, setErrorUIDs] = useState([]);

  const handleScan = async () => {
    if (!('NDEFReader' in window)) {
      return alert('Web NFC no es compatible con este dispositivo.');
    }

    try {
      const ndef = new NDEFReader();
      setScanning(true);
      await ndef.scan();

      ndef.onreading = async (event) => {
        const serial = event.serialNumber;

        if (uids.length >= 5) {
          alert('Máximo de 5 chips alcanzado');
          setScanning(false);
          return;
        }

        if (uids.includes(serial)) {
          alert('Este chip ya fue escaneado');
          setScanning(false);
          return;
        }

        try {
          const token = localStorage.getItem('token');
          const response = await api.post(
            '/api/chips/validate',
            { uid: serial },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          // ✅ Chip válido, se agrega
          setUids((prev) => [...prev, serial]);
          setMessage(`✅ Chip ${serial} registrado correctamente`);
        } catch (error) {
          console.error('Chip no registrado:', serial);
          setErrorUIDs((prev) => [...prev, serial]);
          setMessage(`❌ El chip ${serial} no está registrado`);
        } finally {
          setScanning(false);
        }
      };

      ndef.onreadingerror = () => {
        alert('Error al leer el chip');
        setScanning(false);
      };
    } catch (err) {
      console.error('Error NFC:', err);
      alert('Error al iniciar escaneo');
      setScanning(false);
    }
  };

  const handleMint = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        '/api/nft/mint-batch',
        { uids, eventType, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(`✅ ${response.data.message} (${response.data.count} chips)`);
      setUids([]);
      setEventType('');
      setDescription('');
      setErrorUIDs([]);
    } catch (err) {
      console.error('Error al mintear lote:', err);

      if (err.response?.data?.unregistered?.length > 0) {
        setErrorUIDs(err.response.data.unregistered);
        setMessage(`❌ Chips no registrados: ${err.response.data.unregistered.join(', ')}`);
      } else {
        setMessage('❌ Error general al mintear eventos');
      }
    }
  };

  return (
    <div className="mass-scan-container">
      <h3>Escaneo Masivo</h3>
      <button onClick={handleScan} disabled={scanning || uids.length >= 5}>
        {scanning ? 'Escaneando...' : 'Escanear Chip'}
      </button>

      <ul>
        {uids.map((uid, idx) => (
          <li key={idx}>
            Chip {idx + 1}: {uid}
            {errorUIDs.includes(uid) && <span style={{ color: 'red', fontWeight: 'bold' }}> ❌</span>}
          </li>
        ))}
      </ul>

      <label>Tipo de Evento:</label>
      <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
        <option value="">Selecciona...</option>
        <option value="Entrada al feed lot">Entrada al feed lot</option>
        <option value="Salida del feed lot">Salida del feed lot</option>
        <option value="Pastura">Pastura</option>
        <option value="Ordeñado">Ordeñado</option>
        <option value="Fin del día">Fin del día</option>
      </select>

      <label>Descripción (opcional):</label>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Ej: Entrada grupal al mediodía"
      />

      <button onClick={handleMint} disabled={uids.length === 0 || !eventType}>
        Mintear Evento en Lote
      </button>

      {message && <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
};

export default MassScan;
