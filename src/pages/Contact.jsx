import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Button from '../components/UI/Button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Construct WhatsApp Message
        const text = `Name: ${formData.name}%0AEmail: ${formData.email}%0AMessage: ${formData.message}`;
        const whatsappUrl = `https://api.whatsapp.com/send?phone=919745455589&text=${text}`;

        // Open WhatsApp
        window.open(whatsappUrl, '_blank');

        setSubmitted(true);
    };

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <Helmet>
                <title>Contact Us - Ecoshopy</title>
                <meta name="description" content="Get in touch with Ecoshopy. We are here to help with your questions, orders, and feedback." />
            </Helmet>
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
                                <div style={{ color: 'var(--color-text-light)' }}>hello@ecoshopy.com</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                                <Phone size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: '600' }}>Phone / WhatsApp</div>
                                <div style={{ color: 'var(--color-text-light)', marginBottom: '0.25rem' }}>+91 97454 55589</div>
                                <a
                                    href="https://api.whatsapp.com/send?phone=919745455589&text=Hi%20Ecoshopy,%20I%20have%20a%20query."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        color: 'var(--color-text-light)',
                                        marginBottom: '0.25rem',
                                        display: 'block',
                                        textDecoration: 'none',
                                        cursor: 'pointer'
                                    }}
                                    className="hover:text-primary"
                                >
                                    +91 97454 55589
                                </a>
                                <a
                                    href="https://api.whatsapp.com/send?phone=919745455589&text=Hi%20Ecoshopy,%20I%20have%20a%20query."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.85rem',
                                        color: '#25D366',
                                        fontWeight: '600',
                                        textDecoration: 'none'
                                    }}
                                >
                                    Chat on WhatsApp
                                </a>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                                <MapPin size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: '600' }}>Location</div>
                                <div style={{ color: 'var(--color-text-light)' }}>
                                    BUILDING NO. : 901<br />
                                    SWABAB NAGAR, MAIN ROAD,<br />
                                    ALATHUR. PALAKKAD. DT.
                                </div>
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
                            <h3 style={{ marginBottom: '0.5rem' }}>Message Sent on WhatsApp!</h3>
                            <p style={{ color: 'var(--color-text-light)' }}>We'll get back to you as soon as possible.</p>
                            <Button variant="secondary" onClick={() => setSubmitted(false)} style={{ marginTop: '1.5rem' }}>Send Another</Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="5"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                                ></textarea>
                            </div>
                            <Button variant="primary" type="submit">Send Message on WhatsApp</Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contact;
