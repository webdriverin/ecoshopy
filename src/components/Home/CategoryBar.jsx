import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FirebaseService from '../../services/FirebaseService';
import './CategoryBar.css';

const CategoryBar = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await FirebaseService.getCategories();
                if (data.length > 0) {
                    setCategories(data);
                } else {
                    // Fallback / Demo Data
                    setCategories([]);
                }
            } catch (error) {
                console.error("Error fetching categories", error);
            }
        };
        fetchCategories();
    }, []);

    if (categories.length === 0) return null;

    return (
        <section className="category-bar-section">
            <div className="container category-bar-container">
                {categories.map((cat, index) => {
                    let linkDestination = `/shop?category=${encodeURIComponent(cat.name)}`;

                    if (cat.link) {
                        if (cat.link.startsWith('/') || cat.link.startsWith('http')) {
                            linkDestination = cat.link;
                        } else {
                            linkDestination = `/shop?category=${encodeURIComponent(cat.link)}`;
                        }
                    }

                    return (
                        <Link key={index} to={linkDestination} className="category-item">
                            <div className="category-image-wrapper">
                                <img src={cat.image} alt={cat.name} className="category-bar-img" />
                            </div>
                            <span className="category-label">{cat.name}</span>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default CategoryBar;
