import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';
import { ArrowRight } from 'lucide-react';

const CartSummary = ({ subtotal, shipping = 0, tax = 0 }) => {
    const total = subtotal + shipping + tax;

    return (
        <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            position: 'sticky',
            top: '100px'
        }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Order Summary</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-light)' }}>
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-light)' }}>
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-light)' }}>
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: '700',
                    fontSize: '1.25rem',
                    color: 'var(--color-text-main)',
                    borderTop: '1px solid var(--color-border)',
                    paddingTop: '1rem'
                }}>
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>

            <Link to="/checkout" style={{ display: 'block' }}>
                <Button variant="primary" style={{ width: '100%' }}>
                    Proceed to Checkout <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
                </Button>
            </Link>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <Link to="/shop" style={{ color: 'var(--color-primary)', fontSize: '0.875rem', textDecoration: 'underline' }}>
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default CartSummary;
