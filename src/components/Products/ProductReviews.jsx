import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import FirebaseService from '../../services/FirebaseService';
import Button from '../UI/Button';

const ProductReviews = ({ productId, currentRating, reviewCount }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRating, setUserRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [hasRated, setHasRated] = useState(false);

    useEffect(() => {
        fetchReviews();
        // Check local storage to see if user already rated this product
        const ratedProducts = JSON.parse(localStorage.getItem('ratedProducts') || '[]');
        if (ratedProducts.includes(productId)) {
            setHasRated(true);
        }
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const data = await FirebaseService.getReviews(productId);
            setReviews(data);
        } catch (error) {
            console.error("Error fetching reviews", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRating = async (rating) => {
        if (hasRated || submitting) return;

        setSubmitting(true);
        setUserRating(rating);

        try {
            // 1. Add the review (rating only)
            const newReview = {
                productId,
                rating: rating,
                createdAt: new Date().toISOString()
            };
            await FirebaseService.addReview(newReview);

            // 2. Calculate new average rating
            const totalRating = (currentRating * reviewCount) + rating;
            const newCount = reviewCount + 1;
            const newAverage = totalRating / newCount;

            // 3. Update product
            await FirebaseService.updateProductRating(productId, newAverage, newCount);

            // 4. Update Local State
            setHasRated(true);
            const ratedProducts = JSON.parse(localStorage.getItem('ratedProducts') || '[]');
            localStorage.setItem('ratedProducts', JSON.stringify([...ratedProducts, productId]));

            await fetchReviews();
            window.location.reload();

        } catch (error) {
            console.error("Error submitting rating", error);
            alert("Failed to submit rating");
            setSubmitting(false);
        }
    };

    // Calculate Distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
        if (distribution[r.rating] !== undefined) {
            distribution[r.rating]++;
        }
    });
    const totalReviews = reviews.length || 1; // Avoid division by zero

    return (
        <div style={{ marginTop: '0' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Customer Ratings</h3>

            <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
                {/* Summary Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: '1', color: '#1F2937' }}>
                            {currentRating ? currentRating.toFixed(1) : '0.0'}
                        </div>
                        <div style={{ display: 'flex', color: '#FBBF24', margin: '0.5rem 0' }}>
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={20} fill={i < Math.round(currentRating || 0) ? "currentColor" : "none"} stroke="currentColor" />
                            ))}
                        </div>
                        <div style={{ color: '#6B7280', fontSize: '0.9rem' }}>{reviewCount} ratings</div>
                    </div>

                    {/* Distribution Bars */}
                    <div style={{ flex: 1 }}>
                        {[5, 4, 3, 2, 1].map(star => (
                            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <span style={{ width: '10px', fontSize: '0.9rem', fontWeight: '500' }}>{star}</span>
                                <Star size={14} color="#6B7280" />
                                <div style={{ flex: 1, height: '8px', backgroundColor: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${(distribution[star] / totalReviews) * 100}%`,
                                        height: '100%',
                                        backgroundColor: '#FBBF24',
                                        borderRadius: '4px'
                                    }}></div>
                                </div>
                                <span style={{ width: '30px', fontSize: '0.85rem', color: '#6B7280', textAlign: 'right' }}>
                                    {distribution[star]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rate This Product */}
                {!hasRated ? (
                    <div style={{
                        borderTop: '1px solid var(--color-border)',
                        paddingTop: '1.5rem',
                        textAlign: 'center'
                    }}>
                        <p style={{ marginBottom: '1rem', fontWeight: '500' }}>Rate this product</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => handleRating(star)}
                                    disabled={submitting}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'transform 0.1s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <Star
                                        size={32}
                                        fill={star <= userRating ? "#FBBF24" : "none"}
                                        stroke={star <= userRating ? "#FBBF24" : "#D1D5DB"}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{
                        borderTop: '1px solid var(--color-border)',
                        paddingTop: '1.5rem',
                        textAlign: 'center',
                        color: 'var(--color-success)',
                        fontWeight: '500'
                    }}>
                        Thanks for rating!
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductReviews;
