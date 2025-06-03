import express from 'express';
import userController from '../controllers/userController.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/my-workers', authenticate, userController.getMyWorkers);

export default router;
