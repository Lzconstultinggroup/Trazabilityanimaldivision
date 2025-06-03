import express from 'express';
import cameraController from '../controllers/cameraController.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', authenticate, cameraController.registerCamera);
router.get('/my', authenticate, cameraController.getUserCameras);

export default router;


