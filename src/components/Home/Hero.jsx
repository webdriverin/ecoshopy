import React, { useState, useEffect } from 'react';
import './Hero.css';

const Hero = ({ slides = [], onSlideChange }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (onSlideChange) {
            onSlideChange(currentSlide);
        }
    }, [currentSlide, onSlideChange]);

    // Auto-play logic
    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [slides]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <section className="hero-section">
            {/* Background Slider */}
            <div className="hero-slider">
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
                        ></div>
                    ))}
                </div>
            </div>
        </section >
    );
};

export default Hero;
