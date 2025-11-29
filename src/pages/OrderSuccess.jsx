import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/UI/Button';
import { CheckCircle, ShoppingBag } from 'lucide-react';

const OrderSuccess = () => {
    const [orderId] = React.useState(() => 'ORD-' + Math.floor(Math.random() * 1000000));

    return (
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center', maxWidth: '600px' }}>
            <div style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#D1FAE5',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                color: 'var(--color-success)'
            }}>
                <CheckCircle size={50} />
            </div>

            <h1 style={{ marginBottom: '1rem', color: 'var(--color-text-main)' }}>Order Confirmed!</h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--color-text-light)', marginBottom: '2rem' }}>
                Thank you for your purchase. Your order has been received and is being processed.
            </p>

            <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '2rem',
                textAlign: 'left'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--color-text-light)' }}>Order ID:</span>
                    <span style={{ fontWeight: '600' }}>{orderId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--color-text-light)' }}>Date:</span>
                    <span style={{ fontWeight: '600' }}>{new Date().toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-light)' }}>Total:</span>
                    <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>$44.48</span>
                </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '2rem' }}>
                A confirmation email has been sent to your email address.
            </p>

            <Link to="/shop">
                <Button variant="primary">
                    Continue Shopping <ShoppingBag size={20} style={{ marginLeft: '0.5rem' }} />
                </Button>
            </Link>
        </div>
    );
};

export default OrderSuccess;
