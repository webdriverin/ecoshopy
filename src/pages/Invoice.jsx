import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FirebaseService from '../services/FirebaseService';
import { Printer } from 'lucide-react';

const Invoice = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const orderData = await FirebaseService.getOrderById(orderId);
                setOrder(orderData);
            } catch (error) {
                console.error("Error fetching order for invoice", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Invoice...</div>;
    if (!order) return <div style={{ padding: '2rem', textAlign: 'center' }}>Order not found</div>;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '3rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2E7D32', marginBottom: '0.5rem' }}>INVOICE</h1>
                        <p style={{ color: '#6b7280' }}>Invoice #{order.id.substring(0, 8).toUpperCase()}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Ecoshopy</h2>
                        <p style={{ color: '#6b7280' }}>123 Eco Street</p>
                        <p style={{ color: '#6b7280' }}>Green City, Earth 10101</p>
                        <p style={{ color: '#6b7280' }}>support@ecoshopy.com</p>
                    </div>
                </div>

                {/* Info Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                    <div>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Bill To</h3>
                        <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{order.customerName}</p>
                        <p style={{ color: '#4b5563' }}>{order.address?.street || order.shippingAddress?.street || order.address}</p>
                        <p style={{ color: '#4b5563' }}>
                            {order.address?.city || order.shippingAddress?.city}, {order.address?.state || order.shippingAddress?.state} {order.address?.zip || order.address?.pincode || order.shippingAddress?.zipCode}
                        </p>
                        <p style={{ color: '#4b5563' }}>{order.phone}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Order Date</h3>
                            <p style={{ fontWeight: '600' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Payment Status</h3>
                            <span style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '9999px',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                backgroundColor: order.paymentStatus === 'PAID' ? '#d1fae5' : '#fee2e2',
                                color: order.paymentStatus === 'PAID' ? '#065f46' : '#991b1b'
                            }}>
                                {order.paymentStatus}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }}>Item</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }}>Quantity</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }}>Price</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '1rem' }}>
                                    <p style={{ fontWeight: '500' }}>{item.name}</p>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>{item.quantity}</td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>₹{item.price}</td>
                                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>₹{(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '3rem' }}>
                    <div style={{ width: '300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#4b5563' }}>
                            <span>Subtotal</span>
                            <span>₹{order.totalAmount || order.total}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#4b5563' }}>
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #e5e7eb', fontSize: '1.25rem', fontWeight: 'bold' }}>
                            <span>Total</span>
                            <span>₹{order.totalAmount || order.total}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem', marginTop: '4rem' }}>
                    <p>Thank you for your business!</p>
                    <button
                        onClick={handlePrint}
                        className="no-print"
                        style={{
                            marginTop: '2rem',
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#2E7D32',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '600',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Printer size={18} /> Print Invoice
                    </button>
                </div>

                {/* Print Styles */}
                <style>{`
                    @media print {
                        body { background-color: white; }
                        .no-print { display: none !important; }
                        div[style*="box-shadow"] { box-shadow: none !important; padding: 0 !important; }
                        div[style*="background-color: #f3f4f6"] { padding: 0 !important; background-color: white !important; }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default Invoice;
