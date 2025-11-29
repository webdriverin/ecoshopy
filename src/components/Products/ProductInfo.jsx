import React, { useState } from 'react';
import Button from '../UI/Button';
import { Star, Minus, Plus, ShoppingCart, Heart } from 'lucide-react';

const ProductInfo = ({ product }) => {
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (type) => {
        if (type === 'decrease' && quantity > 1) {
            setQuantity(quantity - 1);
        } else if (type === 'increase' && quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    return (
        <div className="product-info">
            <div className="product-category">
                {product.category}
            </div>
            <h1 className="product-title">
                {product.name}
            </h1>

            <div className="product-rating">
                <div className="stars">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={20} fill={i < product.rating ? "currentColor" : "none"} stroke="currentColor" />
                    ))}
                </div>
                <span className="review-count">({product.reviews} reviews)</span>
            </div>

            <div className="product-price">
                ${product.price.toFixed(2)}
            </div>

            <p className="product-description">
                {product.description}
            </p>

            <div className="availability">
                <div style={{ marginBottom: '0.5rem', fontWeight: '600' }}>Availability:</div>
                {product.stock > 0 ? (
                    <span className="in-stock">
                        <span className="stock-dot"></span>
                        In Stock ({product.stock} available)
                    </span>
                ) : (
                    <span style={{ color: 'var(--color-error)' }}>Out of Stock</span>
                )}
            </div>

            <div className="actions-row">
                <div className="quantity-selector">
                    <button
                        onClick={() => handleQuantityChange('decrease')}
                        className="qty-btn"
                        disabled={quantity === 1}
                    >
                        <Minus size={16} />
                    </button>
                    <span className="qty-value">{quantity}</span>
                    <button
                        onClick={() => handleQuantityChange('increase')}
                        className="qty-btn"
                        disabled={quantity === product.stock}
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <button className="add-to-cart-btn">
                    <ShoppingCart size={20} /> Add to Cart
                </button>

                <button className="wishlist-btn">
                    <Heart size={20} />
                </button>
            </div>

            <div className="product-meta">
                <div>SKU: {product.sku}</div>
                <div>Category: {product.category}</div>
            </div>
        </div>
    );
};

export default ProductInfo;
