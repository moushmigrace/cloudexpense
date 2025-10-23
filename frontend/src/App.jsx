import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Bill from './components/Bill';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute.jsx'; // 1. Import the gatekeeper
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <main className="main">
          <Routes>
            {/* Public routes that anyone can access */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />

            {/* 2. Wrap protected routes that require a user to be logged in */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bill"
              element={
                <ProtectedRoute>
                  <Bill />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
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