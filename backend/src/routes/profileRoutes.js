import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createProfileController, getProfileController, updateProfileController } from '../controllers/profileController.js';
const router = express.Router();

router.post('/', createProfileController);

router.get('/:user_id', authMiddleware,getProfileController);
router.put('/:user_id',authMiddleware, updateProfileController);

export default router;
