import React, { useEffect, useState } from 'react';
import axios from '../services/api'; // Correctly import the configured axios instance
import { Link } from 'react-router-dom'; // Use Link for SPA navigation

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        // The interceptor adds the token automatically!
        const res = await axios.get('/expense/all');
        setExpenses(res.data);
      } catch (err) {
        // The interceptor will handle the 401 redirect.
        // We just log other potential errors here.
        console.error('Error fetching expenses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []); // Empty dependency array ensures this runs only once on mount

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
            <Link to="/home" style={styles.navLinkActive}>Home</Link>
            <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
            <Link to="/login" style={styles.navLink}>Login</Link>
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

          <Link to="/bill" style={styles.addExpenseBtn}>
            <span style={{ fontSize: '1.2rem' }}>+</span> Add Expense
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={styles.centeredMessage}>
            <div style={styles.spinner}></div>
            <p style={{ marginTop: '1.5rem', color: '#757575', fontSize: '1rem' }}>
              Loading your expenses...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && expenses.length === 0 && (
          <div style={styles.emptyStateCard}>
            <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>📊</div>
            <h2 style={{ ...styles.h2, marginBottom: '0.75rem' }}>No expenses yet</h2>
            <p style={styles.emptyStateText}>
              Start tracking your finances by adding your first expense
            </p>
            <Link to="/bill" style={styles.addExpenseBtn}>
              Get Started
            </Link>
          </div>
        )}

        {/* Expenses Table */}
        {!loading && expenses.length > 0 && (
          <div style={styles.tableContainer}>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
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
                      style={{
                        borderBottom: '1px solid #e0e0e0',
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa',
                      }}
                    >
                      <td style={styles.td}>${exp.amount}</td>
                      <td style={styles.td}>{exp.category}</td>
                      <td style={styles.td}>{exp.vendor}</td>
                      <td style={styles.td}>
                        {new Date(exp.expense_date).toLocaleDateString()}
                      </td>
                      <td style={styles.td}>
                        {exp.receipt ? (
                          <a
                            href={exp.receipt}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.receiptLink}
                          >
                            View →
                          </a>
                        ) : (
                          <span style={{ color: '#bdbdbd' }}>N/A</span>
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
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
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

// Grouped styles for better organization
const styles = {
  navLink: {
    textDecoration: 'none',
    color: '#757575',
    fontWeight: '500',
    fontSize: '1rem',
  },
  navLinkActive: {
    textDecoration: 'none',
    color: '#212121',
    fontWeight: '600',
    fontSize: '1rem',
    borderBottom: '2px solid #212121',
    paddingBottom: '0.25rem',
  },
  addExpenseBtn: {
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
  },
  centeredMessage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5rem 0',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #e0e0e0',
    borderTop: '5px solid #424242',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  emptyStateCard: {
    textAlign: 'center',
    padding: '5rem 2rem',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  h2: {
    fontSize: '1.75rem',
    fontWeight: '600',
    color: '#212121',
  },
  emptyStateText: {
    color: '#757575',
    fontSize: '1.1rem',
    marginBottom: '2rem',
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '600px',
  },
  tableHeaderRow: {
    backgroundColor: '#f5f5f5',
    borderBottom: '2px solid #e0e0e0',
  },
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
    color: '#424242'
  },
  receiptLink: {
    color: '#424242',
    textDecoration: 'none',
    fontWeight: '600',
  },
  footer: {
    backgroundColor: '#212121',
    color: '#a0a0a0',
    padding: '2.5rem 2rem',
    marginTop: 'auto',
  },
  footerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
};