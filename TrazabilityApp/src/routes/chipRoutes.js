import express from 'express';
import chipController from '../controllers/chipController.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

// 👉 Ruta para registrar un chip NFC
router.post('/register', authenticate, chipController.registerChip);

// 👉 Ruta para ver todos los chips del admin que está logueado
router.get('/my-chips', authenticate, chipController.getMyChips);

// 👉 Ruta general para otros chips relacionados al usuario
router.get('/', authenticate, chipController.getUserChips);

// 👉 Ruta para validar si un chip esta registrado
router.post('/validate', authenticate, chipController.validateChip);

export default router;
