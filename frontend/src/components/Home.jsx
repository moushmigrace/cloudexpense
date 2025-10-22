import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const TEST_MODE = true; // ✅ Set to false in production
  const userToken = TEST_MODE ? 'TEST' : localStorage.getItem('userToken');

  useEffect(() => {
    if (!userToken && !TEST_MODE) {
      navigate('/login');
      return;
    }

    const fetchExpenses = async () => {
      try {
        const res = await axios.get('/api/expense/all', {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setExpenses(res.data);
      } catch (err) {
        console.error('Error fetching expenses:', err);
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
              className="nav-link active"
              style={{
                textDecoration: 'none',
                color: '#212121',
                fontWeight: '600',
                fontSize: '1rem',
                borderBottom: '2px solid #212121',
                paddingBottom: '0.25rem',
              }}
            >
              Home
            </a>
            <a
              href="/dashboard"
              className="nav-link"
              style={{
                textDecoration: 'none',
                color: '#757575',
                fontWeight: '500',
                fontSize: '1rem',
              }}
            >
              Dashboard
            </a>
            <a
              href="/login"
              className="nav-link"
              style={{
                textDecoration: 'none',
                color: '#757575',
                fontWeight: '500',
                fontSize: '1rem',
              }}
            >
              Login
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main
        className="home-main"
        style={{
          flex: '1',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: '3rem 2rem',
        }}
      >
        {/* Header Section */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2.5rem',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#212121',
                margin: '0 0 0.5rem 0',
              }}
            >
              Your Expenses
            </h1>
            <p style={{ fontSize: '1rem', color: '#757575', margin: 0 }}>
              Track and manage all your expenses in one place
            </p>
          </div>

          <a
            href="/bill"
            className="add-expense-btn"
            style={{
              backgroundColor: '#424242',
              color: '#ffffff',
              padding: '0.875rem 2rem',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>+</span> Add Expense
          </a>
        </div>

        {/* Loading State */}
        {loading && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '5rem 0',
            }}
          >
            <div
              style={{
                width: '50px',
                height: '50px',
                border: '5px solid #e0e0e0',
                borderTop: '5px solid #424242',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            ></div>
            <p style={{ marginTop: '1.5rem', color: '#757575', fontSize: '1rem' }}>
              Loading your expenses...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && expenses.length === 0 && (
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
              No expenses yet
            </h2>
            <p
              style={{
                color: '#757575',
                fontSize: '1.1rem',
                marginBottom: '2rem',
              }}
            >
              Start tracking your finances by adding your first expense
            </p>
            <a
              href="/bill"
              className="get-started-btn"
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
              }}
            >
              Get Started
            </a>
          </div>
        )}

        {/* Expenses Table */}
        {!loading && expenses.length > 0 && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              overflow: 'hidden',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  minWidth: '600px',
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: '#f5f5f5',
                      borderBottom: '2px solid #e0e0e0',
                    }}
                  >
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Vendor</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp, index) => (
                    <tr
                      key={exp.id}
                      className="table-row"
                      style={{
                        borderBottom: '1px solid #e0e0e0',
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <td style={styles.td}>
                        <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#212121' }}>
                          ${exp.amount}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            backgroundColor: '#eeeeee',
                            color: '#424242',
                            padding: '0.375rem 0.875rem',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                          }}
                        >
                          {exp.category}
                        </span>
                      </td>
                      <td style={{ ...styles.td, color: '#424242', fontSize: '1rem' }}>{exp.vendor}</td>
                      <td style={{ ...styles.td, color: '#757575', fontSize: '0.95rem' }}>
                        {new Date(exp.expense_date).toLocaleDateString()}
                      </td>
                      <td style={styles.td}>
                        {exp.receipt ? (
                          <a
                            href={exp.receipt}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="receipt-link"
                            style={{
                              color: '#424242',
                              textDecoration: 'none',
                              fontWeight: '600',
                              fontSize: '0.95rem',
                            }}
                          >
                            View →
                          </a>
                        ) : (
                          <span style={{ color: '#bdbdbd', fontSize: '0.95rem' }}>N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <p style={{ margin: 0, fontSize: '0.95rem' }}>
            © 2025 ExpenseTracker. All rights reserved.
          </p>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#757575' }}>
            Manage your finances with ease
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        body { margin: 0; padding: 0; }
        #root { width: 100%; height: 100%; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}

const styles = {
  th: {
    padding: '1.25rem 1.5rem',
    textAlign: 'left',
    fontSize: '0.875rem',
    fontWeight: '700',
    color: '#424242',
    textTransform: 'uppercase',
  },
  td: {
    padding: '1.25rem 1.5rem',
  },
};
