import express from 'express';
import { mintNFT, mintBatchNFT, getNFTData, getHistoryByUID } from '../controllers/nftController.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/mint', authenticate, mintNFT);
router.post('/mint-batch', authenticate, mintBatchNFT);
router.get('/history/:uid', authenticate, getHistoryByUID);

export default router;
