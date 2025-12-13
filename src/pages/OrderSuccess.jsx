import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../components/UI/Button';
import { CheckCircle, ShoppingBag, Truck, MapPin, Package } from 'lucide-react';
import FirebaseService from '../services/FirebaseService';

const OrderSuccess = () => {
    const location = useLocation();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { orderId } = location.state || {};

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                // If no orderId in state, try to find latest order for user or redirect
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                if (user.uid) {
                    try {
                        const allOrders = await FirebaseService.getOrders();
                        const userOrders = allOrders
                            .filter(o => o.userId === user.uid)
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                        if (userOrders.length > 0) {
                            setOrder(userOrders[0]);
                        }
                    } catch (error) {
                        console.error("Error fetching latest order", error);
                    }
                }
                setLoading(false);
                return;
            }

            try {
                const orderData = await FirebaseService.getOrderById(orderId);
                setOrder(orderData);
            } catch (error) {
                console.error("Error fetching order", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <p>Loading order details...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h1>Order Not Found</h1>
                <p>We couldn't find the order details. Please check your order history.</p>
                <Link to="/profile">
                    <Button variant="primary" style={{ marginTop: '1rem' }}>Go to My Orders</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '4rem 0', maxWidth: '800px' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#D1FAE5',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    color: '#059669'
                }}>
                    <CheckCircle size={40} />
                </div>

                <h1 style={{ marginBottom: '0.5rem', color: 'var(--color-text-main)', fontSize: '2rem' }}>Order Confirmed!</h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--color-text-light)' }}>
                    Thank you for your purchase, <strong>{order.customerName ? order.customerName.split(' ')[0] : 'Valued Customer'}</strong>!
                </p>
                <p style={{ color: 'var(--color-text-light)', marginTop: '0.5rem' }}>
                    Your order <strong>#{order.id}</strong> has been received and is being processed.
                </p>
            </div>

            <div style={{
                backgroundColor: 'white',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
                marginBottom: '2rem'
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', backgroundColor: '#F9FAFB' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Package size={20} /> Order Summary
                    </h3>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        {order.items.map((item, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: index !== order.items.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: '#F3F4F6' }}>
                                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: '600', color: 'var(--color-text-main)' }}>{item.name}</p>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <p style={{ fontWeight: '600' }}>₹{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '700', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                        <span>Total Amount</span>
                        <span style={{ color: 'var(--color-primary)' }}>₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={18} /> Shipping Address
                    </h3>
                    {order.address ? (
                        <div style={{ color: 'var(--color-text-light)', lineHeight: '1.6' }}>
                            <p>{order.address.street}</p>
                            <p>{order.address.city}, {order.address.zip}</p>
                            <p>{order.address.country}</p>
                            <p style={{ marginTop: '0.5rem' }}>Phone: {order.phone}</p>
                        </div>
                    ) : (
                        <p style={{ color: 'var(--color-text-light)' }}>Digital Delivery</p>
                    )}
                </div>

                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Truck size={18} /> Delivery Method
                    </h3>
                    <p style={{ color: 'var(--color-text-light)' }}>Standard Shipping (Free)</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginTop: '0.5rem' }}>
                        Estimated delivery: 3-5 business days
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <Link to="/shop">
                    <Button variant="outline">
                        Continue Shopping
                    </Button>
                </Link>
                <Link to="/profile">
                    <Button variant="primary">
                        Track My Order
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccess;
