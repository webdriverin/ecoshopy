import React from 'react';
import Button from '../UI/Button';

import FirebaseService from '../../services/FirebaseService';

const ProductFilters = ({ filters, onFilterChange, onClearFilters }) => {
    const [categories, setCategories] = React.useState(['All']);

    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await FirebaseService.getCategories();
                const categoryNames = ['All', ...data.map(c => c.name)];
                setCategories(categoryNames);
            } catch (error) {
                console.error("Error fetching categories", error);
            }
        };
        fetchCategories();
    }, []);

    const priceRanges = [
        { label: 'All', value: 'all' },
        { label: 'Under ₹2000', value: '0-25' },
        { label: '₹2000 - ₹5000', value: '25-50' },
        { label: '₹5000 - ₹10000', value: '50-100' },
        { label: 'Over ₹10000', value: '100-plus' }
    ];

    return (
        <aside style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            height: 'fit-content'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Filters</h3>
                <button
                    onClick={onClearFilters}
                    style={{ fontSize: '0.875rem', color: 'var(--color-primary)', textDecoration: 'underline' }}
                >
                    Clear All
                </button>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Category</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {categories.map(cat => (
                        <li key={cat}>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="category"
                                    value={cat}
                                    checked={filters.category === cat}
                                    onChange={(e) => onFilterChange('category', e.target.value)}
                                    style={{ marginRight: '0.5rem', accentColor: 'var(--color-primary)' }}
                                />
                                <span style={{ color: filters.category === cat ? 'var(--color-primary)' : 'var(--color-text-main)' }}>
                                    {cat}
                                </span>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Price Range</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {priceRanges.map(range => (
                        <li key={range.value}>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="price"
                                    value={range.value}
                                    checked={filters.priceRange === range.value}
                                    onChange={(e) => onFilterChange('priceRange', e.target.value)}
                                    style={{ marginRight: '0.5rem', accentColor: 'var(--color-primary)' }}
                                />
                                <span>{range.label}</span>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default ProductFilters;
