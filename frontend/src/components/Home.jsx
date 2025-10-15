import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import './home.css';
export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Testing flag
  const TEST_MODE = true; // set to false in production
  const userToken = TEST_MODE ? 'TEST' : localStorage.getItem('userToken');

  useEffect(() => {
    // Normal auth check (skipped if TEST_MODE = true)
    if (!userToken && !TEST_MODE) {
      navigate('/login');
      return;
    }

    const fetchExpenses = async () => {
      try {
        const res = await axios.get('/api/expense/all', {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        setExpenses(res.data);
      } catch (err) {
        console.error('Error fetching expenses:', err);
        // Redirect to login if token invalid (only in production)
        if (err.response && err.response.status === 401 && !TEST_MODE) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [userToken, navigate]);

  return (
    
    <div className="container">
      <header className="header">
        <div className="logo">💰 ExpenseTracker</div>
        <nav className="nav">
          <Link to="/home">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>

      <main className="main-content">
        <h2>Expenses</h2>
        <Link to="/bill" className="btn">Add Expense</Link>

        {loading ? <p>Loading expenses...</p> : (
          expenses.length === 0 ? <p>No expenses found. Add a new one!</p> : (
            <div className="expense-table-container">
              <table className="expense-table">
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Vendor</th>
                    <th>Date</th>
                    <th>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map(exp => (
                    <tr key={exp.id}>
                      <td>{exp.amount}</td>
                      <td>{exp.category}</td>
                      <td>{exp.vendor}</td>
                      <td>{new Date(exp.expense_date).toLocaleDateString()}</td>
                      <td>
                        {exp.receipt ? <a href={exp.receipt} target="_blank" rel="noopener noreferrer">View</a> : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </main>
    </div>
  );
}
