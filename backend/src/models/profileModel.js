import pool from '../config/db.js';

export const createProfile = async (data) => {
  const { user_id, full_name, email, contact_number, profile_picture } = data;
  const result = await pool.query(
    `INSERT INTO profile (user_id, full_name, email, contact_number, profile_picture, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *`,
    [user_id, full_name, email, contact_number, profile_picture]
  );
  return result.rows[0];
};

export const getProfileByUserId = async (user_id) => {
  const result = await pool.query(
    `SELECT * FROM profile WHERE user_id = $1`,
    [user_id]
  );
  return result.rows[0];
};

export const updateProfile = async (user_id, data) => {
  const { full_name, email, contact_number, profile_picture } = data;
  const result = await pool.query(
    `UPDATE profile
     SET full_name=$1, email=$2, contact_number=$3, profile_picture=$4, updated_at=NOW()
     WHERE user_id=$5 RETURNING *`,
    [full_name, email, contact_number, profile_picture, user_id]
  );
  return result.rows[0];
}
