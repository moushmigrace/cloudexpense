import React, { useState } from 'react';
import axios from '../services/api';
import { useNavigate, Link } from 'react-router-dom'; // Correctly import Link here
import './bill.css';

export default function Bill() {
  const [form, setForm] = useState({
    user_id: 1, // This should be dynamic in a real app
    amount: '',
    category: '',
    vendor: '',
    expense_date: '',
  });
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');
  const navigate = useNavigate();

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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(form).forEach(key => data.append(key, form[key]));
    if (file) {
      data.append('receipt', file);
    }

    try {
      await axios.post('/expense/add', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/home');
    } catch (error) {
      console.error("Error submitting the bill:", error);
    }
  };

  return (
    // Use a main container or React.Fragment to wrap the page
    <div className="page-wrapper">
      <header className="header">
        <div className="logo">💰 ExpenseTracker</div>
        <nav className="nav">
          <Link to="/home">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>
      
      <main className="main-content">
        <div className="bill-container">
          <h2>Add Bill</h2>
          <form onSubmit={handleSubmit} className="bill-form">
            
            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <input 
                type="number" 
                id="amount"
                name="amount" 
                placeholder="e.g., 150.50" 
                value={form.amount}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input 
                type="text" 
                id="category"
                name="category" 
                placeholder="e.g., Groceries" 
                value={form.category}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="vendor">Vendor</label>
              <input 
                type="text" 
                id="vendor"
                name="vendor" 
                placeholder="e.g., SuperMart" 
                value={form.vendor}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="expense_date">Date</label>
              <input 
                type="date" 
                id="expense_date"
                name="expense_date" 
                value={form.expense_date}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label>Upload Receipt (Optional)</label>
              <div className="file-input-wrapper">
                <label htmlFor="receipt-upload" className="file-upload-label">
                  Choose File
                </label>
                <input 
                  type="file" 
                  id="receipt-upload"
                  onChange={handleFileChange}
                />
                <span className="file-name">{fileName}</span>
              </div>
            </div>
            
            <button type="submit" className="submit-btn">Submit</button>
          </form>
        </div>
      </main>
    </div>
  );
}
