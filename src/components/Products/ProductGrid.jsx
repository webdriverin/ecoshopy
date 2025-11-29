import React from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const ProductGrid = ({ products }) => {
    if (products.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontSize: '1.125rem', color: 'var(--color-text-light)' }}>No products found matching your criteria.</p>
            </div>
        );
    }

    return (
        <div className="grid-products">
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;
