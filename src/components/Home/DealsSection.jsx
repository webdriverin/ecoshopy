import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FirebaseService from '../../services/FirebaseService';
import './DealsSection.css';

const DealsSection = () => {
    const [deals, setDeals] = useState([]);
    const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 0, seconds: 0 });

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

    if (deals.length === 0) return null;

    return (
        <section className="deals-section">
            <div className="container">
                <div className="deals-header">
                    <div className="deals-title-wrapper">
                        <h2 className="deals-title">Deals of the Day</h2>
                        <div className="deals-timer">
                            <span>Ends in</span>
                            <span className="timer-box">{String(timeLeft.hours).padStart(2, '0')}</span> :
                            <span className="timer-box">{String(timeLeft.minutes).padStart(2, '0')}</span> :
                            <span className="timer-box">{String(timeLeft.seconds).padStart(2, '0')}</span>
                        </div>
                    </div>
                    <Link to="/shop?sort=deals" className="view-all-btn">VIEW ALL</Link>
                </div>

                <div className="deals-scroll-container">
                    {deals.map((product, index) => (
                        <Link key={index} to={`/product/${product.id}`} className="deal-card">
                            <div className="deal-image-wrapper">
                                <img src={product.image} alt={product.name} className="deal-image" />
                            </div>
                            <div className="deal-info">
                                <span className="deal-name">{product.name}</span>
                                <div className="deal-price-wrapper">
                                    <span className="deal-price">₹{product.price}</span>
                                    {product.originalPrice && <span className="deal-original-price">₹{product.originalPrice}</span>}
                                </div>
                                <span className="deal-tag">Hot Deal</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DealsSection;
