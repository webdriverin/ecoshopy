import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';
import { ArrowRight } from 'lucide-react';
import './Hero.css';

const slides = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
        title: 'Sustainable Living, Made Simple.',
        subtitle: 'Discover our curated collection of eco-friendly products that help you live a greener, healthier life without compromising on style.',
        ctaPrimary: 'Shop Now',
        ctaSecondary: 'Learn More'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
        title: 'Zero Waste Essentials',
        subtitle: 'Start your zero-waste journey today with our range of plastic-free alternatives for your daily needs.',
        ctaPrimary: 'Explore Collection',
        ctaSecondary: 'Our Mission'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
        title: 'Natural Beauty & Care',
        subtitle: 'Pamper yourself with organic, cruelty-free beauty products that are good for you and the planet.',
        ctaPrimary: 'Shop Beauty',
        ctaSecondary: 'Read Blog'
    }
];

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <section className="hero-section">
            <div
                className="hero-slider"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                    >
                        <div
                            className="hero-bg-image"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        ></div>
                        <div className="hero-overlay"></div>
                        <div className="hero-content">
                            <h1 className="hero-title">
                                {slide.title.split(' ').map((word, i) => (
                                    <span key={i} style={{ display: 'inline-block', marginRight: '0.25em' }}>{word}</span>
                                ))}
                            </h1>
                            <p className="hero-subtitle">{slide.subtitle}</p>
                            <div className="hero-buttons">
                                <Link to="/shop">
                                    <Button variant="primary" className="hero-btn-primary">
                                        {slide.ctaPrimary} <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
                                    </Button>
                                </Link>
                                <Link to="/about">
                                    <Button variant="secondary" className="hero-btn-secondary">
                                        {slide.ctaSecondary}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="hero-controls">
                <div className="hero-dots">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                        >
                            {/* Optional: Add a progress bar inside the dot if desired, or keep it simple */}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
