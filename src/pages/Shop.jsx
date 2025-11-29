import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/Products/ProductGrid';
import ProductFilters from '../components/Products/ProductFilters';
import { Search, Filter, X } from 'lucide-react';
import './Shop.css';

const allProducts = [
    { id: '1', name: 'Bamboo Toothbrush Set', price: 12.99, category: 'Personal Care', rating: 4.5, reviews: 128, image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb6dcaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '2', name: 'Reusable Cotton Pads', price: 18.50, category: 'Beauty', rating: 4.8, reviews: 85, image: 'https://images.unsplash.com/photo-1556228720-1957be83f304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '3', name: 'Glass Water Bottle', price: 24.00, category: 'Accessories', rating: 4.7, reviews: 210, image: 'https://images.unsplash.com/photo-1602143407151-01114192003f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '4', name: 'Eco-Friendly Tote Bag', price: 15.00, category: 'Fashion', rating: 4.6, reviews: 95, image: 'https://images.unsplash.com/photo-1597484662317-c93100d013ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '5', name: 'Organic Cotton T-Shirt', price: 35.00, category: 'Fashion', rating: 4.3, reviews: 45, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '6', name: 'Solar Power Bank', price: 45.99, category: 'Electronics', rating: 4.9, reviews: 320, image: 'https://images.unsplash.com/photo-1620778184568-d0554446542f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '7', name: 'Wooden Desk Organizer', price: 29.99, category: 'Home Products', rating: 4.4, reviews: 67, image: 'https://images.unsplash.com/photo-1502005229766-939760a7cb0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '8', name: 'Recycled Paper Notebook', price: 8.50, category: 'Home Products', rating: 4.2, reviews: 112, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
];

const Shop = () => {
    // Dummy data - in real app, fetch from Firestore
    const [searchParams] = useSearchParams();
    const initialSearch = searchParams.get('search') || '';

    const [filters, setFilters] = useState({
        category: 'All',
        priceRange: 'all'
    });
    const [sortBy, setSortBy] = useState('popular');
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    useEffect(() => {
        const search = searchParams.get('search');
        if (search !== null) {
            setSearchQuery(search);
        }
    }, [searchParams]);

    const products = React.useMemo(() => {
        let result = [...allProducts];

        // Filter by Category
        if (filters.category !== 'All') {
            result = result.filter(p => p.category === filters.category);
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
    }, [filters, sortBy, searchQuery]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ category: 'All', priceRange: 'all' });
        setSearchQuery('');
        setSortBy('popular');
    };

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div className="shop-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0 }}>Shop All Products</h1>

                <div className="shop-controls">
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
        </div>
    );
};

export default Shop;
