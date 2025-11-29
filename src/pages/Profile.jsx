import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import { User, Package, MapPin, Heart, LogOut } from 'lucide-react';
import OrderHistory from '../components/User/OrderHistory';
import Wishlist from '../components/User/Wishlist';

const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user.email) {
        navigate('/login');
        return null;
    }

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                {/* Sidebar */}
                <div style={{ width: '250px', backgroundColor: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                    <div style={{ padding: '2rem', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>
                        <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', margin: '0 auto 1rem' }}>
                            <User size={40} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem' }}>{user.name}</h3>
                        <p style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>{user.email}</p>
                    </div>

                    <nav>
                        <button
                            onClick={() => setActiveTab('orders')}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem', border: 'none', backgroundColor: activeTab === 'orders' ? '#F3F4F6' : 'transparent', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === 'orders' ? '600' : '400' }}
                        >
                            <Package size={20} /> My Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('address')}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem', border: 'none', backgroundColor: activeTab === 'address' ? '#F3F4F6' : 'transparent', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === 'address' ? '600' : '400' }}
                        >
                            <MapPin size={20} /> Addresses
                        </button>
                        <button
                            onClick={() => setActiveTab('wishlist')}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem', border: 'none', backgroundColor: activeTab === 'wishlist' ? '#F3F4F6' : 'transparent', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === 'wishlist' ? '600' : '400' }}
                        >
                            <Heart size={20} /> Wishlist
                        </button>
                        <button
                            onClick={handleLogout}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', textAlign: 'left', color: 'var(--color-error)', borderTop: '1px solid var(--color-border)' }}
                        >
                            <LogOut size={20} /> Logout
                        </button>
                    </nav>
                </div>

                {/* Content */}
                <div style={{ flex: 1, backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', minHeight: '500px' }}>
                    {activeTab === 'orders' && <OrderHistory />}
                    {activeTab === 'address' && <AddressTab />}
                    {activeTab === 'wishlist' && <Wishlist />}
                </div>
            </div>
        </div>
    );
};

const AddressTab = () => (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>My Addresses</h2>
            <Button variant="secondary" size="small">Add New</Button>
        </div>
        <div style={{ padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Home</div>
            <p style={{ color: 'var(--color-text-light)', lineHeight: '1.6' }}>
                123 Eco Street<br />
                Green City, Earth<br />
                12345
            </p>
        </div>
    </div>
);

export default Profile;
