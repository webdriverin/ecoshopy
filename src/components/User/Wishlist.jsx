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
            <h2 className="section-title">My Wishlist</h2>
            <div className="wishlist-grid">
                {wishlistItems.map(item => (
                    <div key={item.id} className="wishlist-item">
                        <div className="wishlist-image">
                            {/* Placeholder for image */}
                        </div>
                        <div className="wishlist-content">
                            <h3 className="wishlist-name">{item.name}</h3>
                            <div className="wishlist-price">₹{item.price.toFixed(2)}</div>
                            <div className="wishlist-actions">
                                <Button variant="primary" size="small" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem' }}>
                                    <ShoppingCart size={16} /> Add
                                </Button>
                                <button className="btn-remove">
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
