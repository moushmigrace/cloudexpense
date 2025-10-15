import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Amplify } from 'aws-amplify';     // named import
import * as Auth from '@aws-amplify/auth';
import './login.css';
import awsConfig from '../services/aws-config'; // default export

Amplify.configure(awsConfig);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      await Auth.signIn(email, password);
      navigate('/home');
    } catch (error) {
        navigate('/home');
      console.error(error);
      alert('Login failed');
      

    }
    
  };

  return (
    <div className="login-page">
        <header className="header">
        <div className="logo">💰 ExpenseTracker</div>
        
      </header>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
