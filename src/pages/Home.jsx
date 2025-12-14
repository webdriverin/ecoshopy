import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Hero from '../components/Home/Hero';
import FeaturedProducts from '../components/Home/FeaturedProducts';
import Testimonials from '../components/Home/Testimonials';
import PromotionalAd from '../components/Home/PromotionalAd';
import FeaturedCollections from '../components/Home/FeaturedCollections';
import NewArrivals from '../components/Home/NewArrivals';
import CategoryBar from '../components/Home/CategoryBar';
import DealsSection from '../components/Home/DealsSection';
import HomeFeatures from '../components/Home/HomeFeatures';

import TrendingGrid from '../components/Home/TrendingGrid';
import Skeleton from '../components/UI/Skeleton';
import FirebaseService from '../services/FirebaseService';
import './Home.css';

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [ads, setAds] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [banners, setBanners] = useState([]);

    // Deal Carousel State
    const [dealProducts, setDealProducts] = useState([]);
    const [currentDealIndex, setCurrentDealIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Simulate loading for skeleton demo
                await new Promise(resolve => setTimeout(resolve, 1000));

                const [adsData, testimonialsData, bannersData, dealsData] = await Promise.all([
                    FirebaseService.getAds(),
                    FirebaseService.getTestimonials(),
                    FirebaseService.getBanners(),
                    FirebaseService.getDealProducts()
                ]);
                setAds(adsData.filter(a => a.status === 'Active'));
                setTestimonials(testimonialsData.filter(t => t.status === 'Active'));

                // Set Deal of the Day Products
                if (dealsData.length > 0) {
                    setDealProducts(dealsData);
                }

                const activeBanners = bannersData.filter(b => b.status === 'Active');

                if (activeBanners.length > 0) {
                    setBanners(activeBanners);
                } else {
                    setBanners([
                        {
                            id: 1,
                            image: 'https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/aa1b237632506b43.jpg?q=20',
                            title: '',
                            subtitle: '',
                        }
                    ]);
                }
            } catch (error) {
                console.error("Error fetching home data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Deal Carousel Auto-Rotation
    useEffect(() => {
        if (dealProducts.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentDealIndex((prevIndex) => (prevIndex + 1) % dealProducts.length);
        }, 4000); // Rotate every 4 seconds

        return () => clearInterval(interval);
    }, [dealProducts]);

    const currentDeal = dealProducts.length > 0 ? dealProducts[currentDealIndex] : null;

    if (loading) {
        return (
            <div className="home-page">
                <div className="home-container">
                    <Skeleton type="rect" height="300px" />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1rem' }}>
                        <Skeleton type="rect" height="100px" />
                        <Skeleton type="rect" height="100px" />
                        <Skeleton type="rect" height="100px" />
                        <Skeleton type="rect" height="100px" />
                    </div>
                    <div style={{ marginTop: '2rem' }}>
                        <Skeleton type="title" width="200px" />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                            <Skeleton type="rect" height="250px" />
                            <Skeleton type="rect" height="250px" />
                            <Skeleton type="rect" height="250px" />
                            <Skeleton type="rect" height="250px" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="home-page">
            <Helmet>
                <title>Ecoshopy - Shop Sustainably, Live Consciously</title>
                <meta name="description" content="Discover eco-friendly products, sustainable fashion, and organic essentials at Ecoshopy." />
            </Helmet>
            {/* Best Buy Style: No Category Bar at top, usually in menu */}
            {/* <CategoryBar /> */}

            <div className="home-container">
                {/* Hero Section - Bento Grid Style */}
                <div className="bento-grid">
                    <div className="bento-main">
                        <Hero slides={banners} />
                    </div>
                    <div className="bento-side">
                        <div className="bento-card deal-of-day-card">
                            <div className="deal-header">
                                <span className="deal-badge">Limited Time</span>
                                <h3>Deal of the Day</h3>
                            </div>

                            {currentDeal ? (
                                <div className="deal-content-wrapper">
                                    <div key={currentDeal.id} className="deal-product-showcase fade-in-key">
                                        <div className="deal-image-container">
                                            <img src={currentDeal.image} alt={currentDeal.name} className="deal-product-image" />
                                            {currentDeal.dealDiscount && (
                                                <div className="deal-discount-sticker">
                                                    {currentDeal.dealDiscount}
                                                    <small>OFF</small>
                                                </div>
                                            )}
                                        </div>

                                        <div className="deal-info-compact">
                                            <h4 className="deal-product-title">{currentDeal.name}</h4>
                                            <div className="deal-price-block">
                                                <span className="deal-price-current">₹{currentDeal.price}</span>
                                                <span className="deal-price-original">
                                                    ₹{(() => {
                                                        // 1. Try to parse percentage from dealDiscount (e.g., "50% OFF")
                                                        const match = currentDeal.dealDiscount?.match(/(\d+)%/);
                                                        if (match) {
                                                            const percentage = parseInt(match[1]);
                                                            if (percentage > 0 && percentage < 100) {
                                                                return Math.round(currentDeal.price / (1 - percentage / 100));
                                                            }
                                                        }

                                                        // 2. Fallback: Use originalPrice if it exists and is higher
                                                        if (currentDeal.originalPrice && currentDeal.originalPrice > currentDeal.price) {
                                                            return currentDeal.originalPrice;
                                                        }

                                                        // 3. Fallback: If no valid discount info, don't show fake markup. 
                                                        // Or if user wants a default visual, we can default to 10% but better to be honest.
                                                        // BUT, for "Deal of the Day", a strikethrough is expected. 
                                                        // Let's use a safe fallback of 15% ONLY if no other info is present to keep the UI looking "deal-like"
                                                        return Math.round(currentDeal.price * 1.15);
                                                    })()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Countdown Timer */}
                                    <div className="deal-timer-container">
                                        <div className="timer-block">
                                            <span className="timer-value">11</span>
                                            <span className="timer-label">Hrs</span>
                                        </div>
                                        <span className="timer-separator">:</span>
                                        <div className="timer-block">
                                            <span className="timer-value">45</span>
                                            <span className="timer-label">Mins</span>
                                        </div>
                                        <span className="timer-separator">:</span>
                                        <div className="timer-block">
                                            <span className="timer-value">22</span>
                                            <span className="timer-label">Secs</span>
                                        </div>
                                    </div>

                                    <Link to={`/product/${currentDeal.id}`} className="deal-cta-btn">
                                        Grab Deal Now
                                    </Link>

                                    {/* Carousel Dots */}
                                    {dealProducts.length > 1 && (
                                        <div className="deal-carousel-dots">
                                            {dealProducts.map((_, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`deal-dot ${idx === currentDealIndex ? 'active' : ''}`}
                                                    onClick={() => setCurrentDealIndex(idx)}
                                                ></span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="no-deals-state">
                                    <p>Stay tuned for new offers!</p>
                                    <Link to="/shop" className="deal-cta-btn secondary">Explore Shop</Link>
                                </div>
                            )}
                        </div>
                        <div className="bento-card outlet-card">
                            <h3>Shop Now</h3>
                            <p>Save big on open-box & clearance.</p>
                            <Link to="/shop" className="bento-link">View Details</Link>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <HomeFeatures />

                {/* Trending Grid */}
                <TrendingGrid />

                {/* Promotional Ads */}
                {ads.length > 0 && <PromotionalAd ad={ads[0]} />}

                {/* New Arrivals */}
                <NewArrivals />



                {/* Testimonials */}
                <Testimonials data={testimonials} />
            </div>
        </div>
    );
};

export default Home;
