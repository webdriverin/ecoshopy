import React from 'react';
import './BrandCarousel.css';

// Mock Brand Logos (using placeholders for now)
const brands = [
    { name: 'Nike', logo: 'https://placehold.co/150x80?text=Nike' },
    { name: 'Adidas', logo: 'https://placehold.co/150x80?text=Adidas' },
    { name: 'Puma', logo: 'https://placehold.co/150x80?text=Puma' },
    { name: 'Reebok', logo: 'https://placehold.co/150x80?text=Reebok' },
    { name: 'Under Armour', logo: 'https://placehold.co/150x80?text=Under+Armour' },
    { name: 'New Balance', logo: 'https://placehold.co/150x80?text=New+Balance' },
    { name: 'Asics', logo: 'https://placehold.co/150x80?text=Asics' },
    { name: 'Fila', logo: 'https://placehold.co/150x80?text=Fila' },
];

const BrandCarousel = () => {
    return (
        <section className="brand-carousel-section">
            <div className="container">
                <h2 className="section-title">Top Brands</h2>
                <div className="brand-carousel-wrapper">
                    <div className="brand-track">
                        {/* Double the brands for infinite scroll effect */}
                        {[...brands, ...brands].map((brand, index) => (
                            <div key={index} className="brand-item">
                                <img src={brand.logo} alt={brand.name} className="brand-logo" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BrandCarousel;
