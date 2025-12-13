import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Hero.css';

const Hero = ({ slides = [], onSlideChange }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    useEffect(() => {
        if (onSlideChange) {
            onSlideChange(currentSlide);
        }
    }, [currentSlide, onSlideChange]);

    // Auto-play logic
    useEffect(() => {
        if (slides.length <= 1 || isPaused) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [slides, isPaused, nextSlide]);

    if (!slides.length) return null;

    return (
        <section
            className="hero-section"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Background Slider */}
            <div className="hero-slider">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id || index}
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

            {/* Navigation Arrows */}
            {slides.length > 1 && (
                <>
                    <button className="hero-arrow prev" onClick={prevSlide} aria-label="Previous Slide">
                        <ChevronLeft size={24} />
                    </button>
                    <button className="hero-arrow next" onClick={nextSlide} aria-label="Next Slide">
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            {/* Dots & Progress */}
            <div className="hero-controls">
                <div className="hero-dots">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                        >
                            {index === currentSlide && !isPaused && (
                                <div className="progress-ring"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section >
    );
};

export default Hero;
