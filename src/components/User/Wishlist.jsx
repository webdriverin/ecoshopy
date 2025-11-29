import React from 'react';
import Button from '../UI/Button';
import { ShoppingCart, Trash2 } from 'lucide-react';

const Wishlist = () => {
    // Dummy data
    const wishlistItems = [
        { id: '1', name: 'Bamboo Toothbrush', price: 12.99, image: 'toothbrush.jpg' },
        { id: '4', name: 'Eco Tote Bag', price: 15.00, image: 'totebag.jpg' }
    ];

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem' }}>My Wishlist</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {wishlistItems.map(item => (
                    <div key={item.id} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                        <div style={{ height: '150px', backgroundColor: '#F3F4F6' }}></div>
                        <div style={{ padding: '1rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{item.name}</h3>
                            <div style={{ fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '1rem' }}>${item.price.toFixed(2)}</div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Button variant="primary" size="small" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem' }}>
                                    <ShoppingCart size={16} /> Add
                                </Button>
                                <button style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'white', color: 'var(--color-error)', cursor: 'pointer' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
