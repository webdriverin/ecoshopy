import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/Products/ProductGrid';
import ProductFilters from '../components/Products/ProductFilters';
import { Search, Filter, X } from 'lucide-react';
import FirebaseService from '../services/FirebaseService';
import './Shop.css';

const Shop = () => {
    const [searchParams] = useSearchParams();
    const initialSearch = searchParams.get('search') || '';

    const [allProducts, setAllProducts] = useState([]);
    const [filters, setFilters] = useState({
        category: 'All',
        priceRange: 'all'
    });
    const [sortBy, setSortBy] = useState('popular');
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await FirebaseService.getProducts();
                console.log("Fetched products from DB:", data);
                setAllProducts(data);
            } catch (error) {
                console.error("Error fetching products", error);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const search = searchParams.get('search');
        const category = searchParams.get('category');

        if (search !== null) {
            // eslint-disable-next-line
            setSearchQuery(search);
        }

        if (category !== null) {
            setFilters(prev => ({ ...prev, category: category }));
        }
    }, [searchParams]);

    const products = React.useMemo(() => {
        let result = [...allProducts];

        // Filter by Category
        if (filters.category !== 'All') {
            console.log("Filtering by category:", filters.category);
            result = result.filter(p => {
                const match = p.category?.toLowerCase().trim() === filters.category.toLowerCase().trim();
                console.log(`Product: ${p.name}, Category: '${p.category}', Match: ${match}`);
                return match;
            });
        }

        // Filter by Price
        if (filters.priceRange !== 'all') {
            const [min, max] = filters.priceRange.split('-').map(val => val === 'plus' ? Infinity : Number(val));
            if (max === Infinity) {
                result = result.filter(p => p.price >= min);
            } else {
                result = result.filter(p => p.price >= min && p.price <= max);
            }
        }

        // Filter by Search
        if (searchQuery) {
            result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        // Sort
        if (sortBy === 'price-low-high') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high-low') {
            result.sort((a, b) => b.price - a.price);
        } else {
            // Popular (default) - sort by rating/reviews
            result.sort((a, b) => b.reviews - a.reviews);
        }

        return result;
    }, [allProducts, filters, sortBy, searchQuery]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ category: 'All', priceRange: 'all' });
        setSearchQuery('');
        setSortBy('popular');
    };

    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [requestProduct, setRequestProduct] = useState('');
    const [requestEmail, setRequestEmail] = useState('');
    const [requestStatus, setRequestStatus] = useState('idle');

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        if (!requestProduct) return;

        setRequestStatus('loading');
        try {
            await FirebaseService.addProductRequest({
                productName: requestProduct,
                email: requestEmail || 'Anonymous'
            });
            setRequestStatus('success');
            setTimeout(() => {
                setIsRequestModalOpen(false);
                setRequestStatus('idle');
                setRequestProduct('');
                setRequestEmail('');
            }, 2000);
        } catch (error) {
            console.error("Request failed", error);
            setRequestStatus('error');
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div className="shop-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 style={{ margin: 0 }}>Shop All Products</h1>

                <div className="shop-controls">
                    <button
                        onClick={() => setIsRequestModalOpen(true)}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'var(--color-accent)',
                            color: 'var(--color-primary)',
                            border: '1px solid var(--color-primary)',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: '600',
                            cursor: 'pointer',
                            marginRight: '1rem'
                        }}
                    >
                        Request a Product
                    </button>

                    <div className="shop-search-container">
                        <Search size={20} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="shop-search-input"
                        />
                    </div>

                    <button
                        className="mobile-filter-toggle"
                        onClick={() => setIsMobileFilterOpen(true)}
                    >
                        <Filter size={20} />
                        Filters
                    </button>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="shop-sort-select"
                    >
                        <option value="popular">Sort by: Popular</option>
                        <option value="price-low-high">Price: Low to High</option>
                        <option value="price-high-low">Price: High to Low</option>
                    </select>
                </div>
            </div>

            <div className="shop-layout">
                {/* Overlay for mobile */}
                <div
                    className={`shop-overlay ${isMobileFilterOpen ? 'active' : ''}`}
                    onClick={() => setIsMobileFilterOpen(false)}
                ></div>

                <div className={`shop-sidebar ${isMobileFilterOpen ? 'active' : ''}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }} className="mobile-only-header">
                        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Filters</h2>
                        <button onClick={() => setIsMobileFilterOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>
                    </div>
                    <ProductFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={clearFilters}
                    />
                </div>

                <div className="shop-content">
                    <ProductGrid products={products} />
                </div>
            </div>

            {/* Request Modal */}
            {isRequestModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: 'var(--radius-lg)',
                        width: '90%',
                        maxWidth: '500px',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => setIsRequestModalOpen(false)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <X size={24} />
                        </button>

                        <h2 style={{ marginBottom: '1.5rem' }}>Request a Product</h2>

                        {requestStatus === 'success' ? (
                            <div style={{ textAlign: 'center', color: 'var(--color-success)', padding: '2rem 0' }}>
                                <h3 style={{ marginBottom: '0.5rem' }}>Request Sent!</h3>
                                <p>We'll look into adding this product soon.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Product Name / Description</label>
                                    <textarea
                                        required
                                        value={requestProduct}
                                        onChange={(e) => setRequestProduct(e.target.value)}
                                        placeholder="What product are you looking for?"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', minHeight: '100px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Your Email (Optional)</label>
                                    <input
                                        type="email"
                                        value={requestEmail}
                                        onChange={(e) => setRequestEmail(e.target.value)}
                                        placeholder="To get notified when it's available"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={requestStatus === 'loading'}
                                    style={{
                                        padding: '0.75rem',
                                        backgroundColor: 'var(--color-primary)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 'var(--radius-md)',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        opacity: requestStatus === 'loading' ? 0.7 : 1
                                    }}
                                >
                                    {requestStatus === 'loading' ? 'Sending...' : 'Submit Request'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Shop;
