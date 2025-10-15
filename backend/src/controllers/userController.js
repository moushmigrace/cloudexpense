import { createUser, getUserByEmail } from '../models/userModel.js';
import bcrypt from 'bcryptjs';

export const registerUser = async (req, res) => {
  try {
    const existingUser = await getUserByEmail(req.body.email);
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ message: 'Login successful', user_id: user.user_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
