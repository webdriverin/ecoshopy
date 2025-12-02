import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import FirebaseService from '../../services/FirebaseService';
import './FeaturedCollections.css';

const FeaturedCollections = () => {
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const data = await FirebaseService.getFeaturedCollections();
                if (data.length > 0) {
                    setCollections(data);
                } else {
                    // Fallback / Demo Data if DB is empty
                    setCollections([]);
                }
            } catch (error) {
                console.error("Error fetching featured collections", error);
            }
        };
        fetchCollections();
    }, []);

    if (collections.length === 0) return null;

    return (
        <section className="featured-collections-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Curated Collections</h2>
                    <p className="section-subtitle">Explore our hand-picked selections designed for a sustainable lifestyle.</p>
                </div>

                <div className="collections-grid">
                    {collections.map((collection, index) => (
                        <Link
                            key={collection.id || index}
                            to={collection.link}
                            className={`collection-card ${collection.size || 'small'}`}
                        >
                            <div className="collection-bg" style={{ backgroundImage: `url(${collection.image})` }}></div>
                            <div className="collection-overlay"></div>
                            <div className="collection-content">
                                <h3 className="collection-title">{collection.title}</h3>
                                <span className="collection-subtitle">{collection.subtitle}</span>
                                <span className="collection-btn">
                                    Explore Collection <ArrowRight size={16} />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCollections;
