import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Eye } from 'lucide-react';
import './ProductGrid.css';

const ProductCard = ({ product }) => {
    // Calculate discount if original price exists
    const originalPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;
    const hasDiscount = originalPrice && originalPrice > product.price;
    const discount = hasDiscount ? Math.round(((originalPrice - product.price) / originalPrice) * 100) : 0;

    // 3D Tilt Logic
    const cardRef = useRef(null);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element.
        const y = e.clientY - rect.top;  // y position within the element.

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
        const rotateY = ((x - centerX) / centerX) * 10;

        setRotate({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
    };

    return (
        <div
            className="product-card card-3d-wrap"
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className="product-card-inner card-3d-content"
                style={{
                    transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`
                }}
            >


                <div className="product-image-wrapper">
                    <Link to={`/product/${product.id}`} className="product-image-container">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="product-image"
                            loading="lazy"
                        />
                    </Link>
                    {/* Quick View Overlay */}
                    <div className="product-overlay">
                        <button className="quick-view-btn">
                            <Eye size={16} /> Quick View
                        </button>
                    </div>
                </div>

                <div className="product-details">
                    <Link to={`/product/${product.id}`} className="product-title-link">
                        <h3 className="product-title" title={product.name}>
                            {product.name}
                        </h3>
                    </Link>

                    <div className="product-rating-container">
                        <div className="rating-badge">
                            <span>{product.rating || 4.5}</span>
                            <Star size={10} fill="white" stroke="none" />
                        </div>
                        <span className="review-count">({product.reviews || 120})</span>
                    </div>

                    <div className="product-price-container">
                        <div className="current-price">₹{product.price.toLocaleString()}</div>
                        {hasDiscount && (
                            <>
                                <div className="original-price">₹{originalPrice.toLocaleString()}</div>
                                <div className="discount-percentage">{discount}% off</div>
                            </>
                        )}
                    </div>

                    {product.isBestSeller && (
                        <div className="bestseller-tag">Best Seller</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
