import pool from '../config/db.js';

export const createExpense = async (data) => {
  const { user_id, amount, category, vendor, expense_date, receipt } = data;
  const result = await pool.query(
    `INSERT INTO expense (user_id, amount, category, vendor, expense_date, created_at, receipt)
     VALUES ($1, $2, $3, $4, $5, NOW(), $6) RETURNING *`,
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
