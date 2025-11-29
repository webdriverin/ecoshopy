import React from 'react';
import Hero from '../components/Home/Hero';
import FeaturedProducts from '../components/Home/FeaturedProducts';
import Categories from '../components/Home/Categories';
import Testimonials from '../components/Home/Testimonials';

const Home = () => {
    return (
        <>
            <Hero />
            <FeaturedProducts />
            <Categories />
            <section style={{
                padding: '3rem 0',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Special Offer!</h2>
                    <p style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Get 20% off your first order with code <strong>ECO20</strong></p>
                </div>
            </section>
            <Testimonials />
        </>
    );
};

export default Home;
