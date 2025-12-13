import React from 'react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/Cart/CartItem';
import CartSummary from '../components/Cart/CartSummary';
import { ShoppingBag } from 'lucide-react';
import Button from '../components/UI/Button';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();

    const subtotal = getCartTotal();

    if (cart.length === 0) {
        return (
            <div className="container empty-cart-container">
                <div className="empty-cart-icon">
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
        <div className="container cart-container">
            <h1 className="cart-title">Your Cart ({cart.length} items)</h1>

            <div className="cart-grid">
                <div className="cart-items">
                    {cart.map(item => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onUpdateQuantity={updateQuantity}
                            onRemove={removeFromCart}
                        />
                    ))}
                </div>

                <CartSummary subtotal={subtotal} />
            </div>
        </div>
    );
};

export default Cart;
