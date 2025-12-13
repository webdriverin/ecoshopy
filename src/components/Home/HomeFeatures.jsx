import React from 'react';
import { ShieldCheck, Leaf, Truck, CreditCard } from 'lucide-react';
import './HomeFeatures.css';

const features = [
    {
        icon: <Leaf size={32} />,
        title: "100% Organic",
        description: "Sourced directly from certified organic farms."
    },

    {
        icon: <ShieldCheck size={32} />,
        title: "Secure Payment",
        description: "100% secure payment with 256-bit encryption."
    },
    {
        icon: <CreditCard size={32} />,
        title: "Easy Returns",
        description: "No questions asked return policy within 7 days."
    }
];

const HomeFeatures = () => {
    return (
        <section className="home-features">
            <div className="container features-grid">
                {features.map((feature, index) => (
                    <div key={index} className="feature-item">
                        <div className="feature-icon">{feature.icon}</div>
                        <div className="feature-text">
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-desc">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HomeFeatures;
