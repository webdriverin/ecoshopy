import React from 'react';

const About = () => {
    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>Our Story</h1>

                <div style={{
                    width: '100%',
                    height: '400px',
                    backgroundColor: '#e8f5e9',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: '3rem',
                    backgroundImage: 'url(https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}></div>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Mission</h2>
                    <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--color-text-light)' }}>
                        At Ecoshopy, our mission is to make sustainable living accessible to everyone. We believe that small changes in our daily habits can lead to a significant positive impact on our planet. We curate high-quality, eco-friendly products that help you reduce waste and live a healthier, greener life.
                    </p>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Vision</h2>
                    <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--color-text-light)' }}>
                        We envision a world where sustainability is the norm, not the exception. We strive to be a leading platform for eco-conscious consumers, fostering a community that values ethical consumption and environmental stewardship.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Values</h2>
                    <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--color-text-light)' }}>
                        <li style={{ marginBottom: '0.5rem' }}><strong>Sustainability:</strong> We prioritize products that are biodegradable, reusable, or made from recycled materials.</li>
                        <li style={{ marginBottom: '0.5rem' }}><strong>Transparency:</strong> We are open about our sourcing and the impact of our products.</li>
                        <li style={{ marginBottom: '0.5rem' }}><strong>Quality:</strong> We believe that eco-friendly products should not compromise on quality or durability.</li>
                        <li style={{ marginBottom: '0.5rem' }}><strong>Community:</strong> We support and collaborate with local artisans and ethical manufacturers.</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default About;
