import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FirebaseService from '../services/FirebaseService';
import ProductCard from '../components/Products/ProductCard';
import { ArrowLeft } from 'lucide-react';

const CollectionProducts = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [collection, setCollection] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Collection Details
                const collectionData = await FirebaseService.getOfferById(id);
                setCollection(collectionData);

                // 2. Fetch All Products (or filter if possible)
                // Note: Ideally we should query by IDs, but for now fetching all and filtering is safer 
                // if we don't have a specific 'getProductsByIds' method.
                const allProducts = await FirebaseService.getProducts();

                // 3. Filter products that are in the collection
                // Assuming collectionData.products is an array of product IDs or names.
                // Based on ProductOffersManager, it seems to store product names or IDs. 
                // Let's assume it stores IDs or we match by name if that's how it was saved.
                // Checking ProductOffersManager: options={products} where products is array of {label, value}.
                // So it likely saves the 'value' which is product.name (based on: value: p.name).
                // Wait, let's verify what is saved.
                // In ProductOffersManager: options: products.map(p => ({ label: p.name, value: p.name }))
                // So it saves Product Names.

                if (collectionData.products && Array.isArray(collectionData.products)) {
                    const collectionProductNames = collectionData.products;
                    const filtered = allProducts.filter(p => collectionProductNames.includes(p.name));
                    setProducts(filtered);
                } else {
                    setProducts([]);
                }

            } catch (error) {
                console.error("Error fetching collection data", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    if (loading) {
        return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
    }

    if (!collection) {
        return <div style={{ padding: '4rem', textAlign: 'center' }}>Collection not found.</div>;
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <button
                onClick={() => navigate('/')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '2rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-light)'
                }}
            >
                <ArrowLeft size={20} /> Back to Home
            </button>

            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--color-text-main)' }}>
                    {collection.name}
                </h1>
                {collection.description && (
                    <p style={{ fontSize: '1.1rem', color: 'var(--color-text-light)', maxWidth: '600px', margin: '0 auto' }}>
                        {collection.description}
                    </p>
                )}
            </div>

            {products.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '2rem'
                }}>
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-light)' }}>
                    No products found in this collection.
                </div>
            )}
        </div>
    );
};

export default CollectionProducts;
