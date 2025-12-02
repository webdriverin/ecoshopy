import React, { useState } from 'react';
import Button from '../../components/UI/Button';
import { Search, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';

const POSSystem = () => {
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Dummy products
    const products = [
        { id: '1', name: 'Bamboo Toothbrush', price: 12.99 },
        { id: '2', name: 'Cotton Pads', price: 18.50 },
        { id: '3', name: 'Glass Water Bottle', price: 24.00 },
        { id: '4', name: 'Eco Tote Bag', price: 15.00 },
    ];

    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const updateQuantity = (id, delta) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
        }));
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 4rem)', gap: '2rem' }}>
            {/* Product Selection */}
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: 'var(--radius-lg)', border: 'none', boxShadow: 'var(--shadow-sm)' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', overflowY: 'auto', paddingBottom: '1rem' }}>
                    {filteredProducts.map(product => (
                        <div
                            key={product.id}
                            onClick={() => addToCart(product)}
                            style={{
                                backgroundColor: 'white',
                                padding: '1.5rem',
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: 'var(--shadow-sm)',
                                cursor: 'pointer',
                                transition: 'transform 0.1s',
                                ':hover': { transform: 'translateY(-2px)' }
                            }}
                        >
                            <div style={{ height: '100px', backgroundColor: '#F3F4F6', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}></div>
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{product.name}</h3>
                            <div style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>₹{product.price.toFixed(2)}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cart / Checkout */}
            <div style={{ flex: 1, backgroundColor: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <ShoppingCart size={24} />
                    <h2 style={{ fontSize: '1.25rem' }}>Current Order</h2>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                    {cart.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--color-text-light)', marginTop: '2rem' }}>Cart is empty</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {cart.map(item => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: '500' }}>{item.name}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>₹{item.price.toFixed(2)} x {item.quantity}</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <button onClick={() => updateQuantity(item.id, -1)} style={{ padding: '0.25rem', borderRadius: '50%', backgroundColor: '#F3F4F6' }}><Minus size={16} /></button>
                                        <span style={{ width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} style={{ padding: '0.25rem', borderRadius: '50%', backgroundColor: '#F3F4F6' }}><Plus size={16} /></button>
                                        <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: '0.5rem', color: 'var(--color-error)' }}><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ padding: '1.5rem', backgroundColor: '#F9FAFB', borderTop: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>
                    <Button variant="primary" style={{ width: '100%' }} disabled={cart.length === 0}>
                        Complete Order
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default POSSystem;
