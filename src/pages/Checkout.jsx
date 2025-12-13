import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import { CreditCard, Truck, ShieldCheck, MapPin, User, Phone, Home, Navigation } from 'lucide-react';
import { useCart } from '../context/CartContext';
import FirebaseService from '../services/FirebaseService';
import AddressManager from '../components/User/AddressManager';

import Toast from '../components/UI/Toast';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, getCartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [user, setUser] = useState(null);

    // Toast State
    const [toast, setToast] = useState({ message: '', type: 'info', isVisible: false });

    const showToast = (message, type = 'info') => {
        setToast({ message, type, isVisible: true });
    };

    const handleCloseToast = () => {
        setToast(prev => ({ ...prev, isVisible: false }));
    };

    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        pincode: '',
        locality: '',
        address: '',
        city: '',
        state: '',
        landmark: '',
        alternatePhone: '',
        email: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    React.useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.uid) {
            // Redirect to login if not authenticated
            navigate('/login', { state: { from: '/checkout' } });
            return;
        }

        if (user.email) {
            setFormData(prev => ({
                ...prev,
                email: user.email,
                name: user.displayName || '',
            }));

            setUser(user);
        }
    }, [navigate]);

    const handleAddressSelect = (address) => {
        setFormData(prev => ({
            ...prev,
            name: address.name,
            mobile: address.mobile,
            pincode: address.pincode,
            locality: address.locality,
            address: address.address,
            city: address.city,
            state: address.state,
            landmark: '', // data structure might not match perfectly if address doesnt have landmark
            alternatePhone: ''
        }));
        setSelectedAddressId(address.id);
    };

    const handleLocationClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async () => {
                showToast("Location detected! (Geocoding API required for auto-fill)", "success");
                setFormData(prev => ({
                    ...prev,
                    pincode: '673638',
                    city: 'Malappuram',
                    state: 'Kerala',
                    country: 'India'
                }));
            }, (error) => {
                console.error("Error getting location:", error.message, "Code:", error.code);
                showToast(`Could not detect location: ${error.message}. Please enter manually.`, "error");
            });
        } else {
            showToast("Geolocation is not supported by this browser.", "error");
        }
    };

    const handlePayment = async (orderId, amount) => {
        const options = {
            key: "rzp_test_LPCJHIN4KT492Z",
            amount: amount * 100,
            currency: "INR",
            name: "Ecoshopy",
            description: "Order Payment",
            image: "https://example.com/your_logo",
            order_id: "",
            handler: async function (response) {
                try {
                    const updateData = {
                        paymentStatus: 'PAID',
                        status: 'PROCESSING',
                        razorpay_payment_id: response.razorpay_payment_id,
                        orderTimeline: {
                            paidAt: new Date().toISOString()
                        }
                    };

                    if (response.razorpay_order_id) updateData.razorpay_order_id = response.razorpay_order_id;
                    if (response.razorpay_signature) updateData.razorpay_signature = response.razorpay_signature;

                    await FirebaseService.updateOrder(orderId, updateData);
                    clearCart();
                    navigate('/order-success', { state: { orderId } });
                } catch (error) {
                    console.error("Error updating order after payment", error);
                    showToast("Payment successful but failed to update order. Please contact support.", "error");
                }
            },
            prefill: {
                name: formData.name,
                email: formData.email,
                contact: formData.mobile
            },
            notes: {
                address: "Razorpay Corporate Office"
            },
            theme: {
                color: "#2E7D32" // Using primary green
            },
            modal: {
                ondismiss: async function () {
                    await FirebaseService.updateOrder(orderId, {
                        paymentStatus: 'FAILED',
                        status: 'INITIATED',
                        failureReason: 'Payment modal closed by user'
                    });
                    showToast("Payment cancelled. You can retry from your orders page.", "error");
                }
            }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', async function (response) {
            await FirebaseService.updateOrder(orderId, {
                paymentStatus: 'FAILED',
                status: 'INITIATED',
                failureReason: response.error.description,
                razorpay_payment_id: response.error.metadata.payment_id
            });
            showToast(`Payment Failed: ${response.error.description}`, "error");
        });
        rzp1.open();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                customerName: formData.name,
                email: formData.email,
                phone: formData.mobile,
                address: {
                    street: formData.address,
                    locality: formData.locality,
                    city: formData.city,
                    state: formData.state,
                    zip: formData.pincode,
                    landmark: formData.landmark,
                    alternatePhone: formData.alternatePhone,
                    country: 'India'
                },
                items: cart.map(item => ({
                    productId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.imageUrl || item.image
                })),
                totalAmount: getCartTotal(),
                paymentStatus: 'AWAITING_PAYMENT',
                status: 'INITIATED',
                paymentMethod: 'Razorpay',
                userId: JSON.parse(localStorage.getItem('user') || '{}').uid || 'guest',
                orderTimeline: {
                    createdAt: new Date().toISOString()
                }
            };

            const orderId = await FirebaseService.createOrder(orderData);
            await handlePayment(orderId, getCartTotal());

        } catch (error) {
            console.error("Error initiating checkout", error);
            showToast("Failed to initiate checkout: " + error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h2>Your cart is empty</h2>
                <Button variant="primary" onClick={() => navigate('/shop')} style={{ marginTop: '1rem' }}>
                    Continue Shopping
                </Button>
            </div>
        );
    }

    const inputStyle = {
        width: '100%',
        padding: '0.875rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'all 0.2s',
        backgroundColor: '#F9FAFB'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.85rem',
        fontWeight: '500',
        color: 'var(--color-text-main)',
        marginBottom: '0.5rem'
    };

    const InputGroup = ({ label, name, type = "text", required = true, icon: Icon, ...props }) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>{label} {required && <span style={{ color: 'red' }}>*</span>}</label>
            <div style={{ position: 'relative' }}>
                {Icon && <Icon size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />}
                <input
                    type={type}
                    name={name}
                    required={required}
                    value={formData[name]}
                    onChange={handleChange}
                    style={{ ...inputStyle, paddingLeft: Icon ? '2.5rem' : '0.875rem' }}
                    {...props}
                />
            </div>
        </div>
    );

    return (
        <div className="container" style={{ padding: '3rem 0', backgroundColor: 'var(--color-bg-body)', minHeight: '100vh' }}>
            {toast.isVisible && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={handleCloseToast}
                />
            )}
            <h1 style={{ marginBottom: '2rem', textAlign: 'center', fontWeight: '700', color: 'var(--color-text-main)' }}>Checkout</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem', alignItems: 'start', maxWidth: '1200px', margin: '0 auto' }}>

                {/* Left Side: Shipping Form */}
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Truck size={24} color="var(--color-primary)" /> Shipping Details
                        </h2>
                        <button
                            type="button"
                            onClick={handleLocationClick}
                            style={{
                                color: 'var(--color-primary)',
                                background: 'none',
                                border: '1px solid var(--color-primary)',
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius-full)',
                                fontWeight: '600',
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-primary)'; e.currentTarget.style.color = 'white'; }}
                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                        >
                            <Navigation size={14} /> Auto-fill Location
                        </button>
                    </div>

                    {user && user.uid && (
                        <div style={{ marginBottom: '2rem' }}>
                            <AddressManager
                                userId={user.uid}
                                selectable={true}
                                onSelect={handleAddressSelect}
                                selectedId={selectedAddressId}
                            />
                            <div style={{ margin: '1.5rem 0', textAlign: 'center', position: 'relative' }}>
                                <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />
                                <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'white', padding: '0 1rem', color: 'var(--color-text-light)', fontSize: '0.85rem' }}>
                                    OR Enter Manually
                                </span>
                            </div>
                        </div>
                    )}

                    <form id="checkout-form" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

                        <InputGroup label="Full Name" name="name" icon={User} placeholder="John Doe" />
                        <InputGroup label="Mobile Number" name="mobile" type="tel" maxLength="10" icon={Phone} placeholder="10-digit number" />

                        <InputGroup label="Pincode" name="pincode" maxLength="6" placeholder="6-digit PIN" />
                        <InputGroup label="Locality" name="locality" placeholder="e.g. MG Road" />

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={labelStyle}>Address (Area and Street) <span style={{ color: 'red' }}>*</span></label>
                            <div style={{ position: 'relative' }}>
                                <Home size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-light)' }} />
                                <textarea
                                    name="address"
                                    required
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Flat No, Building, Street Name"
                                    style={{ ...inputStyle, minHeight: '100px', resize: 'vertical', paddingLeft: '2.5rem' }}
                                />
                            </div>
                        </div>

                        <InputGroup label="City/District/Town" name="city" placeholder="City" />

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={labelStyle}>State <span style={{ color: 'red' }}>*</span></label>
                            <select
                                name="state"
                                required
                                value={formData.state}
                                onChange={handleChange}
                                style={inputStyle}
                            >
                                <option value="" disabled>-- Select State --</option>
                                <option value="Kerala">Kerala</option>
                                <option value="Tamil Nadu">Tamil Nadu</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="Delhi">Delhi</option>
                            </select>
                        </div>

                        <InputGroup label="Landmark (Optional)" name="landmark" required={false} placeholder="Near..." />
                        <InputGroup label="Alternate Phone (Optional)" name="alternatePhone" required={false} type="tel" placeholder="Optional" />

                        <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem', padding: '1rem', backgroundColor: '#F0FDF4', borderRadius: 'var(--radius-md)', border: '1px solid #BBF7D0' }}>
                            <p style={{ fontSize: '0.85rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <ShieldCheck size={16} /> Order confirmation will be sent to <strong>{formData.email}</strong>
                            </p>
                        </div>

                    </form>
                </div>

                {/* Right Side: Order Summary */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-sm)',
                    position: 'sticky',
                    top: '100px'
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Order Summary</h2>

                    <div style={{ marginBottom: '1.5rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                        {cart.map(item => (
                            <div key={item.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--color-border)' }}>
                                    <img src={item.imageUrl || item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.25rem' }}>{item.name}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>Qty: {item.quantity}</span>
                                        <span style={{ fontWeight: '600' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-light)' }}>
                            <span>Subtotal</span>
                            <span>₹{getCartTotal().toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-light)' }}>
                            <span>Shipping</span>
                            <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Free</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontWeight: '700',
                            fontSize: '1.25rem',
                            color: 'var(--color-text-main)',
                            borderTop: '1px solid var(--color-border)',
                            paddingTop: '1rem'
                        }}>
                            <span>Total</span>
                            <span>₹{getCartTotal().toFixed(2)}</span>
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        style={{ width: '100%', marginBottom: '1rem', padding: '1rem' }}
                        onClick={() => document.getElementById('checkout-form').requestSubmit()}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Proceed to Pay'} <CreditCard size={20} style={{ marginLeft: '0.5rem' }} />
                    </Button>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
                        <ShieldCheck size={14} color="var(--color-success)" /> Secure Payment via Razorpay
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
