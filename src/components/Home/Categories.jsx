import React from 'react';
import { Link } from 'react-router-dom';
import './Categories.css';

const Categories = () => {
    const categories = [
        { name: 'Home Products', image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f98091?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: '/shop?category=Home Products' },
        { name: 'Fashion', image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: '/shop?category=Fashion' },
        { name: 'Electronics', image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: '/shop?category=Electronics' },
        { name: 'Accessories', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: '/shop?category=Accessories' },
        { name: 'Personal Care', image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb6dcaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: '/shop?category=Personal Care' },
        { name: 'Beauty', image: 'https://images.unsplash.com/photo-1556228720-1957be83f304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', link: '/shop?category=Beauty' },
    ];

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
