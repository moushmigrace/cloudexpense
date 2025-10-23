import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';

// This component checks for a valid session BEFORE rendering its children
export default function ProtectedRoute({ children }) {
  const [authState, setAuthState] = useState({
    isChecking: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const session = await fetchAuthSession({ forceRefresh: false });
        const token = session.tokens?.idToken?.toString();
        
        if (token) {
          // User is authenticated
          setAuthState({
            isChecking: false,
            isAuthenticated: true,
          });
        } else {
          // No valid token
          setAuthState({
            isChecking: false,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        // If it throws an error, the user is not authenticated
        console.log('User is not authenticated');
        setAuthState({
          isChecking: false,
          isAuthenticated: false,
        });
      }
    };

    checkAuthState();
  }, []);

  // Show loading state while checking
  if (authState.isChecking) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #e0e0e0',
          borderTop: '5px solid #424242',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}></div>
        <p style={{ color: '#757575', fontSize: '1rem' }}>Verifying authentication...</p>
        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the protected content
  return children;
}