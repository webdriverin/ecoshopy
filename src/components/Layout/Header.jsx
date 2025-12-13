import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User, ChevronDown, MapPin } from 'lucide-react';
import './Header.css';
import { useCart } from '../../context/CartContext';
import FirebaseService from '../../services/FirebaseService';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { cart } = useCart();
    const location = useLocation();
    const navigate = useNavigate();

    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [storeSettings, setStoreSettings] = useState({
        logo: '', // No default logo
        storeName: 'Ecoshopy',
        favicon: ''
    });

    // Fetch Store Settings (Logo, Favicon)
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settings = await FirebaseService.getStoreSettings();
                if (settings) {
                    setStoreSettings(prev => ({
                        ...prev,
                        ...settings,
                        logo: settings.logo || '' // Use fetched logo or empty
                    }));

                    // Update Favicon dynamically
                    if (settings.favicon) {
                        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
                        link.type = 'image/png';
                        link.rel = 'icon';
                        link.href = settings.favicon;
                        document.getElementsByTagName('head')[0].appendChild(link);
                    }

                    // Update Page Title dynamically
                    if (settings.storeName) {
                        document.title = settings.storeName;
                    }
                }
            } catch (error) {
                console.error("Error fetching store settings", error);
            }
        };
        fetchSettings();
    }, []);

    // Fetch all products for search
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await FirebaseService.getProducts();
                setAllProducts(products);
            } catch (error) {
                console.error("Error fetching products for search", error);
            }
        };
        fetchProducts();
    }, []);

    // Fetch Categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await FirebaseService.getCategories();
                // Take top 6 categories to fit the bar
                setCategories(data.slice(0, 6));
            } catch (error) {
                console.error("Error fetching categories", error);
            }
        };
        fetchCategories();
    }, []);

    const suggestions = React.useMemo(() => {
        if (searchTerm.trim() === '') return [];
        if (!allProducts) return [];
        return allProducts.filter(product =>
            product.name && (
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        ).slice(0, 5);
    }, [searchTerm, allProducts]);

    // Close menu when route changes
    useEffect(() => {
        // eslint-disable-next-line
        setIsMenuOpen(false);
        setShowSuggestions(false);
    }, [location]);

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            if (searchTerm.trim()) {
                navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
                setIsMenuOpen(false);
                setShowSuggestions(false);
            }
        }
    };

    return (
        <header className="header">
            {/* 1. Top Bar (Dark Green) */}
            <div className="header-top-bar">
                <div className="container header-top-container">
                    <div className="header-top-links">
                        <Link to="/contact">24/7 Support</Link>
                    </div>
                    <div className="header-top-links">
                        <Link to="/profile">My Account</Link>
                        <Link to="/orders">Track Order</Link>
                    </div>
                </div>
            </div>

            {/* 2. Main Header (Green) */}
            <div className="header-main">
                <div className="container header-main-container">
                    {/* Logo & Menu */}
                    <div className="header-brand">
                        <Link to="/" className="logo">
                            {storeSettings.logo ? (
                                <img src={storeSettings.logo} alt={storeSettings.storeName} className="logo-image" style={{ height: '50px', objectFit: 'contain' }} />
                            ) : (
                                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white', letterSpacing: '1px' }}>
                                    {storeSettings.storeName.toUpperCase().slice(0, 3)}<span style={{ color: 'var(--color-secondary)' }}>{storeSettings.storeName.toUpperCase().slice(3)}</span>
                                </span>
                            )}
                        </Link>
                        <button className="menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <Menu size={24} />
                            <span>Menu</span>
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="header-search">
                        <div className="search-input-wrapper">
                            <input
                                type="text"
                                placeholder="Search for products, brands and more..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onKeyDown={handleSearch}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            />
                            <button className="search-icon-btn" onClick={handleSearch}>
                                <Search size={20} />
                            </button>
                        </div>
                        {showSuggestions && (
                            <div className="search-suggestions">
                                {searchTerm.length > 0 ? (
                                    suggestions.length > 0 ? (
                                        suggestions.map((product) => (
                                            <div
                                                key={product.id}
                                                className="suggestion-item"
                                                onClick={() => {
                                                    setSearchTerm(product.name);
                                                    navigate(`/product/${product.id}`);
                                                    setShowSuggestions(false);
                                                }}
                                            >
                                                <img
                                                    src={product.image || product.images?.[0] || 'https://via.placeholder.com/40'}
                                                    alt={product.name}
                                                    className="suggestion-image"
                                                />
                                                <div className="suggestion-details">
                                                    <span className="suggestion-name">{product.name}</span>
                                                    <span className="suggestion-category">{product.category}</span>
                                                </div>
                                                <span className="suggestion-price">₹{product.price}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-suggestions">No products found</div>
                                    )
                                ) : (
                                    // Trending / Recent Searches (Optional)
                                    <div className="trending-searches">
                                        <span className="trending-title">Trending Now</span>
                                        <div className="trending-tags">
                                            {categories.length > 0 ? (
                                                categories.map(cat => (
                                                    <span
                                                        key={cat.id}
                                                        className="trending-tag"
                                                        onClick={() => {
                                                            setSearchTerm(cat.name);
                                                            navigate(`/shop?category=${encodeURIComponent(cat.name)}`);
                                                            setShowSuggestions(false);
                                                        }}
                                                    >
                                                        {cat.name}
                                                    </span>
                                                ))
                                            ) : (
                                                // Fallback if no categories
                                                ['New Arrivals', 'Best Sellers', 'Deals'].map(tag => (
                                                    <span
                                                        key={tag}
                                                        className="trending-tag"
                                                        onClick={() => {
                                                            setSearchTerm(tag);
                                                            navigate(`/shop?search=${encodeURIComponent(tag)}`);
                                                            setShowSuggestions(false);
                                                        }}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Store & Cart */}
                    <div className="header-actions">
                        <Link to="/cart" className="header-cart">
                            <ShoppingCart size={24} />
                            <span className="cart-label">Cart</span>
                            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
                        </Link>
                    </div>
                </div>
            </div>

            {/* 3. Bottom Navigation (Blue Border Top) */}
            <div className="header-bottom">
                <div className="container header-bottom-container">
                    <nav className="header-nav">
                        {categories.length > 0 ? (
                            categories.map(cat => (
                                <Link key={cat.id} to={`/shop?category=${encodeURIComponent(cat.name)}`}>
                                    {cat.name}
                                </Link>
                            ))
                        ) : (
                            // Fallback if no categories yet
                            <>
                                <Link to="/shop">All Products</Link>
                                <Link to="/shop?sort=new">New Arrivals</Link>
                            </>
                        )}
                        <Link to="/shop?sort=deals" style={{ color: 'var(--color-secondary-dark)' }}>Deals</Link>
                    </nav>
                    <div className="header-account-links">
                        <div className="account-dropdown-trigger">
                            <User size={18} />
                            <span>{JSON.parse(localStorage.getItem('user') || '{}').displayName || 'Account'}</span>
                            <ChevronDown size={14} />

                            <div className="account-dropdown">
                                <div className="dropdown-arrow"></div>
                                {JSON.parse(localStorage.getItem('user') || '{}').uid ? (
                                    <div className="dropdown-header">
                                        <span>Welcome back!</span>
                                        <button
                                            onClick={() => {
                                                localStorage.removeItem('user');
                                                window.location.reload();
                                            }}
                                            className="dropdown-signin-btn"
                                            style={{ backgroundColor: '#EF4444', marginTop: '0.5rem', width: '100%', border: 'none', color: 'white', padding: '0.5rem', cursor: 'pointer', borderRadius: '4px' }}
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                ) : (
                                    <div className="dropdown-header">
                                        <span>Returning Customer?</span>
                                        <Link to="/login" className="dropdown-signin-btn">Sign In</Link>
                                    </div>
                                )}
                                <div className="dropdown-links">
                                    <Link to="/profile">My Profile</Link>
                                    <Link to="/orders">My Orders</Link>
                                    {/* <Link to="/wishlist">Saved Items</Link> */}
                                </div>
                            </div>
                        </div>
                        {/* <Link to="/orders">Order Status</Link> */}
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <div className={`nav-mobile ${isMenuOpen ? 'open' : ''}`}>
                <div className="nav-mobile-header">
                    <div className="user-info">
                        <span className="logo-text-large">ECO</span>
                        <span className="logo-text-small">SHOPY</span>
                    </div>
                    <button className="mobile-close-btn" onClick={() => setIsMenuOpen(false)}>
                        <X size={24} color="white" />
                    </button>
                </div>
                <div className="nav-mobile-content">
                    <Link to="/" className="nav-mobile-item">Home</Link>
                    <Link to="/shop" className="nav-mobile-item">Deals</Link>
                    <Link to="/shop" className="nav-mobile-item">Support</Link>
                    <Link to="/profile" className="nav-mobile-item">Account</Link>
                    <Link to="/cart" className="nav-mobile-item">Cart</Link>
                </div>
            </div>
            {isMenuOpen && <div className="menu-overlay" onClick={() => setIsMenuOpen(false)}></div>}
        </header>
    );
};

export default Header;
