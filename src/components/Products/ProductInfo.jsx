import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';
import { Star, Minus, Plus, ShoppingCart, Heart, ChevronDown, ChevronUp, Check, Package, Truck, FileText, Sparkles, Info } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ProductInfo = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    // Variant Logic
    const hasVariants = product.variants && product.variants.length > 0;
    const [selectedVariant, setSelectedVariant] = useState(null);

    useEffect(() => {
        if (hasVariants) {
            // Default to the first variant (usually the cheapest or base one)
            // eslint-disable-next-line
            setSelectedVariant(product.variants[0]);
        } else {
            setSelectedVariant(null);
        }
    }, [product.id, hasVariants, product.variants]);

    // Determine current price, mrp, and stock based on selection
    const currentPrice = selectedVariant ? selectedVariant.price : product.price;
    const currentMrp = selectedVariant ? selectedVariant.mrp : (product.originalPrice || product.mrp);
    const currentStock = selectedVariant ? selectedVariant.stock : product.stock;

    const handleQuantityChange = (type) => {
        const maxStock = parseInt(currentStock || 100);
        if (type === 'decrease' && quantity > 1) {
            setQuantity(quantity - 1);
        } else if (type === 'increase' && quantity < maxStock) {
            setQuantity(quantity + 1);
        }
    };

    const handleAddToCart = () => {
        const itemToAdd = {
            ...product,
            price: currentPrice,
            mrp: currentMrp,
            selectedVariant: selectedVariant // Pass variant info to cart
        };
        addToCart(itemToAdd, quantity);
        toast.success('Added to cart!');
    };

    const handleBuyNow = () => {
        const itemToAdd = {
            ...product,
            price: currentPrice,
            mrp: currentMrp,
            selectedVariant: selectedVariant
        };
        addToCart(itemToAdd, quantity);
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

            {product.sku && (
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginTop: '0.5rem' }}>
                    SKU: <span style={{ fontWeight: '600', color: 'var(--color-text-main)' }}>{product.sku}</span>
                </div>
            )}

            <div className="product-price">
                {currentMrp && Number(currentMrp) > Number(currentPrice) ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                            {(product.offerText || (Number(currentMrp) > Number(currentPrice))) && (
                                <span style={{ color: '#CC0C39', fontSize: '1.5rem', fontWeight: '300' }}>
                                    {product.offerText || `${Math.round(((Number(currentMrp) - Number(currentPrice)) / Number(currentMrp)) * 100)}% OFF`}
                                </span>
                            )}
                            <span style={{ fontSize: '1.75rem', fontWeight: '500' }}>
                                <sup style={{ fontSize: '0.875rem', top: '-0.5em' }}>₹</sup>
                                {Number(currentPrice).toLocaleString('en-IN')}
                            </span>
                        </div>
                        <div style={{ color: '#565959', fontSize: '0.875rem' }}>
                            M.R.P.: <span style={{ textDecoration: 'line-through' }}>₹{Number(currentMrp).toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                ) : (
                    <span style={{ fontSize: '1.75rem', fontWeight: '500' }}>
                        <sup style={{ fontSize: '0.875rem', top: '-0.5em' }}>₹</sup>
                        {Number(currentPrice).toLocaleString('en-IN')}
                    </span>
                )}
            </div>

            {/* Variant Selector */}
            {hasVariants && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Select Option:</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                        {product.variants.map((variant, index) => {
                            const isSelected = selectedVariant && selectedVariant.name === variant.name;
                            return (
                                <button
                                    key={index}
                                    onClick={() => setSelectedVariant(variant)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-md)',
                                        backgroundColor: isSelected ? '#F0FDF4' : 'white',
                                        color: isSelected ? 'var(--color-primary)' : 'var(--color-text-main)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        minWidth: '80px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <span style={{ fontWeight: '600' }}>{variant.name}</span>
                                    {/* Optional: Show price diff or actual price in button */}
                                    {/* <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>₹{variant.price}</span> */}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

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
                        disabled={quantity >= (parseInt(currentStock) || 100)}
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                    <Button
                        variant="primary"
                        onClick={handleAddToCart}
                        disabled={parseInt(currentStock) <= 0}
                        className="add-to-cart-btn"
                        style={{ flex: 1 }}
                    >
                        <ShoppingCart size={20} />
                        {parseInt(currentStock) <= 0 ? 'Out of Stock' : 'Add'}
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={handleBuyNow}
                        disabled={parseInt(currentStock) <= 0}
                        className="buy-now-btn"
                        style={{ flex: 1 }}
                    >
                        Buy Now
                    </Button>
                </div>


            </div>

            {/* Stock Status Message */}
            {parseInt(currentStock) < 10 && parseInt(currentStock) > 0 && (
                <div style={{ color: '#B12704', fontSize: '0.875rem', marginTop: '0.5rem', fontWeight: '500' }}>
                    Only {currentStock} left in stock - order soon.
                </div>
            )}

            <div className="product-accordions" style={{ marginTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
                <AccordionItem title="Product Information" icon={<Package size={20} />} defaultOpen={true}>
                    <p style={{ lineHeight: '1.6', color: 'var(--color-text-light)', marginBottom: '1rem' }}>
                        {product.description}
                    </p>
                    {product.keyFeatures && product.keyFeatures.length > 0 && (
                        <div style={{ marginTop: '1rem' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Sparkles size={18} color="var(--color-secondary-dark)" /> Key Features
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {product.keyFeatures.map((feature, index) => (
                                    <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem', color: 'var(--color-text-main)' }}>
                                        <Check size={16} color="var(--color-success)" style={{ marginTop: '4px' }} />
                                        <span style={{ lineHeight: '1.5' }}>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </AccordionItem>

                {product.shippingInfo && (
                    <AccordionItem title="Shipping and Delivery" icon={<Truck size={20} />}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                            {product.shippingInfo}
                        </p>
                    </AccordionItem>
                )}

                <AccordionItem title="Additional Information" icon={<FileText size={20} />}>
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
                    <AccordionItem key={index} title={section.title} icon={<Info size={20} />}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                            {section.content}
                        </p>
                    </AccordionItem>
                ))}
            </div>

        </div >
    );
};

const AccordionItem = ({ title, children, icon, defaultOpen = false }) => {
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
                    {icon && <span style={{ color: 'var(--color-primary)' }}>{icon}</span>}
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
