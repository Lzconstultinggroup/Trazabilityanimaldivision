// server.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { spawn } from 'child_process';
import { WebSocketServer } from 'ws';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolución de rutas para ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Puertos
const PORT = 4000;     // HTTP + API
const WS_PORT = 9999;  // WebSocket de streaming

// Conexión MongoDB
mongoose.connect('mongodb://localhost:27017/trazability', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Esquema de cámaras
const cameraSchema = new mongoose.Schema({
  adminId: String,
  ip: String,
  name: String,
  location: String,
  streamKey: String,
  thermal: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Camera = mongoose.model('Camera', cameraSchema);

// Express app
const app = express();
app.use(cors());
app.use(express.json());

// 📡 API: Registrar nueva cámara
app.post('/api/cameras', async (req, res) => {
  const { adminId, ip, name, location, streamKey, thermal } = req.body;
  if (!adminId || !ip || !name || !streamKey) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  const exists = await Camera.findOne({ adminId, ip });
  if (exists) return res.status(409).json({ error: 'La cámara ya está registrada' });

  const cam = await Camera.create({ adminId, ip, name, location, streamKey, thermal });
  res.status(201).json(cam);
});

// 📡 API: Obtener cámaras del admin
app.get('/api/cameras/my', async (req, res) => {
  const adminId = req.headers['x-admin-id'];
  if (!adminId) return res.status(401).json({ error: 'Admin no autenticado' });

  const cameras = await Camera.find({ adminId });
  res.json(cameras);
});

// 📡 API: Eliminar cámara
app.delete('/api/cameras/:id', async (req, res) => {
  const adminId = req.headers['x-admin-id'];
  const { id } = req.params;
  if (!adminId) return res.status(401).json({ error: 'Admin no autenticado' });

  const result = await Camera.deleteOne({ _id: id, adminId });
  res.json({ deleted: result.deletedCount > 0 });
});

// 🎥 WebSocket para streaming en vivo
const wsServer = new WebSocketServer({ port: WS_PORT });
const socketsByKey = new Map();

wsServer.on('connection', (socket, req) => {
  const params = new URLSearchParams(req.url.replace('/?', ''));
  const streamKey = params.get('streamKey');

  if (streamKey) {
    socketsByKey.set(streamKey, socket);
    console.log(`📡 Conexión WebSocket iniciada para ${streamKey}`);

    socket.on('close', () => {
      socketsByKey.delete(streamKey);
      console.log(`🔌 Conexión WebSocket cerrada para ${streamKey}`);
    });
  }
});

// 🚀 Iniciar stream RTSP → WebSocket con FFmpeg
app.post('/start-stream', async (req, res) => {
  const { ip, user, password, streamKey, extraParams = '' } = req.body;
  if (!ip || !user || !password || !streamKey) {
    return res.status(400).json({ error: 'Faltan datos para iniciar el stream' });
  }

  const rtspUrl = `rtsp://${user}:${password}@${ip}:554${extraParams}`;
  console.log(`🎬 Iniciando stream para ${streamKey} desde ${rtspUrl}`);

  const ffmpeg = spawn('ffmpeg', [
    '-rtsp_transport', 'tcp',
    '-i', rtspUrl,
    '-f', 'mpegts',
    '-codec:v', 'mpeg1video',
    '-s', '640x480',
    '-b:v', '1000k',
    '-r', '30',
    '-an', '-sn', '-dn',
    '-fflags', 'nobuffer',
    '-f', 'mpegts', '-'
  ]);

  ffmpeg.stdout.on('data', (chunk) => {
    const socket = socketsByKey.get(streamKey);
    if (socket && socket.readyState === 1) {
      socket.send(chunk);
    }
  });

  ffmpeg.stderr.on('data', (data) => {
    console.error(`FFmpeg STDERR [${streamKey}]:`, data.toString());
  });

  ffmpeg.on('close', (code) => {
    console.log(`🛑 FFmpeg finalizado para ${streamKey} con código ${code}`);
  });

  res.status(200).json({ message: '🟢 Streaming WebSocket iniciado', streamKey });
});

// 🌐 Servir frontend compilado
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Iniciar servidor principal
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`🚀 Backend y API activos en http://localhost:${PORT}`);
  console.log(`📺 WebSocket server en ws://localhost:${WS_PORT}`);
});
