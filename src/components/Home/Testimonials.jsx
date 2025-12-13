import React from 'react';
import { Quote } from 'lucide-react';
import './Testimonials.css';

const Testimonials = ({ data }) => {
    const defaultTestimonials = [
        {
            id: 1,
            name: 'Sarah Johnson',
            review: 'I love the quality of the products! The bamboo toothbrush is amazing and I feel great about reducing my plastic waste.',
            role: 'Verified Buyer'
        },
        {
            id: 2,
            name: 'Michael Chen',
            review: 'Fast shipping and eco-friendly packaging. Ecoshopy is now my go-to for sustainable home goods.',
            role: 'Eco Enthusiast'
        },
        {
            id: 3,
            name: 'Emma Davis',
            review: 'Great customer service and a beautiful website. Shopping here is a breeze.',
            role: 'Regular Customer'
        }
    ];

    const displayTestimonials = data && data.length > 0 ? data : defaultTestimonials;

    return (
        <section className="testimonials-section">
            <div className="container">
                <h2 className="section-title text-center">What Our Customers Say</h2>
                <div className="testimonials-grid">
                    {displayTestimonials.map(item => (
                        <div key={item.id} className="testimonial-card">
                            <Quote size={40} className="quote-icon" />
                            <p className="testimonial-text">"{item.review || item.text}"</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">
                                    {item.name.charAt(0)}
                                </div>
                                <div className="author-info">
                                    <h4>{item.name}</h4>
                                    <span className="author-role">{item.role}</span>
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
