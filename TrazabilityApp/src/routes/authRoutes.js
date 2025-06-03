import express from 'express';
import authController from '../controllers/authController.js';
import upload from '../middlewares/upload.js';


const router = express.Router();

// Para registro usamos upload.single('photo') ya que el campo del formulario se llama "photo"
router.post('/register', upload.single('photo'), authController.register);
router.post('/login', authController.login);

export default router;
