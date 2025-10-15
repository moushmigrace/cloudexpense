import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

export const createUser = async (data) => {
  const { username, email, password } = data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (username, email, password, created_at)
     VALUES ($1, $2, $3, NOW()) RETURNING *`,
    [username, email, hashedPassword]
  );
  return result.rows[0];
};

export const getUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email=$1`,
    [email]
  );
  return result.rows[0];
};

export const getUserById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE user_id=$1`,
    [id]
  );
  return result.rows[0];
};
