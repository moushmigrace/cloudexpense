import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { addExpense, getAllExpenses } from '../controllers/expenseController.js';

const router = express.Router();

// Protected routes
router.post('/add', authMiddleware, ...addExpense);
router.get('/all', authMiddleware, getAllExpenses);

export default router;
