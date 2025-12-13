import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import './Footer.css';

const Footer = () => {

    return (
        <footer className="footer" style={{ position: 'relative', marginTop: '4rem' }}>
            {/* Organic Wave Divider */}
            <div style={{ position: 'absolute', top: -48, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, zIndex: 1 }}>
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: '50px', transform: 'rotate(180deg)' }}>
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#1B4332"></path>
                </svg>
            </div>

            <div className="container">
                <div className="footer-container">
                    {/* About */}
                    <div className="footer-column">
                        <h3>About</h3>
                        <ul className="footer-links">
                            <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
                            <li><Link to="/about" className="footer-link">About Us</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Social */}
                    <div className="footer-column">
                        <h3>Contact Only</h3>
                        <div className="footer-address">
                            <p className="flex-center"><MapPin size={16} style={{ marginRight: '8px' }} /> Palakkad, Kerala</p>
                            <p className="flex-center"><Mail size={16} style={{ marginRight: '8px' }} /> hello@ecoshopy.com</p>

                            <a
                                href="https://api.whatsapp.com/send?phone=919745455589&text=Hi%20Ecoshopy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-link flex-center"
                                style={{ marginTop: '0.5rem', color: '#25D366' }}
                            >
                                <Phone size={16} style={{ marginRight: '8px' }} /> Chat on WhatsApp
                            </a>

                            <div className="social-icons" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                                <a href="#" className="social-icon"><Instagram size={24} /></a>
                                <a href="#" className="social-icon"><Facebook size={24} /></a>
                                <a href="#" className="social-icon"><Twitter size={24} /></a>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="footer-bottom">
                    <div>
                        &copy; {new Date().getFullYear()} Ecoshopy. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
