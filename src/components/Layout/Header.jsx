import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User, Heart } from 'lucide-react';
import './Header.css';
import logo from '../../assets/logo.png';
import FirebaseService from '../../services/FirebaseService';
import { useCart } from '../../context/CartContext';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [tickers, setTickers] = useState([]);
    const { cart } = useCart();
    const location = useLocation();
    const navigate = useNavigate();

    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch Tickers
    useEffect(() => {
        const fetchTickers = async () => {
            try {
                const tickersData = await FirebaseService.getTickers();
                setTickers(tickersData.filter(t => t.status === 'Active'));
            } catch (error) {
                console.error("Error fetching tickers", error);
            }
        };
        fetchTickers();
    }, []);

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            if (searchTerm.trim()) {
                navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
                setIsMenuOpen(false);
            }
        }
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <>
            <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
                {/* Ticker Section */}
                {tickers.length > 0 && (
                    <div style={{
                        backgroundColor: tickers[0].backgroundColor || 'var(--color-primary)',
                        color: tickers[0].textColor || 'white',
                        textAlign: 'center',
                        padding: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        width: '100%'
                    }}>
                        {tickers[0].content}
                    </div>
                )}
                <div className="container header-container">
                    {/* Logo */}
                    <Link to="/" className="logo">
                        <img src={logo} alt="Ecoshopy" style={{ height: '50px', objectFit: 'contain' }} />
                    </Link>

                    {/* Desktop Search */}
                    <div className="search-bar">
                        <Search size={18} className="search-icon" onClick={handleSearch} style={{ cursor: 'pointer' }} />
                        <input
                            type="text"
                            placeholder="Search for eco-friendly products..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="nav-desktop">
                        <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
                        <Link to="/shop" className={`nav-link ${isActive('/shop')}`}>Shop</Link>
                        <Link to="/about" className={`nav-link ${isActive('/about')}`}>About</Link>
                        <Link to="/contact" className={`nav-link ${isActive('/contact')}`}>Contact</Link>
                    </nav>

                    {/* Actions */}
                    <div className="header-actions">
                        <Link to="/profile" className="action-btn" title="Account">
                            <User size={24} />
                        </Link>
                        <Link to="/profile" className="action-btn" title="Wishlist">
                            <Heart size={24} />
                        </Link>
                        <Link to="/cart" className="action-btn" title="Cart">
                            <ShoppingCart size={24} />
                            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
                        </Link>
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Drawer */}
                <div className={`nav-mobile ${isMenuOpen ? 'open' : ''}`}>
                    <div style={{ padding: '1rem 2rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                            <input
                                type="text"
                                placeholder="Search..."
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                    borderRadius: 'var(--radius-full)',
                                    border: '1px solid var(--color-border)',
                                    outline: 'none'
                                }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </div>
                    </div>
                    <Link to="/" className="nav-mobile-link">Home</Link>
                    <Link to="/shop" className="nav-mobile-link">Shop</Link>
                    <Link to="/about" className="nav-mobile-link">About</Link>
                    <Link to="/contact" className="nav-mobile-link">Contact</Link>
                    <Link to="/profile" className="nav-mobile-link">My Account</Link>
                </div>
            </header>
        </>
    );
};

export default Header;
