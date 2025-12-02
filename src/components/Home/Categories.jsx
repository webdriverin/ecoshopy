import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FirebaseService from '../../services/FirebaseService';
import './Categories.css';

const Categories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await FirebaseService.getCategories();
                // If no categories in DB, fallback to some defaults or empty
                if (data.length > 0) {
                    setCategories(data);
                } else {
                    // Fallback for demo if DB is empty
                    setCategories([
                        { name: 'Home Products', image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f98091?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: '/shop?category=Home Products' },
                        { name: 'Fashion', image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: '/shop?category=Fashion' },
                        { name: 'Electronics', image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: '/shop?category=Electronics' },
                    ]);
                }
            } catch (error) {
                console.error("Error fetching categories", error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <section className="categories-section">
            <div className="container">
                <h2 className="section-title">Shop by Category</h2>
                <div className="categories-grid">
                    {categories.map((cat, index) => (
                        <Link key={index} to={cat.link} className="category-card">
                            <div className="category-bg" style={{ backgroundImage: `url(${cat.image})` }}></div>
                            <div className="category-overlay"></div>
                            <div className="category-content">
                                <h3 className="category-title">{cat.name}</h3>
                                <span className="category-btn">Explore</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;
