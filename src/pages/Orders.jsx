import React from 'react';
import OrderHistory from '../components/User/OrderHistory';
import Breadcrumbs from '../components/UI/Breadcrumbs';
import './Profile.css';

const Orders = () => {
    return (
        <div className="container" style={{ padding: '2rem 0', minHeight: '80vh' }}>
            <Breadcrumbs items={[{ label: 'My Account', path: '/profile' }, { label: 'Orders', path: '/orders' }]} />

            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>Order History</h1>
                <p style={{ color: 'var(--color-text-light)', fontSize: '1.1rem' }}>Track, return, or buy things again.</p>
            </div>

            <OrderHistory viewMode="delivered" layout="card" showTitle={false} />
        </div>
    );
};

export default Orders;
