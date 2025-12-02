import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Home/Hero';
import Button from '../components/UI/Button';
import { ArrowRight } from 'lucide-react';
import FeaturedProducts from '../components/Home/FeaturedProducts';
import Testimonials from '../components/Home/Testimonials';
import PromotionalAd from '../components/Home/PromotionalAd';
import FeaturedCollections from '../components/Home/FeaturedCollections';

import NewArrivals from '../components/Home/NewArrivals';
import CategoryBar from '../components/Home/CategoryBar';
import DealsSection from '../components/Home/DealsSection';
import FirebaseService from '../services/FirebaseService';
import './Home.css';

const Home = () => {
    const [ads, setAds] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [banners, setBanners] = useState([]);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [adsData, testimonialsData, bannersData] = await Promise.all([
                    FirebaseService.getAds(),
                    FirebaseService.getTestimonials(),
                    FirebaseService.getBanners()
                ]);
                setAds(adsData.filter(a => a.status === 'Active'));
                setTestimonials(testimonialsData.filter(t => t.status === 'Active'));

                const activeBanners = bannersData.filter(b => b.status === 'Active');
                if (activeBanners.length > 0) {
                    setBanners(activeBanners);
                } else {
                    setBanners([
                        {
                            id: 1,
                            image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
                            title: 'Sustainable Living, Made Simple.',
                            subtitle: 'Discover our curated collection of eco-friendly products.',
                            ctaPrimary: 'Shop Now',
                            ctaSecondary: 'Discover'
                        }
                    ]);
                }
            } catch (error) {
                console.error("Error fetching home data", error);
            }
        };
        fetchData();
    }, []);

    const currentSlide = banners[currentSlideIndex] || {};

    return (
        <>
            <CategoryBar />
            <div className="hero-wrapper">
                <Hero slides={banners} onSlideChange={setCurrentSlideIndex} />

                {/* Full Content Overlay */}
                <div className="hero-content-overlay">
                    <div className="hero-text-content">
                        <h1 className="hero-title">
                            {currentSlide.title?.split(' ').map((word, i) => (
                                <span key={i} style={{ display: 'inline-block', marginRight: '0.25em' }}>{word}</span>
                            ))}
                        </h1>
                        <p className="hero-subtitle">{currentSlide.subtitle}</p>
                    </div>

                    <div className="hero-buttons">
                        <Link to="/shop">
                            <Button
                                variant="primary"
                                className="hero-btn-primary"
                                style={{
                                    backgroundColor: currentSlide.buttonColor || 'var(--color-primary)',
                                    color: currentSlide.buttonTextColor || 'white',
                                    border: 'none'
                                }}
                            >
                                {currentSlide.ctaPrimary || 'Shop Now'} <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
                            </Button>
                        </Link>
                        <div className="hero-dropdown-container">
                            <Button
                                variant="secondary"
                                className="hero-btn-secondary hero-dropdown-trigger"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.target.closest('.hero-dropdown-container').classList.toggle('active');
                                }}
                            >
                                {currentSlide.ctaSecondary || 'Discover'} <span style={{ fontSize: '0.8em', marginLeft: '0.5rem' }}>▼</span>
                            </Button>
                            <div className="hero-dropdown-menu">
                                <Link to="/about" className="hero-dropdown-item">About Us</Link>
                                <Link to="/contact" className="hero-dropdown-item">Contact Us</Link>
                            </div>
                        </div>
                    </div>

                    <div className="hero-carousel-container">
                        <FeaturedProducts hideHeader={true} />
                    </div>
                </div>
            </div>
            <DealsSection />
            <FeaturedCollections />
            <NewArrivals />
            {ads.map(ad => (
                <PromotionalAd key={ad.id} ad={ad} />
            ))}
            <Testimonials data={testimonials} />
        </>
    );
};

export default Home;
