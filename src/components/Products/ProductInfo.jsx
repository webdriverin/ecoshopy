import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';
import { Star, Minus, Plus, ShoppingCart, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ProductInfo = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const handleQuantityChange = (type) => {
        if (type === 'decrease' && quantity > 1) {
            setQuantity(quantity - 1);
        } else if (type === 'increase' && quantity < (product.stock || 100)) {
            setQuantity(quantity + 1);
        }
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        toast.success('Added to cart!');
    };

    const handleBuyNow = () => {
        addToCart(product, quantity);
        navigate('/checkout');
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
                        <Star key={i} size={20} fill={i < (product.rating || 0) ? "currentColor" : "none"} stroke="currentColor" />
                    ))}
                </div>
                <span className="review-count">({product.reviews || 0} reviews)</span>
            </div>

            <div className="product-price">
                {product.mrp && Number(product.mrp) > Number(product.price) ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                            <span style={{ color: '#CC0C39', fontSize: '1.5rem', fontWeight: '300' }}>
                                -{Math.round(((Number(product.mrp) - Number(product.price)) / Number(product.mrp)) * 100)}%
                            </span>
                            <span style={{ fontSize: '1.75rem', fontWeight: '500' }}>
                                <sup style={{ fontSize: '0.875rem', top: '-0.5em' }}>₹</sup>
                                {Number(product.price).toLocaleString('en-IN')}
                            </span>
                        </div>
                        <div style={{ color: '#565959', fontSize: '0.875rem' }}>
                            M.R.P.: <span style={{ textDecoration: 'line-through' }}>₹{Number(product.mrp).toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                ) : (
                    <span style={{ fontSize: '1.75rem', fontWeight: '500' }}>
                        <sup style={{ fontSize: '0.875rem', top: '-0.5em' }}>₹</sup>
                        {Number(product.price).toLocaleString('en-IN')}
                    </span>
                )}
            </div>



            <div className="actions-row">
                <div className="quantity-selector">
                    <button
                        onClick={() => handleQuantityChange('decrease')}
                        className="qty-btn"
                        disabled={quantity <= 1}
                    >
                        <Minus size={16} />
                    </button>
                    <div className="qty-value">{quantity}</div>
                    <button
                        onClick={() => handleQuantityChange('increase')}
                        className="qty-btn"
                        disabled={quantity >= (product.stock || 100)}
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                    <Button
                        variant="primary"
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        className="add-to-cart-btn"
                        style={{ flex: 1 }}
                    >
                        <ShoppingCart size={20} />
                        Add
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={handleBuyNow}
                        disabled={product.stock <= 0}
                        className="buy-now-btn"
                        style={{ flex: 1 }}
                    >
                        Buy Now
                    </Button>
                </div>

                <button
                    className="wishlist-btn"
                    title="Add to Wishlist"
                >
                    <Heart size={20} />
                </button>
            </div>

            <div className="product-accordions" style={{ marginTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
                <AccordionItem title="Product Information" defaultOpen={true}>
                    <p style={{ lineHeight: '1.6', color: 'var(--color-text-light)', marginBottom: '1rem' }}>
                        {product.description}
                    </p>
                    {product.keyFeatures && product.keyFeatures.length > 0 && (
                        <div style={{ marginTop: '1rem' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '1.2rem' }}>✨</span> Key Features
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {product.keyFeatures.map((feature, index) => (
                                    <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem', color: 'var(--color-text-main)' }}>
                                        <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>✓</span>
                                        <span style={{ lineHeight: '1.5' }}>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </AccordionItem>

                <AccordionItem title="Shipping and Delivery">
                    {product.shippingInfo ? (
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                            {product.shippingInfo}
                        </p>
                    ) : (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ padding: '0.75rem', backgroundColor: '#F3F4F6', borderRadius: '50%' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                                </div>
                                <div>
                                    <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Free Shipping</p>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>On all orders over ₹500</p>
                                </div>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', lineHeight: '1.6' }}>
                                We aim to deliver your order within 3-5 business days. All products are packaged in eco-friendly, biodegradable materials.
                            </p>
                        </>
                    )}
                </AccordionItem>

                <AccordionItem title="Additional Information">
                    <div className="product-meta-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                        <div>
                            <span style={{ color: 'var(--color-text-light)' }}>SKU:</span>
                            <span style={{ marginLeft: '0.5rem', fontWeight: '500' }}>{product.sku}</span>
                        </div>
                        <div>
                            <span style={{ color: 'var(--color-text-light)' }}>Category:</span>
                            <span style={{ marginLeft: '0.5rem', fontWeight: '500' }}>{product.category}</span>
                        </div>
                        {product.attributes && product.attributes.map((attr, index) => (
                            <div key={index}>
                                <span style={{ color: 'var(--color-text-light)' }}>{attr.key}:</span>
                                <span style={{ marginLeft: '0.5rem', fontWeight: '500' }}>{attr.value}</span>
                            </div>
                        ))}
                    </div>
                </AccordionItem>

                {/* Custom Sections */}
                {product.customSections && product.customSections.map((section, index) => (
                    <AccordionItem key={index} title={section.title}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                            {section.content}
                        </p>
                    </AccordionItem>
                ))}
            </div>

        </div >
    );
};

const AccordionItem = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div style={{ borderBottom: '1px solid var(--color-border)' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.25rem 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: 'var(--color-text-main)'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* Icon based on title could go here */}
                    {title === 'Product Information' && <span style={{ fontSize: '1.2rem' }}>📦</span>}
                    {title === 'Shipping and Delivery' && <span style={{ fontSize: '1.2rem' }}>🚚</span>}
                    {title === 'Additional Information' && <span style={{ fontSize: '1.2rem' }}>📄</span>}
                    {title}
                </div>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {isOpen && (
                <div style={{ paddingBottom: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
                    {children}
                </div>
            )}
        </div>
    );
};

export default ProductInfo;
