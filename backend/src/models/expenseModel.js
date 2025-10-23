import pool from '../config/db.js';

export const createExpense = async (data) => {
  const { user_id, amount, category, vendor, expense_date, receipt } = data;
  const result = await pool.query(
    `INSERT INTO expense (user_id, amount, category, vendor, expense_date, receipt)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [user_id, amount, category, vendor, expense_date, receipt]
  );
  return result.rows[0];
};

export const getExpenses = async (user_id) => {
  const result = await pool.query(
    `SELECT * FROM expense WHERE user_id = $1 ORDER BY expense_date DESC`,
    [user_id]
  );
  return result.rows;
};

/**
 * Deletes an expense by its ID, ensuring it belongs to the correct user.
 */
export const deleteExpenseById = async (expenseId, userId) => {
  const result = await pool.query(
    // The "AND user_id = $2" part is a crucial security check
    // to prevent one user from deleting another user's expenses.
    'DELETE FROM expense WHERE id = $1 AND user_id = $2 RETURNING *',
    [expenseId, userId]
  );
  return result.rows[0];
};