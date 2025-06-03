// scanner.js
import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';

const app = express();
const PORT = 4050;

app.use(cors());

app.get('/scan-network', (req, res) => {
  const subnet = req.query.subnet || '192.168.1.0/24';
  console.log(`🔍 Escaneando red para RTSP en ${subnet}`);

  // Solo mostrar IPs con puerto 554 (RTSP) abierto
  exec(`nmap -p 554 --open ${subnet}`, (err, stdout, stderr) => {
    if (err) {
      console.error('❌ Error ejecutando nmap:', err);
      return res.status(500).json({ error: 'Error al escanear red' });
    }

    const lines = stdout.split('\n');
    const devices = [];
    let currentIp = null;

    lines.forEach((line) => {
      if (line.startsWith('Nmap scan report for')) {
        currentIp = line.split(' ')[4];
      } else if (line.includes('554/tcp open')) {
        if (currentIp) {
          devices.push({ ip: currentIp, mac: 'No verificada' });
          currentIp = null;
        }
      }
    });

    res.json({ devices });
  });
});

app.listen(PORT, () => {
  console.log(`📡 Escáner RTSP corriendo en http://localhost:${PORT}`);
});
