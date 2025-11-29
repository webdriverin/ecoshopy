import React from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const RelatedProducts = ({ products }) => {
    return (
        <section style={{ marginTop: '4rem' }}>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>Related Products</h2>
            <div className="grid-products">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
};

export default RelatedProducts;
