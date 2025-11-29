import React from 'react';

const Testimonials = () => {
    const testimonials = [
        {
            id: 1,
            name: 'Sarah Johnson',
            text: 'I love the quality of the products! The bamboo toothbrush is amazing and I feel great about reducing my plastic waste.',
            role: 'Verified Buyer'
        },
        {
            id: 2,
            name: 'Michael Chen',
            text: 'Fast shipping and eco-friendly packaging. Ecoshopy is now my go-to for sustainable home goods.',
            role: 'Eco Enthusiast'
        },
        {
            id: 3,
            name: 'Emma Davis',
            text: 'Great customer service and a beautiful website. Shopping here is a breeze.',
            role: 'Regular Customer'
        }
    ];

    return (
        <section style={{ padding: '4rem 0', backgroundColor: '#F0FDF4' }}>
            <div className="container">
                <h2 className="section-title">What Our Customers Say</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    {testimonials.map(item => (
                        <div key={item.id} style={{
                            backgroundColor: 'white',
                            padding: '2rem',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <p style={{
                                fontStyle: 'italic',
                                marginBottom: '1.5rem',
                                color: 'var(--color-text-light)',
                                lineHeight: '1.6'
                            }}>"{item.text}"</p>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    marginRight: '1rem'
                                }}>
                                    {item.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 style={{ fontWeight: '600', color: 'var(--color-text-main)' }}>{item.name}</h4>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-lighter)' }}>{item.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
