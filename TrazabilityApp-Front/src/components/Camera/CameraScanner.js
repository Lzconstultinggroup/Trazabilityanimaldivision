import React, { useState } from 'react';

const CameraScanner = ({ onSelect }) => {
  const [subnet, setSubnet] = useState('192.168.1.0/24');
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  const scanNetwork = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4050/scan-network?subnet=${subnet}`);
      const data = await res.json();
      setDevices(data.devices || []);
    } catch (err) {
      console.error('Error escaneando red:', err);
      alert('No se pudo escanear la red.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Escanear red local</h3>
      <input
        type="text"
        value={subnet}
        onChange={(e) => setSubnet(e.target.value)}
        placeholder="Subred ej: 192.168.0.0/24"
        style={{ padding: '8px', marginRight: '10px' }}
      />
      <button onClick={scanNetwork} disabled={loading}>
        {loading ? 'Escaneando...' : 'Buscar dispositivos'}
      </button>

      {devices.length > 0 && (
        <ul style={{ marginTop: '15px' }}>
          {devices.map((dev, i) => (
            <li key={i} style={{ marginBottom: '10px' }}>
              <strong>{dev.ip}</strong> ({dev.mac})
              <button onClick={() => onSelect(dev.ip)} style={{ marginLeft: '10px' }}>
                Usar esta IP
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CameraScanner;
