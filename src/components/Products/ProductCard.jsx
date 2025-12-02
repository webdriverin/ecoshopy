import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import Button from '../UI/Button';
import './ProductGrid.css';

const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
            <Link to={`/product/${product.id}`} className="product-image-container">
                <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                />
            </Link>

            <div className="product-details">
                <div className="product-category">
                    {product.category}
                </div>
                <Link to={`/product/${product.id}`}>
                    <h3 className="product-title">
                        {product.name}
                    </h3>
                </Link>

                <div className="product-rating">
                    <div className="stars">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} fill={i < product.rating ? "currentColor" : "none"} stroke="currentColor" />
                        ))}
                    </div>
                </div>
                <div className="product-footer">
                    <div className="product-price">
                        ₹{product.price.toFixed(2)}
                    </div>
                    <Button variant="primary" size="small" className="add-to-cart-btn">
                        <ShoppingCart size={18} />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
