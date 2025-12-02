import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';
import { ArrowRight } from 'lucide-react';

const CartSummary = ({ subtotal, shipping = 0, tax = 0 }) => {
    const total = subtotal + shipping + tax;

    return (
        <div className="cart-summary">
            <h2 className="summary-title">Order Summary</h2>

            <div style={{ marginBottom: '1.5rem' }}>
                <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="summary-row">
                    <span>Tax</span>
                    <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="summary-total">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>
            </div>

            <Link to="/checkout" style={{ display: 'block' }}>
                <Button variant="primary" className="checkout-btn">
                    Proceed to Checkout <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
                </Button>
            </Link>

            <div className="continue-shopping">
                <Link to="/shop" className="continue-link">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default CartSummary;
