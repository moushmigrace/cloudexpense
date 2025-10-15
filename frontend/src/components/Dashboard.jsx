import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';


export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();
  const userToken = localStorage.getItem('userToken');

  useEffect(() => {
    if (!userToken) {
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
        if (err.response && err.response.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchExpenses();
  }, [userToken, navigate]);

  // Prepare chart data: sum amounts by category
  const categoryTotals = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
    return acc;
  }, {});
  const data = Object.entries(categoryTotals).map(([category, amount]) => ({ category, amount }));

  return (
    <div className="container">
      <header className="header">
        <div className="logo">💰 ExpenseTracker</div>
        <nav className="nav">
          <a href="/home">Home</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/login">Login</a>
        </nav>
      </header>

      <main className="main-content">
        <h2>Expense Analytics</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#3c1053" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}
