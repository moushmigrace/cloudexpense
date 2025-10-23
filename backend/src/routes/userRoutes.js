import express from 'express';
import { registerUser, loginUser, getUserExpenses } from '../controllers/userController.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/expense/user/:userId', getUserExpenses); // fetch user-specific expenses

export default router;
