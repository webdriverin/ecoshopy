import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import { CreditCard, Truck, ShieldCheck } from 'lucide-react';

const Checkout = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
        country: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate Razorpay payment
        const options = {
            key: "YOUR_RAZORPAY_KEY_ID", // Enter the Key ID generated from the Dashboard
            amount: "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "USD",
            name: "Ecoshopy",
            description: "Test Transaction",
            image: "https://example.com/your_logo",
            handler: function () {
                // alert(response.razorpay_payment_id);
                // alert(response.razorpay_order_id);
                // alert(response.razorpay_signature)
                navigate('/order-success');
            },
            prefill: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                contact: formData.phone
            },
            theme: {
                color: "#1DBF73"
            }
        };

        // In a real app, we would open Razorpay here. 
        // For this demo, we'll just simulate a successful redirect.
        console.log("Processing payment with options:", options);
        setTimeout(() => {
            navigate('/order-success');
        }, 1500);
    };

    return (
        <div className="container" style={{ padding: '3rem 0' }}>
            <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Checkout</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem', alignItems: 'start' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>1</span>
                        Shipping Information
                    </h2>

                    <form id="checkout-form" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                                style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Address</label>
                            <input
                                type="text"
                                name="address"
                                required
                                value={formData.address}
                                onChange={handleChange}
                                style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>City</label>
                            <input
                                type="text"
                                name="city"
                                required
                                value={formData.city}
                                onChange={handleChange}
                                style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>ZIP / Postal Code</label>
                            <input
                                type="text"
                                name="zip"
                                required
                                value={formData.zip}
                                onChange={handleChange}
                                style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            />
                        </div>
                    </form>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-sm)',
                    position: 'sticky',
                    top: '100px'
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Order Summary</h2>

                    {/* Dummy Order Items */}
                    <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Bamboo Toothbrush Set (x2)</span>
                            <span>$25.98</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Reusable Cotton Pads (x1)</span>
                            <span>$18.50</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-light)' }}>
                            <span>Subtotal</span>
                            <span>$44.48</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-light)' }}>
                            <span>Shipping</span>
                            <span>Free</span>
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
                            <span>$44.48</span>
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        style={{ width: '100%', marginBottom: '1rem' }}
                        onClick={() => document.getElementById('checkout-form').requestSubmit()}
                    >
                        Pay Now <CreditCard size={20} style={{ marginLeft: '0.5rem' }} />
                    </Button>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ShieldCheck size={16} color="var(--color-success)" /> Secure Payment with Razorpay
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Truck size={16} color="var(--color-primary)" /> Free Shipping on orders over $50
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
