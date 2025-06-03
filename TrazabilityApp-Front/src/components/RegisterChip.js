// src/components/RegisterChip.js
import React, { useState, useEffect } from 'react';
import api from '../api';
import '../styles/RegisterChip.css';

const RegisterChip = () => {
  const [uid, setUid] = useState('');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [lotes, setLotes] = useState([]);
  const [selectedLote, setSelectedLote] = useState('');

  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/api/lotes/abiertos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLotes(res.data);
      } catch (err) {
        console.error('Error al cargar lotes:', err);
        setError('No se pudieron cargar los lotes disponibles.');
      }
    };

    fetchLotes();
  }, []);

  const startNFCScan = async () => {
    if (!('NDEFReader' in window)) {
      setError('Web NFC no es compatible con este dispositivo.');
      return;
    }

    try {
      const ndef = new NDEFReader();
      setScanning(true);
      setError(null);
      setMessage(null);

      await ndef.scan();

      ndef.onreading = (event) => {
        const { serialNumber } = event;
        console.log('UID leído:', serialNumber);
        setUid(serialNumber);
        setScanning(false);
      };

      ndef.onreadingerror = () => {
        setError('Error al leer la etiqueta NFC.');
        setScanning(false);
      };
    } catch (err) {
      setError(`Error iniciando escaneo: ${err.message}`);
      setScanning(false);
    }
  };

  const handleRegister = async () => {
    if (!uid) return setError('Debes escanear un chip primero.');
    if (!selectedLote) return setError('Seleccioná un lote antes de registrar.');

    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        '/api/chips/register',
        { uid, loteId: selectedLote },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(`✅ ${response.data.name} registrado correctamente`);
      setError(null);
      setUid('');
      setSelectedLote('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar el chip');
      setMessage(null);
    }
  };

  return (
    <div className="register-chip-container">
      <h2>Registrar Chip NFC</h2>

      <div className="scan-section">
        <button onClick={startNFCScan} disabled={scanning}>
          {scanning ? 'Escaneando...' : 'Escanear Chip'}
        </button>

        {scanning && <div className="scanning-animation">📶 Buscando chip NFC...</div>}

        {uid && (
          <div className="chip-info">
            <p><strong>UID Detectado:</strong> {uid}</p>

            <label>Seleccioná un lote:</label>
            <select
              value={selectedLote}
              onChange={(e) => setSelectedLote(e.target.value)}
              required
            >
              <option value="">-- Elegí un lote --</option>
              {lotes.map((lote) => (
                <option key={lote._id} value={lote._id}>
                  {lote.name} - {lote.mesDespacho} ({lote.maxVacas} vacas)
                </option>
              ))}
            </select>

            <button onClick={handleRegister}>Registrar Chip</button>
          </div>
        )}

        {!scanning && !uid && (
          <p className="waiting-text">Esperando escaneo...</p>
        )}

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
      </div>
    </div>
  );
};

export default RegisterChip;
