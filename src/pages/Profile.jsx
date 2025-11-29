import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import { User, Package, MapPin, Heart, LogOut, Settings } from 'lucide-react';
import OrderHistory from '../components/User/OrderHistory';
import Wishlist from '../components/User/Wishlist';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    React.useEffect(() => {
        if (!user.email) {
            navigate('/login');
        }
    }, [user.email, navigate]);

    if (!user.email) {
        return null;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'orders': return <OrderHistory />;
            case 'address': return <AddressTab />;
            case 'wishlist': return <Wishlist />;
            case 'settings': return <div className="text-center py-10 text-gray-500">Settings coming soon...</div>;
            default: return <OrderHistory />;
        }
    };

    return (
        <div className="profile-container container">
            <div className="profile-layout">
                {/* Sidebar */}
                <div className="profile-sidebar">
                    <div className="user-info">
                        <div className="user-avatar">
                            {user.name ? user.name.charAt(0).toUpperCase() : <User size={40} />}
                        </div>
                        <h3 className="user-name">{user.name}</h3>
                        <p className="user-email">{user.email}</p>
                    </div>

                    <nav className="profile-nav">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
                        >
                            <Package size={20} /> My Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('address')}
                            className={`nav-btn ${activeTab === 'address' ? 'active' : ''}`}
                        >
                            <MapPin size={20} /> Addresses
                        </button>
                        <button
                            onClick={() => setActiveTab('wishlist')}
                            className={`nav-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
                        >
                            <Heart size={20} /> Wishlist
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
                        >
                            <Settings size={20} /> Settings
                        </button>
                        <button
                            onClick={handleLogout}
                            className="nav-btn logout"
                        >
                            <LogOut size={20} /> Logout
                        </button>
                    </nav>
                </div>

                {/* Content */}
                <div className="profile-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

const AddressTab = () => (
    <div>
        <div className="section-title">
            <h2>My Addresses</h2>
            <Button variant="secondary" size="small">Add New</Button>
        </div>
        <div className="address-card">
            <div className="address-type">
                <MapPin size={16} /> Home
            </div>
            <p className="address-details">
                123 Eco Street<br />
                Green City, Earth<br />
                12345
            </p>
        </div>
    </div>
);

export default Profile;
