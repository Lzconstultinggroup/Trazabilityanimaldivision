import express from 'express';
import { exec } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Necesario para usar __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CAPTURE_DIR = path.join(__dirname, '../captures');
if (!existsSync(CAPTURE_DIR)) mkdirSync(CAPTURE_DIR);

router.post('/thermal/capture', async (req, res) => {
  const { streamUrl } = req.body;

  if (!streamUrl) {
    return res.status(400).json({ error: 'Falta streamUrl' });
  }

  const timestamp = Date.now();
  const filename = `thermal_${timestamp}.jpg`;
  const filepath = path.join(CAPTURE_DIR, filename);

  const command = `ffmpeg -y -i "${streamUrl}" -frames:v 1 -q:v 2 "${filepath}"`;

  exec(command, (error) => {
    if (error) {
      console.error('Error al capturar imagen térmica:', error);
      return res.status(500).json({ error: 'No se pudo capturar imagen térmica.' });
    }

    return res.json({ filename, url: `/captures/${filename}` });
  });
});

export default router;
