import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FirebaseService from '../../services/FirebaseService';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import './NewArrivals.css';

const NewArrivals = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const allProducts = await FirebaseService.getProducts();
                // Get the last 4 products added
                const newProducts = allProducts.slice(-4).reverse();
                setProducts(newProducts);
            } catch (error) {
                console.error("Error fetching new arrivals", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading || products.length === 0) return null;

    return (
        <section className="new-arrivals-section">
            <div className="container">
                <div className="new-arrivals-header">
                    <div className="new-arrivals-title-group">
                        <h2>New Arrivals</h2>
                        <p className="new-arrivals-subtitle">The latest additions to our collection.</p>
                    </div>
                    <Link to="/shop?sort=new" className="view-all-btn">
                        View All <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                    </Link>
                </div>

                <div className="new-arrivals-grid">
                    {products.map(product => (
                        <Link
                            key={product.id}
                            to={`/product/${product.id}`}
                            className="new-arrival-card"
                        >
                            <div className="new-arrival-image-wrapper">
                                <img
                                    src={(product.images && product.images.length > 0) ? product.images[0] : (product.image || 'https://placehold.co/400')}
                                    alt={product.name}
                                    className="new-arrival-image"
                                />
                                <div className="new-badge">NEW</div>
                                <div className="quick-add-btn">
                                    <ShoppingBag size={18} color="#1a1a1a" />
                                </div>
                            </div>

                            <div className="new-arrival-info">
                                <h3>{product.name}</h3>
                                <div className="new-arrival-meta">
                                    <span className="new-arrival-category">{product.category}</span>
                                    <span className="new-arrival-price">
                                        ₹{product.price}
                                        {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                                            <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.8em', marginLeft: '5px' }}>
                                                ₹{product.originalPrice}
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewArrivals;
