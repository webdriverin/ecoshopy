import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import Button from '../components/UI/Button';

const NotFound = () => {
    return (
        <div style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <div style={{
                color: '#EF4444',
                marginBottom: '1.5rem',
                backgroundColor: '#FEF2F2',
                padding: '1.5rem',
                borderRadius: '50%'
            }}>
                <AlertTriangle size={64} />
            </div>

            <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', color: '#1F2937' }}>404</h1>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>Page Not Found</h2>
            <p style={{ maxWidth: '500px', color: '#6B7280', marginBottom: '2rem', lineHeight: '1.6' }}>
                Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            <Link to="/" style={{ textDecoration: 'none' }}>
                <Button variant="primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Home size={20} />
                    Back to Home
                </Button>
            </Link>
        </div>
    );
};

export default NotFound;
