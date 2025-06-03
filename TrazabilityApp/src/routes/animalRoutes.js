import express from 'express';
import animalController from '../controllers/animalController.js';
import authenticate from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/:uid', authenticate, authorizeRoles(['admin', 'professional']), animalController.getAnimalHistory);

export default router;
