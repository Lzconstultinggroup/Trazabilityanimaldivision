import express from 'express';
import nfcController from '../controllers/nfcController.js';
import authenticate from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/scan', authenticate, authorizeRoles(['operator', 'admin', 'professional']), nfcController.scanChip);

export default router;
