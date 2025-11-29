import React from 'react';
import { useLocation } from 'react-router-dom';

const ModulePlaceholder = () => {
    const location = useLocation();
    const pathParts = location.pathname.split('/').filter(Boolean);
    const moduleName = pathParts[pathParts.length - 1].replace(/-/g, ' ').toUpperCase();
    const sectionName = pathParts[pathParts.length - 2]?.toUpperCase() || 'ADMIN';

    return (
        <div style={{
            padding: '3rem',
            textAlign: 'center',
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <h1 style={{ color: 'var(--color-text-light)', marginBottom: '1rem' }}>{sectionName}</h1>
            <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '2rem' }}>{moduleName}</h2>
            <p style={{ color: 'var(--color-text-light)', maxWidth: '500px' }}>
                This module is currently under development. Features for <strong>{moduleName}</strong> will be implemented here.
            </p>
        </div>
    );
};

export default ModulePlaceholder;
