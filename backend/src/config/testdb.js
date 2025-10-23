import pool from './db.js';

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ RDS Connected:', res.rows[0]);
  } catch (err) {
    console.error('❌ RDS Connection Failed:', err);
  }
})();
