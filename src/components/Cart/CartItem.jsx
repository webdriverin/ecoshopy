import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    return (
        <div className="cart-item">
            <div className="cart-item-image">
                <img
                    src={item.images && item.images.length > 0 ? item.images[0] : (item.imageUrl || 'https://placehold.co/100x100?text=No+Image')}
                    alt={item.name}
                />
            </div>

            <div className="cart-item-content">
                <div className="cart-item-header">
                    <h3 className="cart-item-title">{item.name}</h3>
                    <span className="cart-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <p className="cart-item-category">{item.category}</p>

                <div className="cart-item-actions">
                    <div className="quantity-controls">
                        <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="qty-btn"
                            disabled={item.quantity === 1}
                        >
                            <Minus size={14} />
                        </button>
                        <span className="qty-display">{item.quantity}</span>
                        <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="qty-btn"
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    <button
                        onClick={() => onRemove(item.id)}
                        className="remove-btn"
                    >
                        <Trash2 size={16} /> Remove
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
