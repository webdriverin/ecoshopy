import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import { User, Package, MapPin, Heart, LogOut, Settings, Camera, Bell, Mail, Shield, ChevronRight, Edit2, Plus } from 'lucide-react';
import OrderHistory from '../components/User/OrderHistory';
// import Wishlist from '../components/User/Wishlist';
import AddressManager from '../components/User/AddressManager';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile'); // Default to profile info
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const [isEditing, setIsEditing] = useState(false);

    // Mock form state
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '+91 98765 43210',
        location: 'Mumbai, India'
    });

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

    const handleSaveProfile = () => {
        // In a real app, API call here
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile': return (
                <div className="profile-tab-content fade-in">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">My Profile</h2>
                            <p className="section-subtitle">Manage your personal information</p>
                        </div>
                        {!isEditing && (
                            <Button variant="outline" size="small" onClick={() => setIsEditing(true)}>
                                <Edit2 size={16} /> Edit Profile
                            </Button>
                        )}
                    </div>

                    <div className="profile-details-card">
                        <div className="profile-header-large">
                            <div className="profile-avatar-large">
                                {user.name ? user.name.charAt(0).toUpperCase() : <User size={40} />}
                                <button className="avatar-edit-btn">
                                    <Camera size={16} />
                                </button>
                            </div>
                            <div className="profile-header-info">
                                <h3>{user.name}</h3>
                                <p>{user.email}</p>
                            </div>
                        </div>

                        <div className="profile-form-grid">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    disabled={!isEditing}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={isEditing ? 'editable' : ''}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled={true} // Email usually not editable directly
                                    className="disabled"
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    disabled={!isEditing}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className={isEditing ? 'editable' : ''}
                                />
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    disabled={!isEditing}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className={isEditing ? 'editable' : ''}
                                />
                            </div>
                        </div>

                        {isEditing && (
                            <div className="form-actions">
                                <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button variant="primary" onClick={handleSaveProfile}>Save Changes</Button>
                            </div>
                        )}
                    </div>
                </div>
            );
            case 'orders': return <OrderHistory viewMode="active" />;
            case 'address': return <div className="fade-in"><AddressManager userId={user.uid} /></div>;
            // case 'wishlist': return <Wishlist />;
            case 'settings': return <SettingsTab />;
            default: return <OrderHistory viewMode="active" />;
        }
    };

    return (
        <div className="profile-container container">
            <div className="profile-layout">
                {/* Sidebar */}
                <div className="profile-sidebar">
                    <div className="user-info-mini">
                        <div className="user-avatar-mini">
                            {user.name ? user.name.charAt(0).toUpperCase() : <User size={24} />}
                        </div>
                        <div className="user-text-mini">
                            <p className="welcome-text">Hello,</p>
                            <h3 className="user-name-mini">{user.name}</h3>
                        </div>
                    </div>

                    <nav className="profile-nav">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
                        >
                            <User size={20} /> Profile Information
                        </button>
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
                            <MapPin size={20} /> Manage Addresses
                        </button>

                        <div className="nav-divider"></div>
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



const SettingsTab = () => (
    <div className="fade-in">
        <div className="section-header">
            <div>
                <h2 className="section-title">Account Settings</h2>
                <p className="section-subtitle">Manage notifications and security</p>
            </div>
        </div>

        <div className="settings-group">
            <h3 className="settings-group-title">Notifications</h3>
            <div className="setting-item">
                <div className="setting-info">
                    <div className="setting-icon"><Bell size={20} /></div>
                    <div>
                        <h4>Order Updates</h4>
                        <p>Receive updates about your order status</p>
                    </div>
                </div>
                <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider round"></span>
                </label>
            </div>
            <div className="setting-item">
                <div className="setting-info">
                    <div className="setting-icon"><Mail size={20} /></div>
                    <div>
                        <h4>Newsletter</h4>
                        <p>Receive deals and personalized offers</p>
                    </div>
                </div>
                <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider round"></span>
                </label>
            </div>
        </div>

        <div className="settings-group">
            <h3 className="settings-group-title">Security</h3>

            <div className="setting-item">
                <div className="setting-info">
                    <div className="setting-icon"><User size={20} /></div>
                    <div>
                        <h4>Change Password</h4>
                        <p>Update your account password</p>
                    </div>
                </div>
                <Button variant="outline" size="small">Update</Button>
            </div>
        </div>
    </div>
);

export default Profile;
