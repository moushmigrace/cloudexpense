import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

export default function Home() {
  const [allExpenses, setAllExpenses] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    vendor: '',
    minAmount: '',
    maxAmount: '',
    startDate: '',
    endDate: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get('/expense/all');
        setAllExpenses(res.data);
        setExpenses(res.data);
      } catch (err) {
        console.error('Error fetching expenses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const handleOpenModal = (receiptUrl) => {
    setSelectedReceipt(receiptUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReceipt(null);
  };

  const applyFilters = () => {
    let filtered = allExpenses;

    if (filters.category) {
      filtered = filtered.filter(exp =>
        exp.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }
    if (filters.vendor) {
      filtered = filtered.filter(exp =>
        exp.vendor.toLowerCase().includes(filters.vendor.toLowerCase())
      );
    }
    if (filters.minAmount) {
      filtered = filtered.filter(exp => exp.amount >= parseFloat(filters.minAmount));
    }
    if (filters.maxAmount) {
      filtered = filtered.filter(exp => exp.amount <= parseFloat(filters.maxAmount));
    }
    if (filters.startDate) {
      filtered = filtered.filter(exp => new Date(exp.expense_date) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      filtered = filtered.filter(exp => new Date(exp.expense_date) <= new Date(filters.endDate));
    }

    setExpenses(filtered);
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      vendor: '',
      minAmount: '',
      maxAmount: '',
      startDate: '',
      endDate: ''
    });
    setExpenses(allExpenses);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await axios.delete(`/expense/${id}`);
      const updatedExpenses = allExpenses.filter(exp => exp.id !== id);
      setAllExpenses(updatedExpenses);
      setExpenses(updatedExpenses);
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  };

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <div style={styles.logo}>
            <span style={{ fontSize: '1.8rem' }}>💰</span>
            <span>ExpenseTracker</span>
          </div>
          <div style={styles.navLinks}>
            <Link to="/home" style={styles.navLinkActive}>Home</Link>
            <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
            <Link to="/login" style={styles.navLink}>Login</Link>
          </div>
        </div>
      </nav>

      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Your Expenses</h1>
            <p style={styles.subtitle}>Track and manage all your expenses in one place</p>
          </div>
          <Link to="/bill" style={styles.addExpenseBtn}>
            <span style={{ fontSize: '1.2rem' }}>+</span> Add Expense
          </Link>
        </div>

        {/* Filters */}
        <div style={styles.filters}>
          <input placeholder="Category" value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})} style={styles.filterInput}/>
          <input placeholder="Vendor" value={filters.vendor} onChange={e => setFilters({...filters, vendor: e.target.value})} style={styles.filterInput}/>
          <input placeholder="Min Amount" type="number" value={filters.minAmount} onChange={e => setFilters({...filters, minAmount: e.target.value})} style={styles.filterInput}/>
          <input placeholder="Max Amount" type="number" value={filters.maxAmount} onChange={e => setFilters({...filters, maxAmount: e.target.value})} style={styles.filterInput}/>
          <input type="date" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} style={styles.filterInput}/>
          <input type="date" value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})} style={styles.filterInput}/>
          <button onClick={applyFilters} style={styles.filterBtn}>Apply</button>
          <button onClick={resetFilters} style={styles.filterBtn}>Reset</button>
        </div>

        {loading && (
          <div style={styles.centeredMessage}>
            <div style={styles.spinner}></div>
            <p style={{ marginTop: '1.5rem', color: '#757575', fontSize: '1rem' }}>Loading your expenses...</p>
          </div>
        )}

        {!loading && expenses.length === 0 && (
          <div style={styles.emptyStateCard}>
            <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>📊</div>
            <h2 style={styles.h2}>No expenses yet</h2>
            <p style={styles.emptyStateText}>Start tracking your finances by adding your first expense</p>
            <Link to="/bill" style={styles.addExpenseBtn}>Get Started</Link>
          </div>
        )}

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
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp, index) => (
                    <tr key={exp.id} style={{ borderBottom: '1px solid #e0e0e0', backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={styles.td}>${exp.amount}</td>
                      <td style={styles.td}>{exp.category}</td>
                      <td style={styles.td}>{exp.vendor}</td>
                      <td style={styles.td}>{new Date(exp.expense_date).toLocaleDateString()}</td>
                      <td style={styles.td}>
                        {exp.receipt ? (
                          <button onClick={() => handleOpenModal(exp.receipt)} style={styles.receiptLink}>
                            View →
                          </button>
                        ) : <span style={{ color: '#bdbdbd' }}>N/A</span>}
                      </td>
                      <td style={styles.td}>
                        <FaTrash style={{ cursor: 'pointer', color: 'red' }} onClick={() => handleDelete(exp.id)}/>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>© 2025 ExpenseTracker. All rights reserved.</p>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#757575' }}>Manage your finances with ease</p>
        </div>
      </footer>

      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={handleCloseModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeButton} onClick={handleCloseModal}>×</button>
            <img src={selectedReceipt} alt="Receipt" style={{ width: '100%', height: 'auto' }} />
          </div>
        </div>
      )}

    </div>
  );
}

const styles = {
  page: { position: 'fixed', top:0, left:0, right:0, bottom:0, minHeight:'100vh', width:'100vw', display:'flex', flexDirection:'column', fontFamily:'system-ui, -apple-system, sans-serif', backgroundColor:'#f5f5f5', overflowY:'auto', overflowX:'hidden' },
  nav: { backgroundColor:'#fff', boxShadow:'0 2px 8px rgba(0,0,0,0.1)', padding:'0 2rem' },
  navInner: { maxWidth:'1200px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', height:'70px' },
  logo: { fontSize:'1.5rem', fontWeight:'700', color:'#212121', display:'flex', alignItems:'center', gap:'0.5rem' },
  navLinks: { display:'flex', gap:'2rem', alignItems:'center' },
  navLink: { textDecoration:'none', color:'#757575', fontWeight:'500', fontSize:'1rem' },
  navLinkActive: { textDecoration:'none', color:'#212121', fontWeight:'600', fontSize:'1rem', borderBottom:'2px solid #212121', paddingBottom:'0.25rem' },
  main: { flex:'1', maxWidth:'1200px', width:'100%', margin:'0 auto', padding:'3rem 2rem' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2.5rem' },
  title: { fontSize:'2.5rem', fontWeight:'700', color:'#212121', margin:'0 0 0.5rem 0' },
  subtitle: { fontSize:'1rem', color:'#757575', margin:0 },
  addExpenseBtn: { backgroundColor:'#424242', color:'#fff', padding:'0.875rem 2rem', borderRadius:'10px', textDecoration:'none', fontSize:'1rem', fontWeight:'600', boxShadow:'0 4px 12px rgba(0,0,0,0.2)', display:'inline-flex', alignItems:'center', gap:'0.5rem', cursor:'pointer' },
  filters: { display:'flex', flexWrap:'wrap', gap:'1rem', marginBottom:'1.5rem' },
  filterInput: { padding:'0.5rem 1rem', borderRadius:'8px', border:'1px solid #ccc', minWidth:'120px' },
  filterBtn: { padding:'0.5rem 1rem', borderRadius:'8px', border:'none', backgroundColor:'#424242', color:'#fff', cursor:'pointer' },
  centeredMessage: { display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'5rem 0' },
  spinner: { width:'50px', height:'50px', border:'5px solid #e0e0e0', borderTop:'5px solid #424242', borderRadius:'50%', animation:'spin 1s linear infinite' },
  emptyStateCard: { textAlign:'center', padding:'5rem 2rem', backgroundColor:'#fff', borderRadius:'16px', boxShadow:'0 4px 12px rgba(0,0,0,0.05)' },
  h2: { fontSize:'1.75rem', fontWeight:'600', color:'#212121' },
  emptyStateText: { color:'#757575', fontSize:'1.1rem', marginBottom:'2rem' },
  tableContainer: { backgroundColor:'#fff', borderRadius:'16px', boxShadow:'0 4px 12px rgba(0,0,0,0.05)', overflow:'hidden' },
  table: { width:'100%', borderCollapse:'collapse', minWidth:'600px' },
  tableHeaderRow: { backgroundColor:'#f5f5f5', borderBottom:'2px solid #e0e0e0' },
  th: { padding:'1.25rem 1.5rem', textAlign:'left', fontSize:'0.875rem', fontWeight:'700', color:'#424242', textTransform:'uppercase' },
  td: { padding:'1.25rem 1.5rem', color:'#424242' },
  receiptLink: { color:'#424242', textDecoration:'none', fontWeight:'600', background:'none', border:'none', cursor:'pointer', padding:0, fontSize:'1rem' },
  footer: { backgroundColor:'#212121', color:'#a0a0a0', padding:'2.5rem 2rem', marginTop:'auto' },
  footerInner: { maxWidth:'1200px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { position: 'relative', padding: '20px', background: '#fff', borderRadius: '8px', maxWidth: '90%', maxHeight: '90%', overflow: 'auto' },
  closeButton: { position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' },
};