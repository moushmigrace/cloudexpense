import React, { useState } from 'react';

export default function Bill() {
  const [form, setForm] = useState({
    amount: '',
    category: '',
    vendor: '',
    expense_date: '',
  });
  const [fileName, setFileName] = useState('No file chosen');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFileName(selectedFile ? selectedFile.name : 'No file chosen');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // In a real app, you would handle form submission here (e.g., API call)
    console.log('Form Submitted:', form);
    console.log('File:', fileName);
    // Simulate a network request
    setTimeout(() => {
      setIsSubmitting(false);
      console.log('Expense added successfully!');
      // Reset form or navigate away
      setForm({ amount: '', category: '', vendor: '', expense_date: '' });
      setFileName('No file chosen');
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
            color: '#212121',
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
            <a href="/login" className="nav-link" style={{ textDecoration: 'none', color: '#757575', fontWeight: '500' }}>Login</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        flex: '1',
        maxWidth: '700px',
        width: '100%',
        margin: '0 auto',
        padding: '3rem 2rem'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          padding: '2.5rem',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '700', color: '#212121', margin: '0 0 0.5rem 0' }}>Add a New Expense</h1>
            <p style={{ fontSize: '1rem', color: '#757575', margin: 0 }}>Fill out the details below to track your spending.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Form Group: Amount */}
              <div>
                <label htmlFor="amount" style={styles.label}>Amount</label>
                <input type="number" id="amount" name="amount" value={form.amount} onChange={handleChange} placeholder="e.g., 45.99" required style={styles.input} className="form-input" />
              </div>

              {/* Form Group: Category */}
              <div>
                <label htmlFor="category" style={styles.label}>Category</label>
                <input type="text" id="category" name="category" value={form.category} onChange={handleChange} placeholder="e.g., Food, Transport" required style={styles.input} className="form-input" />
              </div>

              {/* Form Group: Vendor */}
              <div>
                <label htmlFor="vendor" style={styles.label}>Vendor</label>
                <input type="text" id="vendor" name="vendor" value={form.vendor} onChange={handleChange} placeholder="e.g., Starbucks" required style={styles.input} className="form-input" />
              </div>
              
              {/* Form Group: Date */}
              <div>
                <label htmlFor="expense_date" style={styles.label}>Expense Date</label>
                <input type="date" id="expense_date" name="expense_date" value={form.expense_date} onChange={handleChange} required style={styles.input} className="form-input" />
              </div>

              {/* Form Group: File Upload */}
              <div>
                <label style={styles.label}>Upload Receipt (Optional)</label>
                <div style={styles.fileInputWrapper}>
                  <label htmlFor="receipt-upload" style={styles.fileUploadLabel} className="file-upload-label">
                    Choose File
                  </label>
                  <input type="file" id="receipt-upload" onChange={handleFileChange} style={{ display: 'none' }} />
                  <span style={{ color: '#757575', marginLeft: '1rem' }}>{fileName}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="submit-btn" disabled={isSubmitting} style={isSubmitting ? {...styles.button, ...styles.buttonDisabled} : styles.button}>
                {isSubmitting ? 'Submitting...' : 'Add Expense'}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#212121',
        color: '#a0a0a0',
        padding: '2.5rem 2rem',
        marginTop: 'auto'
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
        .submit-btn:hover:not(:disabled) {
          background-color: #616161 !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2) !important;
        }
        .file-upload-label:hover {
          background-color: #e0e0e0 !important;
        }
        .form-input:focus {
          border-color: #424242 !important;
          box-shadow: 0 0 0 3px rgba(66, 66, 66, 0.2) !important;
        }
        .form-input::placeholder {
          color: #bdbdbd;
        }
        input[type="date"] {
          color: #212121;
        }
        input[type="date"]:invalid {
          color: #bdbdbd;
        }
      `}</style>
    </div>
  );
}

// Grouped styles for cleaner JSX (Grayscale)
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

