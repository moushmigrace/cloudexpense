import React, { useState, useEffect } from 'react'; // 1. Import useEffect
import { useNavigate } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { 
  signIn, 
  signUp, 
  fetchAuthSession, 
  confirmSignIn, 
  confirmSignUp,
  resendSignUpCode
} from 'aws-amplify/auth';
import awsConfig from '../services/aws-config';

Amplify.configure(awsConfig);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [requireNewPassword, setRequireNewPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const navigate = useNavigate();

  // 2. Add useEffect to check for an existing session on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await fetchAuthSession();
        // If the above line doesn't throw, the user is already authenticated
        console.log("✅ User is already signed in. Redirecting to /home...");
        navigate('/home');
      } catch (err) {
        // This error means the user is not signed in, so we show the login page
        console.log("ℹ️ No active session found. Showing login page.");
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await signUp({
        username: email.toLowerCase().trim(), // Use email as the username for consistency
        password,
        options: {
          userAttributes: {
            email: email.toLowerCase().trim(), 
          }
        }
      });

      if (result.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
        setNeedsVerification(true);
        setSuccess('Account created! Please check your email for the verification code.');
      } else if (result.isSignUpComplete) {
        setSuccess('Account created successfully! You can now sign in.');
        setTimeout(() => {
          setIsSignUp(false);
          setSuccess('');
        }, 2000);
      }
    } catch (err) {
      console.error('❌ Sign-up error:', err);
      if (err.name === 'UsernameExistsException') {
        setError('An account with this email already exists');
      } else if (err.name === 'InvalidPasswordException') {
        setError('Password does not meet requirements');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const result = await confirmSignUp({
        username: email.toLowerCase().trim(),
        confirmationCode: verificationCode
      });

      if (result.isSignUpComplete) {
        setSuccess('Email verified successfully! You can now sign in.');
        setTimeout(() => {
          setIsSignUp(false);
          setNeedsVerification(false);
          setSuccess('');
          setVerificationCode('');
        }, 2000);
      }
    } catch (err) {
      console.error('❌ Verification error:', err);
      if (err.name === 'CodeMismatchException') {
        setError('Invalid verification code. Please try again.');
      } else if (err.name === 'ExpiredCodeException') {
        setError('Verification code has expired. Please request a new one.');
      } else {
        setError(err.message || 'Verification failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    try {
      await resendSignUpCode({ username: email.toLowerCase().trim() });
      setSuccess('A new verification code has been sent to your email.');
    } catch (err) {
      console.error('Error resending code:', err);
      setError('Failed to resend code. Please wait a moment and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
  
    try {
      const result = await signIn({
        username: email.toLowerCase().trim(),
        password
      });
  
      if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setRequireNewPassword(true);
        setIsSubmitting(false);
        return;
      }
  
      if (result.isSignedIn) {
        const uid = result.attributes?.sub || result.username || ''; 
        const token = result.signInUserSession?.idToken?.jwtToken || '';
      
        if (!uid || !token) {
          console.error('User ID or Token missing:', uid, token);
          return;
        }
      
        localStorage.setItem('userId', uid);
        localStorage.setItem('userToken', token);
        localStorage.setItem('userEmail', email.toLowerCase().trim());
      
        console.log('Saved userId:', localStorage.getItem('userId'));
        console.log('Saved userToken:', localStorage.getItem('userToken'));
      
        navigate('/dashboard');
      }
      
      
    } catch (err) {
      console.error('❌ Login error:', err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await confirmSignIn({
        challengeResponse: newPassword
      });

      if (result.isSignedIn) {
        navigate('/home');
      }
    } catch (err) {
      console.error('❌ Password update error:', err);
      setError('Failed to set new password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
      backgroundColor: '#f5f5f5',
      overflowY: 'auto',
      overflowX: 'hidden'
    }}>
      <>
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
              <a href="/home" style={{ textDecoration: 'none', color: '#757575', fontWeight: '500' }}>Home</a>
              <a href="/dashboard" style={{ textDecoration: 'none', color: '#757575', fontWeight: '500' }}>Dashboard</a>
              <a href="/login" style={{
                textDecoration: 'none',
                color: '#212121',
                fontWeight: '600',
                borderBottom: '2px solid #212121',
                paddingBottom: '0.25rem',
              }}>Login</a>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            padding: '2.5rem',
            maxWidth: '450px',
            width: '100%'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h1 style={{
                fontSize: '2.25rem',
                fontWeight: '700',
                color: '#212121',
                margin: '0 0 0.5rem 0'
              }}>
                {needsVerification ? 'Verify Your Email' : requireNewPassword ? 'Set New Password' : isSignUp ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p style={{ fontSize: '1rem', color: '#757575', margin: 0 }}>
                {needsVerification
                  ? 'Enter the verification code sent to your email.'
                  : requireNewPassword
                  ? 'Please set a new password to complete your first login.'
                  : isSignUp
                  ? 'Sign up to start tracking your expenses.'
                  : 'Sign in to continue to your dashboard.'}
              </p>
            </div>

            {success && <div style={styles.successBox}>{success}</div>}

            {needsVerification ? (
              <form onSubmit={handleVerification}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label htmlFor="verificationCode" style={styles.label}>Verification Code</label>
                    <input
                      type="text"
                      id="verificationCode"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      required
                      style={styles.input}
                      maxLength="6"
                    />
                  </div>

                  <div style={{ textAlign: 'center', marginTop: '-0.5rem' }}>
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={isSubmitting}
                      style={styles.linkButton}
                    >
                      Resend verification code
                    </button>
                  </div>
                  
                  {error && <div style={styles.errorBox}>{error}</div>}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={isSubmitting ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify Email'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNeedsVerification(false);
                      setIsSignUp(false);
                      setError('');
                      setSuccess('');
                    }}
                    style={styles.secondaryButton}
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            ) : !requireNewPassword && !isSignUp ? (
              <form onSubmit={handleLogin}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label htmlFor="email" style={styles.label}>Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label htmlFor="password" style={styles.label}>Password</label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      style={styles.input}
                    />
                  </div>
                  {error && <div style={styles.errorBox}>{error}</div>}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={isSubmitting ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
                  >
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                  </button>
                  <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <p style={{ color: '#757575', fontSize: '0.9rem' }}>
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setIsSignUp(true);
                          setError('');
                          setSuccess('');
                        }}
                        style={styles.linkButton}
                      >
                        Sign Up
                      </button>
                    </p>
                  </div>
                </div>
              </form>
            ) : !requireNewPassword && isSignUp ? (
              <form onSubmit={handleSignUp}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label htmlFor="signup-email" style={styles.label}>Email Address</label>
                    <input
                      type="email"
                      id="signup-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label htmlFor="signup-password" style={styles.label}>Password</label>
                    <input
                      type="password"
                      id="signup-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      style={styles.input}
                    />
                    <p style={{ fontSize: '0.85rem', color: '#757575', marginTop: '0.5rem' }}>
                      Password must be at least 8 characters
                    </p>
                  </div>
                  <div>
                    <label htmlFor="confirm-password" style={styles.label}>Confirm Password</label>
                    <input
                      type="password"
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      style={styles.input}
                    />
                  </div>
                  {error && <div style={styles.errorBox}>{error}</div>}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={isSubmitting ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
                  >
                    {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                  </button>
                  <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <p style={{ color: '#757575', fontSize: '0.9rem' }}>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setIsSignUp(false);
                          setError('');
                          setSuccess('');
                        }}
                        style={styles.linkButton}
                      >
                        Sign In
                      </button>
                    </p>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleNewPasswordSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label htmlFor="newPassword" style={styles.label}>New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      style={styles.input}
                    />
                    <p style={{ fontSize: '0.85rem', color: '#757575', marginTop: '0.5rem' }}>
                      Password must be at least 8 characters
                    </p>
                  </div>
                  {error && <div style={styles.errorBox}>{error}</div>}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={isSubmitting ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
                  >
                    {isSubmitting ? 'Updating...' : 'Set New Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer style={{
          backgroundColor: '#212121',
          color: '#a0a0a0',
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
      </>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const styles = {
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#424242'
  },
  input: {
    width: '100%',
    padding: '0.875rem 1rem',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    fontSize: '1rem',
    backgroundColor: '#ffffff',
    color: '#212121', // Corrected a typo here from '21212fs'
    transition: 'border-color 0.2s, box-shadow 0.2s',
    outline: 'none',
  },
  button: {
    width: '100%',
    backgroundColor: '#424242',
    color: '#fff',
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
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    color: '#424242',
    padding: '0.875rem 1.5rem',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#424242',
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 0,
  },
  errorBox: {
    backgroundColor: '#eeeeee',
    color: '#212121',
    border: '1px solid #e0e0e0',
    padding: '0.875rem 1rem',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  successBox: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    border: '1px solid #a5d6a7',
    padding: '0.875rem 1rem',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '0.9rem',
    fontWeight: '500',
    marginBottom: '1.5rem',
  },
};