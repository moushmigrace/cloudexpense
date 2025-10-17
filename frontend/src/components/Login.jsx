import React, { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Simulate an API call
    setTimeout(() => {
      // Mock login logic: fail for any password other than "password"
      if (email && password === 'password') {
        console.log('Login successful');
        // In a real app, you would navigate to the home page here.
        // For this environment, we'll just log it.
        // window.location.href = '/home'; 
      } else {
        setError('Invalid email or password. Please try again.');
      }
      setIsSubmitting(false);
    }, 1500);
  };

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
            <a href="/dashboard" className="nav-link" style={{ textDecoration: 'none', color: '#757575', fontWeight: '500' }}>Dashboard</a>
            <a href="/login" className="nav-link active" style={{
              textDecoration: 'none',
              color: '#212121', // Dark gray for active link
              fontWeight: '600',
              borderBottom: '2px solid #212121', // Dark gray border
              paddingBottom: '0.25rem',
            }}>Login</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        flex: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '450px'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '700', color: '#212121', margin: '0 0 0.5rem 0' }}>Welcome Back</h1>
            <p style={{ fontSize: '1rem', color: '#757575', margin: 0 }}>Sign in to continue to your dashboard.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Form Group: Email */}
              <div>
                <label htmlFor="email" style={styles.label}>Email Address</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required style={styles.input} className="form-input" />
              </div>

              {/* Form Group: Password */}
              <div>
                <label htmlFor="password" style={styles.label}>Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={styles.input} className="form-input" />
              </div>
              
              {/* Error Message */}
              {error && (
                <div style={styles.errorBox}>
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button type="submit" className="submit-btn" disabled={isSubmitting} style={isSubmitting ? {...styles.button, ...styles.buttonDisabled} : styles.button}>
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#212121', // Dark gray footer
        color: '#a0a0a0', // Light gray footer text
        padding: '2.5rem 2rem',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>© 2025 ExpenseTracker. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        body { margin: 0 !important; padding: 0 !important; }
        #root { width: 100%; height: 100%; }
        * { box-sizing: border-box; }
        .nav-link:hover { color: #000000 !important; }
        .nav-link.active { pointer-events: none; }
        .submit-btn:hover:not(:disabled) {
          background-color: #616161 !important; /* Darker gray on hover */
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2) !important;
        }
        .form-input:focus {
          border-color: #424242 !important; /* Dark gray focus border */
          box-shadow: 0 0 0 3px rgba(66, 66, 66, 0.2) !important; /* Gray focus shadow */
        }
      `}</style>
    </div>
  );
}

// Grouped styles for cleaner JSX in grayscale
const styles = {
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#424242', // Dark gray
  },
  input: {
    width: '100%',
    padding: '0.875rem 1rem',
    borderRadius: '8px',
    border: '1px solid #e0e0e0', // Light gray border
    fontSize: '1rem',
    backgroundColor: '#ffffff',
    color: '#212121', // Darkest gray text
    transition: 'border-color 0.2s, box-shadow 0.2s',
    outline: 'none',
  },
  button: {
    width: '100%',
    backgroundColor: '#424242', // Dark gray button
    color: '#ffffff',
    padding: '1rem 2rem',
    borderRadius: '10px',
    border: 'none',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '1rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
  },
  buttonDisabled: {
    backgroundColor: '#bdbdbd', // Medium gray for disabled
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  errorBox: {
    backgroundColor: '#eeeeee', // Light gray for error background
    color: '#212121', // Dark gray for error text
    border: '1px solid #e0e0e0',
    padding: '0.875rem 1rem',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '0.9rem',
    fontWeight: '500',
  }
};

