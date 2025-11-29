import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    return (
        <div style={{
            display: 'flex',
            gap: '1.5rem',
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            alignItems: 'center'
        }}>
            <div style={{ width: '100px', height: '100px', flexShrink: 0, borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-text-main)' }}>{item.name}</h3>
                    <span style={{ fontWeight: '700', color: 'var(--color-primary)' }}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '1rem' }}>{item.category}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-full)',
                        padding: '0.25rem'
                    }}>
                        <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            style={{ padding: '0.25rem 0.5rem', color: item.quantity === 1 ? 'var(--color-text-lighter)' : 'var(--color-text-main)' }}
                            disabled={item.quantity === 1}
                        >
                            <Minus size={14} />
                        </button>
                        <span style={{ width: '30px', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600' }}>{item.quantity}</span>
                        <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            style={{ padding: '0.25rem 0.5rem' }}
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    <button
                        onClick={() => onRemove(item.id)}
                        style={{ color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}
                    >
                        <Trash2 size={16} /> Remove
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
