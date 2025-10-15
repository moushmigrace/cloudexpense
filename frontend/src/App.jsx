import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Bill from './components/Bill';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app">
        

        <main className="main">
        <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/login" element={<Login />} />   {/* Add this */}
  <Route path="/home" element={<Home />} />
  <Route path="/bill" element={<Bill />} />
  <Route path="/dashboard" element={<Dashboard />} />
</Routes>

        </main>

        <footer className="footer">
          <div>© 2025 ExpenseTracker. All rights reserved.</div>
          <div className="footer-links">
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/privacy">Privacy Policy</a>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
