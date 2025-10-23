import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';

export default function Bill() {
  const [form, setForm] = useState({
    // Remove user_id - backend will get it from token
    amount: '',
    category: '',
    vendor: '',
    expense_date: '',
  });
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchAuthSession();
      } catch (error) {
        console.error('Not authenticated');
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      setFile(null);
      setFileName('No file chosen');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    Object.keys(form).forEach(key => data.append(key, form[key]));
    if (file) {
      data.append('receipt', file);
    }

    try {
      // ✅ Changed from '/api/expense/add' to '/expense/add'
      await api.post('/expense/add', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Expense added successfully!');
      navigate('/home');
    } catch (error) {
      console.error('Error submitting the bill:', error);
      alert('Failed to add expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={pageStyles.container}>
      {/* Navigation Bar */}
      <nav style={pageStyles.nav}>
        <div style={pageStyles.navInner}>
          <div style={pageStyles.logo}>
            <span style={{ fontSize: '1.8rem' }}>💰</span>
            <span>ExpenseTracker</span>
          </div>
          <div style={pageStyles.navLinks}>
            <Link to="/home" style={pageStyles.link}>Home</Link>
            <Link to="/dashboard" style={pageStyles.link}>Dashboard</Link>
            <Link to="/login" style={pageStyles.link}>Login</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={pageStyles.main}>
        <div style={pageStyles.formCard}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 style={pageStyles.heading}>Add a New Expense</h1>
            <p style={pageStyles.subHeading}>Fill out the details below to track your spending.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label htmlFor="amount" style={styles.label}>Amount</label>
                <input 
                  type="number" 
                  step="0.01"
                  id="amount" 
                  name="amount" 
                  value={form.amount} 
                  onChange={handleChange} 
                  placeholder="e.g., 45.99" 
                  required 
                  style={styles.input} 
                  className="form-input" 
                />
              </div>

              <div>
                <label htmlFor="category" style={styles.label}>Category</label>
                <input 
                  type="text" 
                  id="category" 
                  name="category" 
                  value={form.category} 
                  onChange={handleChange} 
                  placeholder="e.g., Food, Transport" 
                  required 
                  style={styles.input} 
                  className="form-input" 
                />
              </div>

              <div>
                <label htmlFor="vendor" style={styles.label}>Vendor</label>
                <input 
                  type="text" 
                  id="vendor" 
                  name="vendor" 
                  value={form.vendor} 
                  onChange={handleChange} 
                  placeholder="e.g., Starbucks" 
                  required 
                  style={styles.input} 
                  className="form-input" 
                />
              </div>

              <div>
                <label htmlFor="expense_date" style={styles.label}>Expense Date</label>
                <input 
                  type="date" 
                  id="expense_date" 
                  name="expense_date" 
                  value={form.expense_date} 
                  onChange={handleChange} 
                  required 
                  style={styles.input} 
                  className="form-input" 
                />
              </div>

              <div>
                <label style={styles.label}>Upload Receipt (Optional)</label>
                <div style={styles.fileInputWrapper}>
                  <label htmlFor="receipt-upload" style={styles.fileUploadLabel}>
                    Choose File
                  </label>
                  <input 
                    type="file" 
                    id="receipt-upload" 
                    onChange={handleFileChange} 
                    accept="image/*,.pdf"
                    style={{ display: 'none' }} 
                  />
                  <span style={{ color: '#757575', marginLeft: '1rem' }}>{fileName}</span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting} 
                style={isSubmitting ? {...styles.button, ...styles.buttonDisabled} : styles.button}
              >
                {isSubmitting ? 'Submitting...' : 'Add Expense'}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer style={pageStyles.footer}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>© 2025 ExpenseTracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Styles remain the same
const pageStyles = {
  container: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#f5f5f5',
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  nav: {
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '0 2rem'
  },
  navInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '70px'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#212121',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  navLinks: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center'
  },
  link: {
    textDecoration: 'none',
    color: '#757575',
    fontWeight: '500'
  },
  main: {
    flex: '1',
    maxWidth: '700px',
    width: '100%',
    margin: '0 auto',
    padding: '3rem 2rem'
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    padding: '2.5rem',
  },
  heading: {
    fontSize: '2.25rem',
    fontWeight: '700',
    color: '#212121',
    margin: '0 0 0.5rem 0'
  },
  subHeading: {
    fontSize: '1rem',
    color: '#757575',
    margin: 0
  },
  footer: {
    backgroundColor: '#212121',
    color: '#a0a0a0',
    padding: '2.5rem 2rem',
    marginTop: 'auto'
  }
};

const styles = {
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#424242',
  },
  input: {
    width: '100%',
    padding: '0.875rem 1rem',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    fontSize: '1rem',
    backgroundColor: '#ffffff',
    color: '#212121',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    outline: 'none',
  },
  fileInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '0.5rem'
  },
  fileUploadLabel: {
    backgroundColor: '#eeeeee',
    color: '#424242',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.2s ease',
  },
  button: {
    width: '100%',
    backgroundColor: '#424242',
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
    backgroundColor: '#bdbdbd',
    cursor: 'not-allowed',
    boxShadow: 'none',
  }
};