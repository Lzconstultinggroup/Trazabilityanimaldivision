// src/components/Camera/CameraViewer.jsx
import React, { useEffect, useRef } from 'react';

const CameraViewer = ({ streamKey }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!window.JSMpeg) {
      console.error('❌ No se cargó JSMpeg. Verificá que el script esté en el index.html');
      return;
    }

    if (!canvasRef.current || !streamKey) {
      console.warn('Canvas o streamKey no disponible');
      return;
    }

    const wsUrl = `ws://localhost:9999/?streamKey=${streamKey}`;

    const player = new window.JSMpeg.Player(wsUrl, {
      canvas: canvasRef.current,
      autoplay: true,
      audio: false,
      loop: true,
    });

    return () => {
      if (player && player.destroy) player.destroy();
    };
  }, [streamKey]);

  return (
    <div style={{ marginBottom: '20px' }}>
      <h4>Stream: {streamKey}</h4>
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ width: '100%', backgroundColor: 'black' }}
      />
    </div>
  );
};

export default CameraViewer;
