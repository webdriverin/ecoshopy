import React, { useState } from 'react';
import Button from '../components/UI/Button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>Get in Touch</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Contact Information</h2>
                    <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem' }}>
                        Have a question or feedback? We'd love to hear from you. Fill out the form or reach us via email or phone.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                                <Mail size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: '600' }}>Email</div>
                                <div style={{ color: 'var(--color-text-light)' }}>support@ecoshopy.com</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                                <Phone size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: '600' }}>Phone</div>
                                <div style={{ color: 'var(--color-text-light)' }}>+1 (555) 123-4567</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                                <MapPin size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: '600' }}>Location</div>
                                <div style={{ color: 'var(--color-text-light)' }}>123 Eco Street, Green City, Earth</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                    {submitted ? (
                        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                            <div style={{ width: '60px', height: '60px', backgroundColor: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success)', margin: '0 auto 1rem' }}>
                                <Send size={30} />
                            </div>
                            <h3 style={{ marginBottom: '0.5rem' }}>Message Sent!</h3>
                            <p style={{ color: 'var(--color-text-light)' }}>We'll get back to you as soon as possible.</p>
                            <Button variant="secondary" onClick={() => setSubmitted(false)} style={{ marginTop: '1.5rem' }}>Send Another</Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Name</label>
                                <input type="text" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
                                <input type="email" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Message</label>
                                <textarea required rows="5" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}></textarea>
                            </div>
                            <Button variant="primary" type="submit">Send Message</Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contact;
