import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Star } from 'lucide-react';
import FirebaseService from '../../services/FirebaseService';
import './FeaturedProducts.css';

const FeaturedProducts = ({ hideHeader = false }) => {
    const scrollContainerRef = useRef(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await FirebaseService.getFeaturedProducts();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching featured products", error);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const containerCenter = container.scrollLeft + container.clientWidth / 2;
            const children = Array.from(container.children);

            children.forEach((child) => {
                // Skip padding divs or non-card elements
                if (!child.classList.contains('featured-product-card-wrapper')) return;

                const childCenter = child.offsetLeft + child.clientWidth / 2;
                const distance = containerCenter - childCenter;
                const normalizedDistance = distance / (container.clientWidth / 2); // -1 to 1 roughly

                // Tuned for better mobile visibility
                let rotateY = normalizedDistance * 35;
                // Clamp rotation
                rotateY = Math.max(-50, Math.min(50, rotateY));

                const scale = Math.max(0.85, 1 - Math.abs(normalizedDistance) * 0.2);
                const opacity = Math.max(0.7, 1 - Math.abs(normalizedDistance) * 0.4);
                const zIndex = 100 - Math.round(Math.abs(normalizedDistance) * 100);

                child.style.transform = `perspective(1000px) rotateY(${rotateY}deg) scale(${scale})`;
                child.style.zIndex = zIndex;
                child.style.opacity = opacity;
            });
        };

        container.addEventListener('scroll', handleScroll);
        // Initial calculation
        handleScroll();

        return () => container.removeEventListener('scroll', handleScroll);
    }, [products.length]);

    return (
        <section className={`featured-products-section ${hideHeader ? 'no-padding' : ''}`}>
            <div className="container">
                {!hideHeader && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 className="section-title" style={{ margin: 0, textAlign: 'left' }}>Trending Now</h2>
                        <Link to="/shop" style={{ textDecoration: 'none' }}>
                            <button style={{
                                padding: '0.5rem 1rem',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                backgroundColor: 'var(--color-secondary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer'
                            }}>
                                View All <ArrowRight size={16} />
                            </button>
                        </Link>
                    </div>
                )}

                <div className="featured-scroll-container" ref={scrollContainerRef}>
                    {products.map(product => (
                        <div key={product.id} className="featured-product-card-wrapper" style={{ transition: 'transform 0.1s ease-out, opacity 0.1s ease-out' }}>
                            <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', height: '100%', display: 'block' }}>
                                <div className="featured-3d-card">
                                    <div className="featured-image-container">
                                        <img src={product.image} alt={product.name} className="featured-image" />
                                        <div className="featured-cart-icon">
                                            <ShoppingCart size={20} color="var(--color-primary)" />
                                        </div>
                                    </div>
                                    <div className="featured-details">
                                        <div className="featured-category">{product.category}</div>
                                        <h3 className="featured-title">{product.name}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                            <div style={{ display: 'flex', color: '#FBBF24' }}>
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} stroke="currentColor" />
                                                ))}
                                            </div>
                                            <span style={{ fontSize: '0.8rem', color: '#888', marginLeft: '0.5rem' }}>({product.reviews})</span>
                                        </div>
                                        <div className="featured-price">
                                            ₹{product.price.toFixed(2)}
                                            {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                                                <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.8em', marginLeft: '0.5rem' }}>
                                                    ₹{Number(product.originalPrice).toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                    {/* Padding divs to allow scrolling to ends */}
                    <div style={{ flex: '0 0 30%' }}></div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
