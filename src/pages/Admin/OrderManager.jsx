import React, { useState } from 'react';
import { Eye, Search } from 'lucide-react';

const OrderManager = () => {
    // Dummy data
    const [orders] = useState([
        { id: 'ORD-1001', customer: 'John Doe', date: '2023-10-25', total: 45.99, status: 'Completed' },
        { id: 'ORD-1002', customer: 'Jane Smith', date: '2023-10-26', total: 120.50, status: 'Processing' },
        { id: 'ORD-1003', customer: 'Bob Johnson', date: '2023-10-26', total: 24.00, status: 'Pending' },
        { id: 'ORD-1004', customer: 'Alice Brown', date: '2023-10-27', total: 85.00, status: 'Shipped' },
    ]);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Orders</h1>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Search size={20} color="var(--color-text-light)" />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem' }}
                    />
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: 'var(--color-bg-body)' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--color-text-light)' }}>Order ID</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--color-text-light)' }}>Customer</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--color-text-light)' }}>Date</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--color-text-light)' }}>Total</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--color-text-light)' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: 'var(--color-text-light)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '1rem', fontWeight: '500' }}>{order.id}</td>
                                <td style={{ padding: '1rem' }}>{order.customer}</td>
                                <td style={{ padding: '1rem' }}>{order.date}</td>
                                <td style={{ padding: '1rem' }}>${order.total.toFixed(2)}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '0.75rem',
                                        backgroundColor: order.status === 'Completed' ? '#D1FAE5' : order.status === 'Processing' ? '#DBEAFE' : order.status === 'Pending' ? '#FEF3C7' : '#E0E7FF',
                                        color: order.status === 'Completed' ? 'var(--color-success)' : order.status === 'Processing' ? '#2563EB' : order.status === 'Pending' ? '#D97706' : '#4F46E5'
                                    }}>
                                        {order.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button style={{ color: 'var(--color-text-light)' }}><Eye size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderManager;
