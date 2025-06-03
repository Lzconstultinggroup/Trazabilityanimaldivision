import React, { useState, useRef, useEffect } from 'react';

const CameraSetup = ({ onSaved }) => {
  const [devices, setDevices] = useState([]);
  const [selectedIp, setSelectedIp] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [streamKey, setStreamKey] = useState('');
  const [isThermal, setIsThermal] = useState(false);
  const canvasRef = useRef(null);
  const playerRef = useRef(null);

  const scanNetwork = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4050/scan-network`);
      const data = await res.json();
      setDevices(data.devices || []);
    } catch (err) {
      console.error('Error escaneando red:', err);
      alert('No se pudo escanear la red.');
    }
    setLoading(false);
  };

  const handleStartStream = async () => {
    if (!selectedIp || !password) {
      return alert('Seleccioná una IP y escribí la contraseña.');
    }

    if (typeof window.JSMpeg === 'undefined') {
      alert('❌ No se cargó JSMpeg. Verificá que el script esté en el index.html');
      return;
    }

    const key = `cam-${Date.now()}`;
    setStreamKey(key);

    try {
      const res = await fetch('http://localhost:4000/start-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ip: selectedIp,
          user: 'admin',
          password,
          streamKey: key,
          extraParams: '/cam/realmonitor?channel=1&subtype=0&proto=Onvif'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        return alert(`Error al iniciar stream: ${data.error}`);
      }

      const canvas = canvasRef.current;
      const wsUrl = `ws://localhost:9999/?streamKey=${key}`;

      const player = new window.JSMpeg.Player(wsUrl, {
        canvas: canvas,
        autoplay: true,
        audio: false,
        loop: true,
      });

      playerRef.current = player;
      setStep(2);
    } catch (err) {
      console.error('Error al iniciar stream:', err);
      alert('Error al iniciar la cámara.');
    }
  };

  const handleSave = async () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const finalStreamKey = streamKey || localStorage.getItem('streamKey');

    if (!userData?._id || !selectedIp || !name || !finalStreamKey) {
      return alert('Faltan campos requeridos para guardar la cámara.');
    }

    try {
      const res = await fetch('http://localhost:4000/api/cameras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-admin-id': userData._id
        },
        body: JSON.stringify({
          adminId: userData._id,
          ip: selectedIp,
          name,
          location,
          streamKey: finalStreamKey,
          password,
          isThermal
        })
      });

      if (!res.ok) {
        const msg = await res.json();
        return alert(`Error al guardar cámara: ${msg.error}`);
      }

      alert('✅ Cámara registrada correctamente.');
      onSaved?.();
    } catch (err) {
      console.error('❌ Error al registrar cámara:', err);
      alert('Ocurrió un error inesperado al guardar la cámara.');
    }
  };

  return (
    <div>
      <h3>Registro de Cámaras</h3>

      {step === 1 && (
        <>
          <button onClick={scanNetwork} disabled={loading}>
            {loading ? 'Escaneando...' : 'Escanear red'}
          </button>

          {devices.length > 0 && (
            <div>
              <label>Seleccioná una IP:</label>
              <select value={selectedIp} onChange={(e) => setSelectedIp(e.target.value)}>
                <option value="">-- Elegí una IP --</option>
                {devices.map((dev, idx) => (
                  <option key={idx} value={dev.ip}>
                    {dev.ip} {dev.mac && dev.mac !== 'Desconocido' ? `(${dev.mac})` : ''}
                  </option>
                ))}
              </select>

              <label>Contraseña de la cámara:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>
                <input
                  type="checkbox"
                  checked={isThermal}
                  onChange={(e) => setIsThermal(e.target.checked)}
                />
                ¿Es una cámara térmica?
              </label>

              <button onClick={handleStartStream}>Probar cámara</button>
            </div>
          )}
        </>
      )}

      {step === 2 && (
        <div>
          <h4>✅ Conexión exitosa</h4>
          <canvas ref={canvasRef} width={640} height={480} style={{ width: '100%' }} />

          <div>
            <label>Nombre de la cámara:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Cam 1 - Galpón"
              required
            />
          </div>

          <div>
            <label>Ubicación (opcional):</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <button onClick={handleSave}>Guardar cámara</button>
        </div>
      )}
    </div>
  );
};

export default CameraSetup;
