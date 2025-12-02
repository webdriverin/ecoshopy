import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FirebaseService from '../../services/FirebaseService';
import { ArrowRight, ShoppingBag } from 'lucide-react';

const NewArrivals = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const allProducts = await FirebaseService.getProducts();
                // Sort by creation date (assuming createdAt exists, otherwise just take the last ones)
                // If createdAt is not available, we can just take the last 4 items from the array as a proxy for "newest"
                // or shuffle them. For now, let's assume we want the last 4 added.
                const newProducts = allProducts.slice(-4).reverse();
                setProducts(newProducts);
            } catch (error) {
                console.error("Error fetching new arrivals", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading || products.length === 0) return null;

    return (
        <section style={{ padding: '6rem 2rem', backgroundColor: 'var(--color-bg-card)' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'end',
                    marginBottom: '3rem'
                }}>
                    <div>
                        <h2 style={{
                            fontSize: '2.5rem',
                            fontWeight: '800',
                            color: '#1a1a1a',
                            marginBottom: '0.5rem',
                            letterSpacing: '-0.02em'
                        }}>
                            New Arrivals
                        </h2>
                        <p style={{ color: '#666', fontSize: '1.1rem' }}>
                            The latest additions to our collection.
                        </p>
                    </div>
                    <Link to="/shop" style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#1a1a1a',
                        fontWeight: '600',
                        textDecoration: 'none',
                        borderBottom: '2px solid #1a1a1a',
                        paddingBottom: '2px'
                    }}>
                        View All <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                    </Link>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '2.5rem'
                }}>
                    {products.map(product => (
                        <Link
                            key={product.id}
                            to={`/product/${product.id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div style={{
                                group: 'card',
                                cursor: 'pointer',
                                transition: 'transform 0.3s ease'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{
                                    position: 'relative',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    marginBottom: '1.5rem',
                                    aspectRatio: '1/1.2',
                                    backgroundColor: '#f3f4f6'
                                }}>
                                    <img
                                        src={(product.images && product.images.length > 0) ? product.images[0] : (product.image || 'https://placehold.co/400')}
                                        alt={product.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.5s ease'
                                        }}
                                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                    />
                                    {/* New Badge */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        left: '12px',
                                        backgroundColor: '#1a1a1a',
                                        color: 'white',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600'
                                    }}>
                                        NEW
                                    </div>
                                    {/* Quick Add Button */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '12px',
                                        right: '12px',
                                        backgroundColor: 'white',
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        transition: 'transform 0.2s ease',
                                        opacity: 0.9
                                    }}>
                                        <ShoppingBag size={18} color="#1a1a1a" />
                                    </div>
                                </div>

                                <div>
                                    <h3 style={{
                                        fontSize: '1.1rem',
                                        fontWeight: '600',
                                        marginBottom: '0.5rem',
                                        color: '#1a1a1a'
                                    }}>
                                        {product.name}
                                    </h3>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <span style={{
                                            fontSize: '1rem',
                                            color: '#666'
                                        }}>
                                            {product.category}
                                        </span>
                                        <span style={{
                                            fontSize: '1.1rem',
                                            fontWeight: '700',
                                            color: '#1a1a1a'
                                        }}>
                                            ₹{product.price}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewArrivals;
