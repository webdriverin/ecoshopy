import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './PromotionalAd.css';

const PromotionalAd = ({ ad }) => {
    if (!ad) return null;

    const {
        title,
        subtitle,
        content,
        image,
        ctaText,
        ctaLink,
        backgroundColor = 'var(--color-primary)',
        layout = 'Left'
    } = ad;

    const isImageBg = !!image;
    const alignClass = layout.toLowerCase() === 'center' ? 'justify-center text-center' : layout.toLowerCase() === 'right' ? 'justify-end text-right' : 'justify-start text-left';

    return (
        <section className="container">
            <div
                className="promo-section"
                style={{
                    backgroundColor: !isImageBg ? backgroundColor : 'transparent',
                    backgroundImage: isImageBg ? `url(${image})` : 'none'
                }}
            >
                {isImageBg && <div className="promo-overlay" />}

                <div className={`promo-content-wrapper ${alignClass}`} style={{ justifyContent: layout === 'Center' ? 'center' : layout === 'Right' ? 'flex-end' : 'flex-start' }}>
                    <div className="promo-content">
                        {subtitle && <span className="promo-subtitle">{subtitle}</span>}
                        <h2 className="promo-title">{title}</h2>
                        {content && (
                            <div
                                className="promo-description"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        )}
                        {ctaText && ctaLink && (
                            <Link to={ctaLink} className="promo-btn">
                                {ctaText} <ArrowRight size={20} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromotionalAd;
