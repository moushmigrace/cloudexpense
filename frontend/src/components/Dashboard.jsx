import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      // Get user credentials from localStorage
      const userId = localStorage.getItem('userId');
      const userToken = localStorage.getItem('userToken');
      const userEmail = localStorage.getItem('userEmail');

      console.log('🔍 Fetching expenses for user:', { userId, userEmail, hasToken: !!userToken });

      // Redirect to login if not authenticated
      if (!userId || !userToken) {
        console.log('⚠️ No credentials found, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        setError('');

        // Make API call with user's token
        const res = await axios.get(`/api/user/expense/user/${userId}`, {
          headers: { 
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          },
        });

        console.log('✅ Expenses fetched successfully:', res.data);
        setExpenses(res.data);

      } catch (err) {
        console.error('❌ Error fetching expenses:', err);
        
        if (err.response) {
          // Server responded with error
          if (err.response.status === 401) {
            console.log('🔒 Unauthorized - clearing credentials and redirecting');
            localStorage.removeItem('userId');
            localStorage.removeItem('userToken');
            localStorage.removeItem('userEmail');
            navigate('/login');
          } else if (err.response.status === 404) {
            // No expenses found - this is okay, just empty state
            console.log('📭 No expenses found for user');
            setExpenses([]);
          } else {
            setError('Failed to load expenses. Please try again.');
          }
        } else if (err.request) {
          // Request made but no response
          setError('Unable to connect to server. Please check your connection.');
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [navigate]);

  // Calculate category totals from expenses
  const categoryTotals = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
    return acc;
  }, {});

  const chartData = Object.entries(categoryTotals).map(([category, amount]) => ({
    name: category,
    total: parseFloat(amount.toFixed(2)),
  }));

  const totalSpending = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#f5f5f5',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* Navigation Bar */}
      <nav
        style={{
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '0 2rem',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '70px',
          }}
        >
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#212121',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span style={{ fontSize: '1.8rem' }}>💰</span>
            <span>ExpenseTracker</span>
          </div>

          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a
              href="/home"
              style={{ textDecoration: 'none', color: '#757575', fontWeight: '500' }}
            >
              Home
            </a>
            <a
              href="/dashboard"
              style={{
                textDecoration: 'none',
                color: '#212121',
                fontWeight: '600',
                borderBottom: '2px solid #212121',
                paddingBottom: '0.25rem',
              }}
            >
              Dashboard
            </a>
            <a
              href="/login"
              style={{ textDecoration: 'none', color: '#757575', fontWeight: '500' }}
            >
              Login
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main
        style={{
          flex: '1',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: '3rem 2rem',
        }}
      >
        {/* Header Section */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#212121',
              margin: '0 0 0.5rem 0',
            }}
          >
            My Expense Dashboard
          </h1>
          <p style={{ fontSize: '1rem', color: '#757575', margin: 0 }}>
            {localStorage.getItem('userEmail') || 'Your'} spending overview
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '2rem',
              border: '1px solid #ef5350',
            }}
          >
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div
            style={{
              textAlign: 'center',
              padding: '5rem 2rem',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
            <p style={{ color: '#757575', fontSize: '1.1rem' }}>Loading your expenses...</p>
          </div>
        )}

        {/* Stats Summary */}
        {!loading && expenses.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <p style={{ color: '#757575', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>
                Total Expenses
              </p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#212121', margin: 0 }}>
                {expenses.length}
              </p>
            </div>
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <p style={{ color: '#757575', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>
                Total Spending
              </p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#212121', margin: 0 }}>
                ${totalSpending.toFixed(2)}
              </p>
            </div>
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <p style={{ color: '#757575', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>
                Categories
              </p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#212121', margin: 0 }}>
                {Object.keys(categoryTotals).length}
              </p>
            </div>
          </div>
        )}

        {/* Chart Section */}
        {!loading && expenses.length > 0 && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              padding: '2rem',
              height: '500px',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#212121',
                marginBottom: '1.5rem',
              }}
            >
              Spending by Category
            </h2>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                barSize={40}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#757575', fontSize: 14 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis
                  tick={{ fill: '#757575', fontSize: 14 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(224, 224, 224, 0.5)' }}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                  labelStyle={{ fontWeight: '600', color: '#212121' }}
                  formatter={(value) => [`$${value}`, 'Total']}
                />
                <Bar dataKey="total" fill="#424242" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Empty State */}
        {!loading && expenses.length === 0 && !error && (
          <div
            style={{
              textAlign: 'center',
              padding: '5rem 2rem',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>📊</div>
            <h2
              style={{
                fontSize: '1.75rem',
                fontWeight: '600',
                color: '#212121',
                marginBottom: '0.75rem',
              }}
            >
              No expense data available
            </h2>
            <p
              style={{
                color: '#757575',
                fontSize: '1.1rem',
                marginBottom: '2rem',
              }}
            >
              Add some expenses to see your analytics dashboard.
            </p>
            <a
              href="/bill"
              style={{
                backgroundColor: '#424242',
                color: '#ffffff',
                padding: '0.875rem 2rem',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'inline-block',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
            >
              Add First Expense
            </a>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: '#212121',
          color: '#a0a0a0',
          padding: '2.5rem 2rem',
          marginTop: 'auto',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <p style={{ margin: 0, fontSize: '0.95rem' }}>
            © 2025 ExpenseTracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}