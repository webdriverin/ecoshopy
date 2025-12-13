import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/UI/Button';
import { signInWithGoogle, loginWithEmailAndPassword, resendVerificationEmail } from '../services/authService';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showResend, setShowResend] = useState(false);
    const [resendMessage, setResendMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setShowResend(false);
        setResendMessage('');

        try {
            await loginWithEmailAndPassword(email, password);
            const from = location.state?.from || '/profile';
            navigate(from);
        } catch (error) {
            console.error("Login failed", error);
            if (error.message.includes("verify your email")) {
                setError(error.message);
                setShowResend(true);
            } else if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                navigate('/signup', { state: { message: "Account not found. Please Sign Up." } });
            } else {
                setError("Login failed: " + error.message);
            }
        }
    };

    const handleResendEmail = async () => {
        try {
            await resendVerificationEmail();
            setResendMessage("Verification email sent! Please check your inbox and spam folder.");
            setShowResend(false);
        } catch (err) {
            console.error("Error resending email", err);
            // Show the actual error message to the user for debugging
            setResendMessage("Error: " + err.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle();
            const from = location.state?.from || '/profile';
            navigate(from);
        } catch (error) {
            console.error("Google login failed", error);
            setError("Google login failed. Please try again.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}
                {resendMessage && (
                    <div className="alert alert-success">
                        {resendMessage}
                    </div>
                )}

                {showResend && (
                    <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                        <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
                            Didn't receive the email?
                        </p>
                        <button
                            type="button"
                            onClick={handleResendEmail}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--color-primary)',
                                fontWeight: '600',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                fontSize: '0.9rem'
                            }}
                        >
                            Resend Verification Email
                        </button>
                    </div>
                )}

                <h1 className="auth-title">Login</h1>

                <form onSubmit={handleLogin} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError('');
                            }}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                            className="form-input"
                        />
                    </div>

                    <Button variant="primary" type="submit" style={{ marginTop: '1rem', width: '100%' }}>Login</Button>
                </form>

                <div className="auth-divider">
                    <div className="divider-line"></div>
                    <span className="divider-text">OR</span>
                    <div className="divider-line"></div>
                </div>

                <button
                    type="button"
                    className="google-btn"
                    onClick={handleGoogleLogin}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Sign in with Google
                </button>

                <div className="auth-footer">
                    Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
