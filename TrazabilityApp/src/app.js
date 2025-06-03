import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import cameraRoutes from './routes/cameraRoutes.js';
import authRoutes from './routes/authRoutes.js';
import chipRoutes from './routes/chipRoutes.js';
import userRoutes from './routes/userRoutes.js';
import nftRoutes from './routes/nftRoutes.js';
import loteRoutes from './routes/routesLote.js';
import thermalCapture from './routes/thermalCapture.js';


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/chips', chipRoutes);
app.use('/api/users', userRoutes);
app.use('/api/nft', nftRoutes);
app.use('/api/cameras', cameraRoutes);
app.use('/api/lotes', loteRoutes);
app.use('/captures', express.static(path.join(__dirname, 'captures')));
app.use('/api', thermalCapture);


// Conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/trazability', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Conectado a MongoDB');
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ Error al conectar a MongoDB:', err);
});


