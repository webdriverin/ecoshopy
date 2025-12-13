import React, { useState, useEffect } from 'react';
import { MapPin, Edit2, LogOut, Plus, X, Save, Check } from 'lucide-react';
import Button from '../UI/Button';
import FirebaseService from '../../services/FirebaseService';

const AddressManager = ({ userId, onSelect, selectable = false, selectedId = null }) => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState(null);

    const initialFormState = {
        name: '',
        mobile: '',
        pincode: '',
        locality: '',
        address: '',
        city: '',
        state: '',
        type: 'Home', // Home, Work, Other
        isDefault: false
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (userId) {
            fetchAddresses();
        }
    }, [userId]);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const data = await FirebaseService.getUserAddresses(userId);
            setAddresses(data);
        } catch (err) {
            console.error("Error fetching addresses:", err);
            setError("Failed to load addresses");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (editingId) {
                await FirebaseService.updateUserAddress(userId, editingId, formData);
            } else {
                await FirebaseService.addUserAddress(userId, formData);
            }
            await fetchAddresses();
            setIsFormOpen(false);
            setEditingId(null);
            setFormData(initialFormState);
        } catch (err) {
            console.error("Error saving address:", err);
            setError("Failed to save address");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (addr) => {
        setFormData(addr);
        setEditingId(addr.id);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            try {
                await FirebaseService.deleteUserAddress(userId, id);
                fetchAddresses();
            } catch (err) {
                console.error("Error deleting address:", err);
                alert("Failed to delete address");
            }
        }
    };

    const handleCancel = () => {
        setIsFormOpen(false);
        setEditingId(null);
        setFormData(initialFormState);
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        marginBottom: '1rem',
        fontSize: '0.9rem'
    };

    return (
        <div className="address-manager">
            {!isFormOpen && (
                <div className="section-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 className="section-title" style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                            {selectable ? 'Select Address' : 'My Addresses'}
                        </h2>
                        <p className="section-subtitle" style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                            {selectable ? 'Choose where to deliver' : 'Manage your delivery locations'}
                        </p>
                    </div>
                    <Button variant="primary" size="small" onClick={() => setIsFormOpen(true)}>
                        <Plus size={16} /> Add New Address
                    </Button>
                </div>
            )}

            {isFormOpen ? (
                <div className="address-form-container" style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontWeight: '600' }}>{editingId ? 'Edit Address' : 'Add New Address'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                style={inputStyle}
                                required
                            />
                            <input
                                type="tel"
                                name="mobile"
                                placeholder="Mobile Number"
                                value={formData.mobile}
                                onChange={handleInputChange}
                                style={inputStyle}
                                required
                            />
                            <input
                                type="text"
                                name="pincode"
                                placeholder="Pincode"
                                value={formData.pincode}
                                onChange={handleInputChange}
                                style={inputStyle}
                                required
                            />
                            <input
                                type="text"
                                name="locality"
                                placeholder="Locality"
                                value={formData.locality}
                                onChange={handleInputChange}
                                style={inputStyle}
                                required
                            />
                        </div>
                        <input
                            type="text"
                            name="address"
                            placeholder="Address (Area and Street)"
                            value={formData.address}
                            onChange={handleInputChange}
                            style={inputStyle}
                            required
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <input
                                type="text"
                                name="city"
                                placeholder="City/District/Town"
                                value={formData.city}
                                onChange={handleInputChange}
                                style={inputStyle}
                                required
                            />
                            <select
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                style={inputStyle}
                                required
                            >
                                <option value="" disabled>-- Select State --</option>
                                <option value="Kerala">Kerala</option>
                                <option value="Tamil Nadu">Tamil Nadu</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="Delhi">Delhi</option>
                                <option value="West Bengal">West Bengal</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ marginRight: '1rem', fontWeight: '500' }}>Type:</label>
                            <label style={{ marginRight: '1rem' }}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="Home"
                                    checked={formData.type === 'Home'}
                                    onChange={handleInputChange}
                                /> Home
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="type"
                                    value="Work"
                                    checked={formData.type === 'Work'}
                                    onChange={handleInputChange}
                                /> Work
                            </label>
                        </div>

                        <div className="form-actions" style={{ display: 'flex', gap: '1rem' }}>
                            <Button type="button" variant="secondary" onClick={handleCancel}>Cancel</Button>
                            <Button type="submit" variant="primary">
                                <Save size={16} style={{ marginRight: '0.5rem' }} /> Save Address
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="address-list">
                    {loading ? (
                        <p>Loading addresses...</p>
                    ) : addresses.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-light)' }}>
                            <MapPin size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                            <p>No addresses found. Add one to get started.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {addresses.map(addr => (
                                <div
                                    key={addr.id}
                                    className={`address-card ${selectable && selectedId === addr.id ? 'selected' : ''}`}
                                    onClick={() => selectable && onSelect && onSelect(addr)}
                                    style={{
                                        border: selectable && selectedId === addr.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-lg)',
                                        padding: '1.5rem',
                                        backgroundColor: 'white',
                                        position: 'relative',
                                        cursor: selectable ? 'pointer' : 'default',
                                        transition: 'all 0.2s',
                                        boxShadow: selectable && selectedId === addr.id ? '0 4px 12px rgba(var(--color-primary-rgb), 0.1)' : 'none'
                                    }}
                                >
                                    {selectable && selectedId === addr.id && (
                                        <div style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--color-primary)' }}>
                                            <Check size={20} />
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <span style={{
                                            backgroundColor: '#f3f4f6',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            textTransform: 'uppercase',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                        }}>
                                            <MapPin size={12} /> {addr.type}
                                        </span>
                                    </div>

                                    <h4 style={{ fontWeight: '700', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{addr.name}</h4>
                                    <p style={{ color: 'var(--color-text-light)', lineHeight: '1.5', marginBottom: '1rem', fontSize: '0.95rem' }}>
                                        {addr.address}<br />
                                        {addr.locality}, {addr.city}<br />
                                        {addr.state} - {addr.pincode}
                                    </p>
                                    <p style={{ fontWeight: '500', fontSize: '0.9rem' }}>Phone: {addr.mobile}</p>

                                    {!selectable && (
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                                            <Button variant="outline" size="small" onClick={() => handleEdit(addr)} style={{ flex: 1 }}>
                                                <Edit2 size={14} style={{ marginRight: '0.25rem' }} /> Edit
                                            </Button>
                                            <Button variant="outline" size="small" onClick={() => handleDelete(addr.id)} style={{ flex: 1, borderColor: '#ef4444', color: '#ef4444' }}>
                                                <LogOut size={14} style={{ marginRight: '0.25rem' }} /> Delete
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AddressManager;
