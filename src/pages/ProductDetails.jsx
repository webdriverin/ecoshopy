import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductGallery from '../components/Products/ProductGallery';
import ProductInfo from '../components/Products/ProductInfo';
import ProductReviews from '../components/Products/ProductReviews';
import RelatedProducts from '../components/Products/RelatedProducts';
import FirebaseService from '../services/FirebaseService';

import Breadcrumbs from '../components/UI/Breadcrumbs';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await FirebaseService.getProductById(id);
                setProduct(data);

                // Fetch related products (just random for now)
                const allProducts = await FirebaseService.getFeaturedProducts();
                setRelatedProducts(allProducts.filter(p => p.id !== id).slice(0, 4));
            } catch (error) {
                console.error("Error fetching product", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    // Ensure images array exists
    const images = React.useMemo(() => (product?.images && product.images.length > 0)
        ? product.images
        : (product?.imageUrl ? [product.imageUrl] : ['https://placehold.co/600x600?text=No+Image']), [product]);

    // Color Filtering Logic
    const [selectedColor, setSelectedColor] = useState(null);
    const [filteredImages, setFilteredImages] = useState([]);

    useEffect(() => {
        if (product) {
            if (selectedColor && product.imageColors) {
                // Filter images that match the selected color
                // Note: imageColors is a map { url: color }
                const newImages = images.filter(img => product.imageColors[img] === selectedColor);
                if (newImages.length > 0) {
                    setFilteredImages(newImages);
                } else {
                    // If no specific image for this color, show all (or maybe show default?)
                    setFilteredImages(images);
                }
            } else {
                setFilteredImages(images);
            }
        }
    }, [selectedColor, product, images]); // Dependencies

    if (loading) {
        return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading...</div>;
    }

    if (!product) {
        return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Product not found</div>;
    }

    const breadcrumbItems = [
        { label: 'Shop', path: '/shop' },
        { label: product.category || 'Product', path: `/shop?category=${product.category}` },
        { label: product.name, path: '#' }
    ];

    // Extract Color Attribute if exists
    const colorAttribute = product.attributes?.find(a => a.key.toLowerCase() === 'color');
    const availableColors = colorAttribute ? colorAttribute.value.split(',').map(c => c.trim()) : [];

    return (
        <div className="container product-details-container">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="product-details-grid">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    <ProductGallery images={filteredImages} />

                </div>
                <div className="product-info-wrapper">
                    <ProductInfo product={product} />

                    {/* Attributes / Specifications */}
                    {product.attributes && product.attributes.length > 0 && (
                        <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                            {/* Color Selection */}
                            {availableColors.length > 0 && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <span style={{ fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Color: {selectedColor || 'All'}</span>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => setSelectedColor(null)}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                border: selectedColor === null ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                                borderRadius: 'var(--radius-md)',
                                                backgroundColor: 'white',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            All
                                        </button>
                                        {availableColors.map(color => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    border: selectedColor === color ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                                    borderRadius: 'var(--radius-md)',
                                                    backgroundColor: 'white',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Other Attributes Table */}
                            <div style={{ padding: '1.5rem', backgroundColor: '#F9FAFB', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Specifications</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
                                    {product.attributes.filter(a => a.key.toLowerCase() !== 'color').map((attr, index) => (
                                        <React.Fragment key={index}>
                                            <div style={{ fontWeight: '600', color: 'var(--color-text-light)' }}>{attr.key}</div>
                                            <div>{attr.value}</div>
                                        </React.Fragment>
                                    ))}
                                    {product.attributes.filter(a => a.key.toLowerCase() !== 'color').length === 0 && (
                                        <div style={{ gridColumn: '1 / -1', color: 'var(--color-text-light)' }}>No additional specifications.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Product Features Section */}
                    {product.features && product.features.length > 0 && (
                        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#F9FAFB', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Product Highlights</h3>
                            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {product.features.map((feature, index) => (
                                    <li key={index} style={{ listStyleType: 'disc' }}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div style={{ marginTop: '2rem' }}>
                        <ProductReviews
                            productId={product.id}
                            currentRating={product.rating || 0}
                            reviewCount={product.reviews || 0}
                        />
                    </div>
                </div>
            </div>

            <RelatedProducts products={relatedProducts} />
        </div>
    );
};

export default ProductDetails;
