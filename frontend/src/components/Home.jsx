import React, { useState } from 'react';

export default function Home() {
  const [expenses] = useState([
    { id: 1, amount: 45.99, category: 'Food', vendor: 'Starbucks', expense_date: '2025-10-15', receipt: '#' },
    { id: 2, amount: 120.50, category: 'Transport', vendor: 'Uber', expense_date: '2025-10-14', receipt: null },
    { id: 3, amount: 89.00, category: 'Shopping', vendor: 'Amazon', expense_date: '2025-10-13', receipt: '#' },
  ]);
  const [loading] = useState(false);

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
            color: '#212121', // Dark Gray
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.8rem' }}>💰</span>
            <span>ExpenseTracker</span>
          </div>
          
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="/home" className="nav-link active" style={{
              textDecoration: 'none',
              color: '#212121', // Dark Gray
              fontWeight: '600',
              fontSize: '1rem',
              borderBottom: '2px solid #212121', // Dark Gray
              paddingBottom: '0.25rem',
              transition: 'all 0.2s ease'
            }}>Home</a>
            <a href="/dashboard" className="nav-link" style={{
              textDecoration: 'none',
              color: '#757575', // Medium Gray
              fontWeight: '500',
              fontSize: '1rem',
              transition: 'all 0.2s ease'
            }}>Dashboard</a>
            <a href="/login" className="nav-link" style={{
              textDecoration: 'none',
              color: '#757575', // Medium Gray
              fontWeight: '500',
              fontSize: '1rem',
              transition: 'all 0.2s ease'
            }}>Login</a>
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
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2.5rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#212121', // Dark Gray
              margin: '0 0 0.5rem 0'
            }}>Your Expenses</h1>
            <p style={{
              fontSize: '1rem',
              color: '#757575', // Medium Gray
              margin: 0
            }}>Track and manage all your expenses in one place</p>
          </div>
          
          <a href="/bill" className="add-expense-btn" style={{
            backgroundColor: '#424242', // Dark Gray Button
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
            cursor: 'pointer'
          }}>
            <span style={{ fontSize: '1.2rem' }}>+</span>
            Add Expense
          </a>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5rem 0'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '5px solid #e0e0e0', // Light Gray Border
              borderTop: '5px solid #424242', // Dark Gray Spinner
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{
              marginTop: '1.5rem',
              color: '#757575', // Medium Gray
              fontSize: '1rem'
            }}>Loading your expenses...</p>
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
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '600',
              color: '#212121', // Dark Gray
              marginBottom: '0.75rem'
            }}>No expenses yet</h2>
            <p style={{
              color: '#757575', // Medium Gray
              fontSize: '1.1rem',
              marginBottom: '2rem'
            }}>Start tracking your finances by adding your first expense</p>
            <a href="/bill" className="get-started-btn" style={{
              backgroundColor: '#424242', // Dark Gray Button
              color: '#ffffff',
              padding: '0.875rem 2rem',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              display: 'inline-block',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>Get Started</a>
          </div>
        )}

        {/* Expenses Table */}
        {!loading && expenses.length > 0 && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            overflow: 'hidden'
          }}>
            <div style={{
              overflowX: 'auto'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '600px'
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#f5f5f5', // Light Gray Header
                    borderBottom: '2px solid #e0e0e0' // Gray Border
                  }}>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Vendor</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp, index) => (
                    <tr key={exp.id} className="table-row" style={{
                      borderBottom: '1px solid #e0e0e0',
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}>
                      <td style={styles.td}>
                        <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#212121' }}>${exp.amount}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          backgroundColor: '#eeeeee', // Light Gray Badge
                          color: '#424242', // Dark Gray Text
                          padding: '0.375rem 0.875rem',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          fontWeight: '600'
                        }}>{exp.category}</span>
                      </td>
                      <td style={{...styles.td, color: '#424242', fontSize: '1rem' }}>{exp.vendor}</td>
                      <td style={{...styles.td, color: '#757575', fontSize: '0.95rem' }}>{new Date(exp.expense_date).toLocaleDateString()}</td>
                      <td style={styles.td}>
                        {exp.receipt ? (
                          <a href={exp.receipt} target="_blank" rel="noopener noreferrer" className="receipt-link" style={{
                            color: '#424242', // Dark Gray Link
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            transition: 'all 0.2s ease'
                          }}>View →</a>
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
      <footer style={{
        backgroundColor: '#212121', // Darkest Gray
        color: '#a0a0a0', // Light Gray Text
        padding: '2.5rem 2rem',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}>
              © 2025 ExpenseTracker. All rights reserved.
            </p>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#757575' }}>
              Manage your finances with ease
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '2rem'
          }}>
            <a href="/about" className="footer-link" style={{ color: '#a0a0a0', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s ease' }}>About</a>
            <a href="/contact" className="footer-link" style={{ color: '#a0a0a0', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s ease' }}>Contact</a>
            <a href="/privacy" className="footer-link" style={{ color: '#a0a0a0', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s ease' }}>Privacy Policy</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        body {
          margin: 0 !important;
          padding: 0 !important;
          display: block !important;
          place-items: unset !important;
        }
        
        #root {
          width: 100%;
          height: 100%;
        }
        
        * {
          box-sizing: border-box;
        }
        
        /* Navigation hover effects */
        .nav-link:hover {
          color: #000000 !important;
          transform: translateY(-1px);
        }
        
        .nav-link.active {
          pointer-events: none;
        }
        
        /* Button hover effects */
        .add-expense-btn:hover,
        .get-started-btn:hover {
          background-color: #616161 !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2) !important;
        }
        
        .add-expense-btn:active,
        .get-started-btn:active {
          transform: translateY(0);
        }
        
        /* Table row hover effects */
        .table-row:hover {
          background-color: #f5f5f5 !important;
          transform: scale(1.005);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        /* Receipt link hover */
        .receipt-link:hover {
          color: #000000 !important;
          text-decoration: underline;
          transform: translateX(2px);
        }
        
        /* Footer link hover */
        .footer-link:hover {
          color: #ffffff !important;
        }
        
        /* Add fade-in animation to elements */
        .home-main > * {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}


// Grouped styles for table elements
const styles = {
  th: {
    padding: '1.25rem 1.5rem',
    textAlign: 'left',
    fontSize: '0.875rem',
    fontWeight: '700',
    color: '#424242', // Dark Gray
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  td: {
    padding: '1.25rem 1.5rem'
  }
};
