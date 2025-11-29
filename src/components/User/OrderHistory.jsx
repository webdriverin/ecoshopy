import React from 'react';
import Button from '../UI/Button';
import { Package, ChevronRight } from 'lucide-react';

const OrderHistory = () => {
    // Dummy data
    const orders = [
        { id: 'ORD-12345', date: '2023-10-15', total: 45.50, status: 'Delivered', items: ['Bamboo Toothbrush', 'Cotton Pads'] },
        { id: 'ORD-67890', date: '2023-11-02', total: 24.00, status: 'Processing', items: ['Glass Water Bottle'] }
    ];

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem' }}>My Orders</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orders.map(order => (
                    <div key={order.id} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: '600' }}>#{order.id}</span>
                                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>{order.date}</span>
                                <span style={{
                                    fontSize: '0.75rem',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '999px',
                                    backgroundColor: order.status === 'Delivered' ? '#D1FAE5' : '#FEF3C7',
                                    color: order.status === 'Delivered' ? '#065F46' : '#92400E',
                                    fontWeight: '500'
                                }}>
                                    {order.status}
                                </span>
                            </div>
                            <div style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
                                {order.items.join(', ')}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>${order.total.toFixed(2)}</div>
                            <Button variant="secondary" size="small" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                Track Order <ChevronRight size={16} />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistory;
