// src/components/NFCReader.js
import React, { useState } from 'react';

const NFCReader = ({ onDataRead }) => {
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);

  const startScanning = async () => {
    if (!('NDEFReader' in window)) {
      setError('Web NFC no es compatible con este dispositivo o navegador.');
      return;
    }
    try {
      const ndef = new NDEFReader();
      setScanning(true);
      await ndef.scan();
      ndef.onreading = (event) => {
        const { serialNumber, message } = event;
        // Procesa los registros NDEF. Por ejemplo, extraer textos:
        const records = [];
        for (const record of message.records) {
          if (record.recordType === 'text') {
            const textDecoder = new TextDecoder(record.encoding);
            const text = textDecoder.decode(record.data);
            records.push(text);
          }
        }
        const data = { serialNumber, records };
        // Se puede enviar la información hacia el componente padre
        if (onDataRead) onDataRead(data);
        setScanning(false);
      };
      ndef.onreadingerror = (event) => {
        setError('Error al leer la etiqueta NFC.');
        setScanning(false);
      };
    } catch (err) {
      setError(`Error al iniciar el escaneo: ${err.message}`);
      setScanning(false);
    }
  };

  return (
    <div>
      <button onClick={startScanning} disabled={scanning}>
        {scanning ? 'Escaneando NFC...' : 'Acercar dispositivo al chip NFC'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default NFCReader;
