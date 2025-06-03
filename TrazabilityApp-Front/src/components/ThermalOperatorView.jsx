import React, { useEffect, useRef, useState } from 'react';
import NFCReader from './NFCReader';
import '../styles/ThermalOperatorView.css';

const ThermalOperatorView = () => {
  const canvasRef = useRef(null);
  const socketRef = useRef(null);
  const [nfcData, setNfcData] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image' or 'video'
  const [mediaData, setMediaData] = useState(null); // base64 string
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:4000/stream/thermal');

    socketRef.current.onmessage = (event) => {
      const ctx = canvasRef.current.getContext('2d');
      const image = new Image();
      image.onload = () => ctx.drawImage(image, 0, 0, canvasRef.current.width, canvasRef.current.height);
      image.src = 'data:image/jpeg;base64,' + event.data;
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  const handleCaptureImage = () => {
    const canvas = canvasRef.current;
    const imageBase64 = canvas.toDataURL('image/jpeg');
    setMediaType('image');
    setMediaData(imageBase64);
    alert('Imagen capturada. Ahora escanea el chip.');
  };

  const handleCaptureVideo = async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    const frames = [];
    const canvas = canvasRef.current;
    const interval = setInterval(() => {
      frames.push(canvas.toDataURL('image/jpeg'));
    }, 200);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    clearInterval(interval);
    setMediaType('video');
    setMediaData(frames);
    setIsCapturing(false);
    alert('Video capturado. Ahora escanea el chip.');
  };

  const handleNFCRead = async (data) => {
    setNfcData(data);

    try {
      const response = await fetch('http://localhost:4000/api/thermal/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          uid: data.serialNumber,
          cowName: data.name,
          mediaType,
          mediaData
        })
      });
      const result = await response.json();
      alert('NFT ALERTA TÉRMICA minteado exitosamente.');
    } catch (error) {
      console.error('Error al mintear ALERTA TÉRMICA:', error);
      alert('Hubo un error al mintear el NFT.');
    }
  };

  return (
    <div className="thermal-container">
      <h2>Vista en Tiempo Real - Cámara Térmica</h2>
      <canvas ref={canvasRef} width={640} height={480} className="thermal-canvas" />
      <div className="thermal-controls">
        <button onClick={handleCaptureImage} disabled={isCapturing}>📸 Tomar Captura</button>
        <button onClick={handleCaptureVideo} disabled={isCapturing}>🎥 Grabar Video (5s)</button>
      </div>
      {(mediaData && !nfcData) && (
        <div className="nfc-section">
          <p>Escanea el chip de la vaca para continuar...</p>
          <NFCReader onDataRead={handleNFCRead} />
        </div>
      )}
    </div>
  );
};

export default ThermalOperatorView;
