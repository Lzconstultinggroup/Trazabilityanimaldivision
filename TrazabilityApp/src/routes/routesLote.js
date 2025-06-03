import express from 'express';
import authenticate from '../middlewares/authMiddleware.js';
import loteController from '../controllers/loteController.js';

const router = express.Router();

router.post('/create', authenticate, loteController.createLote);
router.get('/my-lotes', authenticate, loteController.getMyLotes);
router.get('/abiertos', authenticate, loteController.getLotesAbiertos);

export default router;
