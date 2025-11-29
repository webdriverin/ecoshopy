import React from 'react';
import { useParams } from 'react-router-dom';
import ProductGallery from '../components/Products/ProductGallery';
import ProductInfo from '../components/Products/ProductInfo';
import RelatedProducts from '../components/Products/RelatedProducts';

import Breadcrumbs from '../components/UI/Breadcrumbs';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();

    // Dummy data
    const product = {
        id: id || '1',
        name: 'Bamboo Toothbrush Set',
        price: 12.99,
        description: 'Switch to a sustainable alternative with our biodegradable bamboo toothbrush set. Made from 100% organic bamboo, these toothbrushes are naturally antimicrobial and eco-friendly. The bristles are made from BPA-free nylon, ensuring a gentle yet effective clean. Perfect for the whole family.',
        category: 'Personal Care',
        rating: 4.5,
        reviews: 128,
        stock: 50,
        sku: 'BAM-TB-001',
        images: [
            'https://placehold.co/600x600/e2e8f0/1e293b?text=Bamboo+Toothbrush',
            'https://placehold.co/600x600/e2e8f0/1e293b?text=Detail+View',
            'https://placehold.co/600x600/e2e8f0/1e293b?text=Lifestyle+Shot'
        ]
    };

    const breadcrumbItems = [
        { label: 'Shop', path: '/shop' },
        { label: product.category, path: `/shop?category=${product.category}` },
        { label: product.name, path: '#' }
    ];

    const relatedProducts = [
        { id: '2', name: 'Reusable Cotton Pads', price: 18.50, category: 'Beauty', rating: 4.8, reviews: 85, image: 'https://images.unsplash.com/photo-1556228720-1957be83f304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: '3', name: 'Glass Water Bottle', price: 24.00, category: 'Accessories', rating: 4.7, reviews: 210, image: 'https://images.unsplash.com/photo-1602143407151-01114192003f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: '4', name: 'Eco-Friendly Tote Bag', price: 15.00, category: 'Fashion', rating: 4.6, reviews: 95, image: 'https://images.unsplash.com/photo-1597484662317-c93100d013ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    ];

    return (
        <div className="container product-details-container">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="product-details-grid">
                <ProductGallery images={product.images} />
                <ProductInfo product={product} />
            </div>

            <RelatedProducts products={relatedProducts} />
        </div>
    );
};

export default ProductDetails;
