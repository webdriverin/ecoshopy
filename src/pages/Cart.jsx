import React, { useState } from 'react';
import CartItem from '../components/Cart/CartItem';
import CartSummary from '../components/Cart/CartSummary';
import { ShoppingBag } from 'lucide-react';
import Button from '../components/UI/Button';
import { Link } from 'react-router-dom';

const Cart = () => {
    // Dummy data
    const [cartItems, setCartItems] = useState([
        { id: '1', name: 'Bamboo Toothbrush Set', price: 12.99, category: 'Personal Care', quantity: 2, image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb6dcaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: '2', name: 'Reusable Cotton Pads', price: 18.50, category: 'Beauty', quantity: 1, image: 'https://images.unsplash.com/photo-1556228720-1957be83f304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
    ]);

    const updateQuantity = (id, newQuantity) => {
        setCartItems(items => items.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    const removeItem = (id) => {
        setCartItems(items => items.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cartItems.length === 0) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: 'var(--color-accent)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem'
                }}>
                    <ShoppingBag size={40} color="var(--color-primary)" />
                </div>
                <h1 style={{ marginBottom: '1rem' }}>Your Cart is Empty</h1>
                <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem' }}>Looks like you haven't added anything to your cart yet.</p>
                <Link to="/shop">
                    <Button variant="primary">Start Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '3rem 0' }}>
            <h1 style={{ marginBottom: '2rem' }}>Your Cart ({cartItems.length} items)</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cartItems.map(item => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onUpdateQuantity={updateQuantity}
                            onRemove={removeItem}
                        />
                    ))}
                </div>

                <CartSummary subtotal={subtotal} />
            </div>
        </div>
    );
};

export default Cart;
