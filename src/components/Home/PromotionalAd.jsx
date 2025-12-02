import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';
import { ArrowRight } from 'lucide-react';

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
        layout = 'Center',
        buttonColor,
        buttonTextColor
    } = ad;

    const isImageBg = !!image;
    const align = layout.toLowerCase();

    const containerStyle = {
        position: 'relative',
        padding: '5rem 0',
        backgroundColor: isImageBg ? 'transparent' : backgroundColor,
        backgroundImage: isImageBg ? `url(${image})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        textAlign: align,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    };

    const overlayStyle = isImageBg ? {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))',
        zIndex: 1
    } : {};

    const contentStyle = {
        position: 'relative',
        zIndex: 2,
        maxWidth: '800px',
        margin: align === 'center' ? '0 auto' : align === 'left' ? '0 auto 0 0' : '0 0 0 auto',
        padding: '0 2rem'
    };

    return (
        <section style={containerStyle}>
            {isImageBg && <div style={overlayStyle} />}
            <div className="container">
                <div style={contentStyle}>
                    {subtitle && (
                        <span style={{
                            display: 'inline-block',
                            marginBottom: '1rem',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            opacity: 0.9
                        }}>
                            {subtitle}
                        </span>
                    )}
                    <h2 style={{
                        fontSize: '2.5rem',
                        marginBottom: '1rem',
                        fontWeight: '800',
                        lineHeight: 1.2,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                        {title}
                    </h2>
                    {content && (
                        <div
                            dangerouslySetInnerHTML={{ __html: content }}
                            style={{
                                fontSize: '1.125rem',
                                marginBottom: '2rem',
                                opacity: 0.9,
                                maxWidth: '600px',
                                marginLeft: align === 'center' ? 'auto' : 0,
                                marginRight: align === 'center' ? 'auto' : 0
                            }}
                        />
                    )}
                    {ctaText && ctaLink && (
                        <Link
                            to={ctaLink}
                            style={{
                                display: 'inline-block',
                                backgroundColor: buttonColor || 'white',
                                color: buttonTextColor || 'var(--color-text-dark)',
                                padding: '0.75rem 1.5rem',
                                borderRadius: 'var(--radius-full)',
                                textDecoration: 'none',
                                fontWeight: '600',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            {ctaText} <ArrowRight size={18} style={{ marginLeft: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} />
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PromotionalAd;
