import { createUser, getUserByEmail } from '../models/userModel.js';
import { getExpenses } from '../models/expenseModel.js';
import bcrypt from 'bcryptjs';


export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await createUser({ username, email, password: hashedPassword });

    res.status(201).json({
      message: 'User registered successfully',
      user: { user_id: user.user_id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      user_id: user.user_id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getUserExpenses = async (req, res) => {

  try {
  
  const { userId } = req.params;
  
  if (!userId) return res.status(400).json({ message: 'User ID is required' });
  
  const expenses = await getExpenses(userId); // fetch from PostgreSQL
  
  res.json(expenses);
  
  } catch (err) {
  
  res.status(500).json({ error: err.message });
  
  }
  
  };