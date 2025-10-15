import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import expenseRoutes from './routes/expenseRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/expense', expenseRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/user', userRoutes);

export default app;
