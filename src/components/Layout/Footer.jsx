import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Check } from 'lucide-react';
import FirebaseService from '../../services/FirebaseService';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email || !email.includes('@')) return;

        setStatus('loading');
        try {
            await FirebaseService.addNewsletterSubscriber(email);
            setStatus('success');
            setEmail('');
        } catch (error) {
            console.error("Newsletter subscription failed", error);
            setStatus('error');
        }
    };

    return (
        <footer style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '4rem 0 2rem', marginTop: 'auto' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
                    {/* Brand Section */}
                    <div>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.75rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                            Ecoshopy
                        </h3>
                        <p style={{ opacity: 0.9, lineHeight: '1.6' }}>
                            Eco-friendly products for a sustainable lifestyle. Join us in making the world a greener place, one purchase at a time.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: '600' }}>Quick Links</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <li><Link to="/shop" className="footer-link">Shop</Link></li>
                            <li><Link to="/about" className="footer-link">About Us</Link></li>
                            <li><Link to="/contact" className="footer-link">Contact</Link></li>
                            <li><Link to="/profile" className="footer-link">My Account</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: '600' }}>Contact Us</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', opacity: 0.9 }}>
                            <p>WARD NO. 111, BUILDING NO. : 901<br />SWABAB NAGAR, MAIN ROAD,<br />ALATHUR. PALAKKAD. DT.</p>
                            <p>support@ecoshopy.com</p>
                            <p>8129633414, 8129416400</p>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: '600' }}>Newsletter</h4>
                        <p style={{ opacity: 0.9, marginBottom: '1rem' }}>Subscribe to get updates on new products and special offers.</p>

                        {status === 'success' ? (
                            <div style={{
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                padding: '1rem',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: '#4ade80'
                            }}>
                                <Check size={20} />
                                <span>Thanks for subscribing!</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe} style={{ position: 'relative' }}>
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={status === 'loading'}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 3rem 0.75rem 1rem',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        color: 'white',
                                        outline: 'none'
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    style={{
                                        position: 'absolute',
                                        right: '0.5rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: 'white',
                                        cursor: 'pointer',
                                        opacity: status === 'loading' ? 0.5 : 1
                                    }}
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <div style={{ marginTop: '4rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', opacity: 0.7, fontSize: '0.9rem' }}>
                    &copy; {new Date().getFullYear()} Ecoshopy. All rights reserved.
                </div>
            </div>
            <style>{`
                .footer-link {
                    color: white;
                    opacity: 0.8;
                    text-decoration: none;
                    transition: opacity 0.2s;
                }
                .footer-link:hover {
                    opacity: 1;
                }
            `}</style>
        </footer>
    );
};

export default Footer;
