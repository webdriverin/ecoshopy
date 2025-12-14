import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import FirebaseService from '../../services/FirebaseService';
import './DealsSection.css';

const DealsSection = () => {
    const [deals, setDeals] = useState([]);
    const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 0, seconds: 0 });
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const dealProducts = await FirebaseService.getDealProducts();
                setDeals(dealProducts);
            } catch (error) {
                console.error("Error fetching deals", error);
            }
        };
        fetchDeals();

        // Timer Logic
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return { hours: 23, minutes: 59, seconds: 59 }; // Reset
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    if (deals.length === 0) return null;

    return (
        <section className="deals-section">
            <div className="container">
                <div className="deals-header">
                    <div className="deals-title-wrapper">
                        <h2 className="deals-title">Deals of the Day</h2>
                        <div className="deals-timer">
                            <Clock size={16} className="timer-icon" />
                            <span className="timer-text">Ends in</span>
                            <div className="timer-box-wrapper">
                                <span className="timer-box">{String(timeLeft.hours).padStart(2, '0')}</span>
                                <span className="timer-separator">:</span>
                                <span className="timer-box">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                <span className="timer-separator">:</span>
                                <span className="timer-box">{String(timeLeft.seconds).padStart(2, '0')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="deals-actions">
                        <Link to="/shop?sort=deals" className="view-all-btn">VIEW ALL</Link>
                        <div className="deals-nav-buttons">
                            <button className="deals-nav-btn" onClick={() => scroll('left')} aria-label="Scroll Left">
                                <ChevronLeft size={20} />
                            </button>
                            <button className="deals-nav-btn" onClick={() => scroll('right')} aria-label="Scroll Right">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="deals-scroll-container" ref={scrollRef}>
                    {deals.map((product, index) => (
                        <Link key={index} to={`/product/${product.id}`} className="deal-card">
                            <div className="deal-image-wrapper">
                                <img src={product.image} alt={product.name} className="deal-image" />
                                {(() => {
                                    // 1. Try to parse percentage from dealDiscount
                                    const match = product.dealDiscount?.match(/(\d+)%/);
                                    if (match) {
                                        return (
                                            <span className="deal-discount-badge">
                                                {match[0]}
                                            </span>
                                        );
                                    }

                                    // 2. Fallback to originalPrice calcluation
                                    if (product.originalPrice && product.originalPrice > product.price) {
                                        const percent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
                                        return (
                                            <span className="deal-discount-badge">
                                                {percent}% OFF
                                            </span>
                                        );
                                    }

                                    return null;
                                })()}
                            </div>
                            <div className="deal-info">
                                <span className="deal-name">{product.name}</span>
                                <div className="deal-price-wrapper">
                                    <span className="deal-price">₹{product.price.toLocaleString()}</span>
                                    {product.originalPrice && <span className="deal-original-price">₹{product.originalPrice.toLocaleString()}</span>}
                                </div>
                                <span className="deal-tag">Hot Deal</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section >
    );
};

export default DealsSection;
