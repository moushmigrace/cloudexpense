import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Dashboard() {
  // Using the same static data as Home.jsx for consistency and demonstration
  const [expenses] = useState([
    { id: 1, amount: 45.99, category: 'Food', vendor: 'Starbucks', expense_date: '2025-10-15' },
    { id: 2, amount: 120.50, category: 'Transport', vendor: 'Uber', expense_date: '2025-10-14' },
    { id: 3, amount: 89.00, category: 'Shopping', vendor: 'Amazon', expense_date: '2025-10-13' },
    { id: 4, amount: 25.00, category: 'Food', vendor: 'McDonald\'s', expense_date: '2025-10-12' },
    { id: 5, amount: 300.00, category: 'Bills', vendor: 'Electricity Board', expense_date: '2025-10-11' },
    { id: 6, amount: 75.25, category: 'Shopping', vendor: 'H&M', expense_date: '2025-10-10' },
  ]);
  const [loading] = useState(false);

  // Prepare chart data: sum amounts by category
  const categoryTotals = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
    return acc;
  }, {});

  const chartData = Object.entries(categoryTotals).map(([category, amount]) => ({
    name: category,
    total: parseFloat(amount.toFixed(2)),
  }));

  return (
    <div style={{
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
      backgroundColor: '#f5f5f5', // Grayscale background
      overflowY: 'auto',
      overflowX: 'hidden'
    }}>
      {/* Navigation Bar */}
      <nav style={{
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '0 2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '70px'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#212121', // Dark gray
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.8rem' }}>💰</span>
            <span>ExpenseTracker</span>
          </div>
          
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="/home" className="nav-link" style={{ textDecoration: 'none', color: '#757575', fontWeight: '500' }}>Home</a>
            <a href="/dashboard" className="nav-link active" style={{
              textDecoration: 'none',
              color: '#212121', // Dark gray for active link
              fontWeight: '600',
              borderBottom: '2px solid #212121', // Dark gray border
              paddingBottom: '0.25rem',
            }}>Dashboard</a>
            <a href="/login" className="nav-link" style={{ textDecoration: 'none', color: '#757575', fontWeight: '500' }}>Login</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="home-main" style={{
        flex: '1',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '3rem 2rem'
      }}>
        {/* Header Section */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#212121', margin: '0 0 0.5rem 0' }}>Expense Dashboard</h1>
          <p style={{ fontSize: '1rem', color: '#757575', margin: 0 }}>Visualizing your spending by category</p>
        </div>

        {/* Chart Section */}
        {!loading && expenses.length > 0 && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            padding: '2rem',
            height: '500px'
          }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                barSize={40}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis dataKey="name" tick={{ fill: '#757575', fontSize: 14 }} tickLine={false} axisLine={{ stroke: '#e0e0e0' }} />
                <YAxis tick={{ fill: '#757575', fontSize: 14 }} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip
                  cursor={{ fill: 'rgba(224, 224, 224, 0.5)' }} // Light gray cursor
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                  labelStyle={{ fontWeight: '600', color: '#212121' }}
                />
                <Bar dataKey="total" fill="#424242" radius={[8, 8, 0, 0]} /> {/* Dark gray bar */}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {/* Empty State */}
        {!loading && expenses.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>📊</div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '600', color: '#212121', marginBottom: '0.75rem' }}>No expense data available</h2>
            <p style={{ color: '#757575', fontSize: '1.1rem', marginBottom: '2rem' }}>Add some expenses to see your analytics dashboard.</p>
            <a href="/bill" className="get-started-btn" style={{
              backgroundColor: '#424242', // Dark gray button
              color: '#ffffff',
              padding: '0.875rem 2rem',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              display: 'inline-block',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>Add First Expense</a>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#212121', // Dark gray footer
        color: '#a0a0a0', // Light gray footer text
        padding: '2.5rem 2rem',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>
            © 2025 ExpenseTracker. All rights reserved.
          </p>
        </div>
      </footer>

      <style>{`
        body { margin: 0 !important; padding: 0 !important; }
        #root { width: 100%; height: 100%; }
        * { box-sizing: border-box; }
        .nav-link:hover { color: #000000 !important; }
        .nav-link.active { pointer-events: none; }
        .get-started-btn:hover {
          background-color: #616161 !important; /* Darker gray on hover */
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2) !important;
        }
        .recharts-tooltip-label { font-weight: bold; }
      `}</style>
    </div>
  );
}
