import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Header from './Header';
import '../../styles/index.css';

const Footer = () => (
    <footer style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '3rem 0', marginTop: 'auto' }}>
        <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                <div>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        Ecoshopy
                    </h3>
                    <p style={{ opacity: 0.9 }}>Eco-friendly products for a sustainable lifestyle. Join us in making the world a greener place.</p>
                </div>
                <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Quick Links</h4>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li><Link to="/shop" style={{ opacity: 0.9, transition: 'opacity 0.2s' }} onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0.9}>Shop</Link></li>
                        <li><Link to="/about" style={{ opacity: 0.9, transition: 'opacity 0.2s' }} onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0.9}>About Us</Link></li>
                        <li><Link to="/contact" style={{ opacity: 0.9, transition: 'opacity 0.2s' }} onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0.9}>Contact</Link></li>
                        <li><Link to="/profile" style={{ opacity: 0.9, transition: 'opacity 0.2s' }} onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0.9}>My Account</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Contact</h4>
                    <p style={{ opacity: 0.9, marginBottom: '0.5rem' }}>123 Eco Street, Green City</p>
                    <p style={{ opacity: 0.9, marginBottom: '0.5rem' }}>support@ecoshopy.com</p>
                    <p style={{ opacity: 0.9 }}>+1 (555) 123-4567</p>
                </div>
            </div>
            <div style={{ marginTop: '3rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1.5rem', opacity: 0.8, fontSize: '0.9rem' }}>
                &copy; {new Date().getFullYear()} Ecoshopy. All rights reserved.
            </div>
        </div>
    </footer>
);

const Layout = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
