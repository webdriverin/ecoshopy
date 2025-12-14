import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FirebaseService from '../../services/FirebaseService';
import './TrendingGrid.css';

const TrendingGrid = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // For now, just fetch all and slice, or fetch featured
                const allProducts = await FirebaseService.getFeaturedProducts();
                // Randomize or pick specific ones for "Trending"
                setProducts(allProducts.slice(0, 8));
            } catch (error) {
                console.error("Error fetching trending products", error);
            }
        };
        fetchProducts();
    }, []);

    if (products.length === 0) return null;

    return (
        <section className="trending-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Trending Now</h2>
                    <Link to="/shop?sort=trending" className="view-all-link">View All</Link>
                </div>
                <div className="trending-grid">
                    {products.map((product) => (
                        <Link key={product.id} to={`/product/${product.id}`} className="trending-card">
                            <div className="trending-image-wrapper">
                                <span className="trending-badge">Hot</span>
                                <img src={product.image} alt={product.name} className="trending-image" />
                                <div className="trending-overlay">
                                    <span className="shop-now-btn">Shop Now</span>
                                </div>
                            </div>
                            <div className="trending-info">
                                <h3 className="trending-name">{product.name}</h3>
                                <div className="trending-meta">
                                    <p className="trending-price">
                                        ₹{product.price}
                                        {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                                            <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.8em', marginLeft: '6px' }}>
                                                ₹{product.originalPrice}
                                            </span>
                                        )}
                                    </p>
                                    {product.rating > 0 && (
                                        <div className="trending-rating">
                                            <span className="star">★</span>
                                            <span className="rating-val">{product.rating}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrendingGrid;
