import pool from '../config/db.js';

/**
 * Finds a user by their Cognito ID. If they don't exist, it creates a record for them.
 * This is used by the authMiddleware for automatic user creation on their first API call.
 * @param {object} userData - An object containing the user's id and email from Cognito.
 * @returns {object} The user record from the database.
 */
export const findOrCreateUser = async (userData) => {
  const { id, email } = userData;
  try {
    const query = `
      INSERT INTO users (id, email)
      VALUES ($1, $2)
      ON CONFLICT (id) DO NOTHING;
    `;
    await pool.query(query, [id, email]);
    const existingUser = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return existingUser.rows[0];
  } catch (err) {
    console.error("[findOrCreateUser] DB ERROR:", err);
    throw err; // Re-throw to see it in middleware
  }
};

/**
 * Creates a new user record directly.
 * This is needed by your userController.
 * @param {object} userData - An object containing the user's id and email.
 * @returns {object} The newly created user record.
 */
export const createUser = async (userData) => {
  const { id, email } = userData;
  const result = await pool.query(
    'INSERT INTO users (id, email) VALUES ($1, $2) RETURNING *',
    [id, email]
  );
  return result.rows[0];
};

/**
 * Finds a user by their email address.
 * This is also needed by your userController.
 * @param {string} email - The email of the user to find.
 * @returns {object} The user record from the database.
 */
export const getUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};