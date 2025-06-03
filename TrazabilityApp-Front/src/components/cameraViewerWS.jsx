import React, { useEffect, useRef } from 'react';
import JSMpeg from 'jsmpeg';

const CameraViewerWS = ({ streamKey }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const url = `ws://localhost:9999/stream/${streamKey}`;
    const ws = new WebSocket(url);
    const player = new JSMpeg.Player(ws, { canvas: canvasRef.current });

    return () => {
      player.destroy();
      ws.close();
    };
  }, [streamKey]);

  return (
    <div>
      <h3>Transmisión: {streamKey}</h3>
      <canvas ref={canvasRef} width="640" height="480" />
    </div>
  );
};

export default CameraViewerWS;
