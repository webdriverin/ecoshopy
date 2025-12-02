import React from 'react';
import Button from '../UI/Button';
import { Package, ChevronRight } from 'lucide-react';

const OrderHistory = () => {
    // Enhanced Dummy data with images and more details
    const orders = [
        {
            id: 'ORD-12345',
            date: 'Oct 15, 2023',
            total: 4550.00,
            status: 'Delivered',
            items: [
                { name: 'Bamboo Toothbrush', price: 550.00, image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb6dcaf?auto=format&fit=crop&w=100&q=80', quantity: 2 },
                { name: 'Reusable Cotton Pads', price: 1200.00, image: 'https://images.unsplash.com/photo-1556228720-1957be83f315?auto=format&fit=crop&w=100&q=80', quantity: 1 }
            ]
        },
        {
            id: 'ORD-67890',
            date: 'Nov 02, 2023',
            total: 2400.00,
            status: 'Processing',
            items: [
                { name: 'Glass Water Bottle', price: 2400.00, image: 'https://images.unsplash.com/photo-1602143407151-01114192003b?auto=format&fit=crop&w=100&q=80', quantity: 1 }
            ]
        }
    ];

    const getStatusStep = (status) => {
        const steps = ['Placed', 'Processing', 'Shipped', 'Delivered'];
        return steps.indexOf(status) + 1;
    };

    return (
        <div>
            <h2 className="section-title">My Orders</h2>
            <div className="orders-list">
                {orders.map(order => (
                    <div key={order.id} className="order-card immersive">
                        <div className="order-header-immersive">
                            <div className="order-meta">
                                <span className="order-id">Order #{order.id}</span>
                                <span className="order-date">Placed on {order.date}</span>
                            </div>
                            <div className="order-total-badge">₹{order.total.toFixed(2)}</div>
                        </div>

                        {/* Visual Status Stepper */}
                        <div className="order-stepper">
                            {['Placed', 'Processing', 'Shipped', 'Delivered'].map((step, index) => {
                                const currentStep = getStatusStep(order.status);
                                const stepIndex = index + 1;
                                const isActive = stepIndex <= currentStep;
                                const isCompleted = stepIndex < currentStep;

                                return (
                                    <div key={step} className={`stepper-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                                        <div className="step-circle">
                                            {isCompleted ? '✓' : stepIndex}
                                        </div>
                                        <span className="step-label">{step}</span>
                                        {index < 3 && <div className={`step-line ${isCompleted ? 'completed' : ''}`}></div>}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="order-items-grid">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="order-item-card">
                                    <div className="item-image">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className="item-info">
                                        <div className="item-details">
                                            <h4>{item.name}</h4>
                                            <p className="item-qty">Qty: {item.quantity}</p>
                                            <p className="item-price">₹{item.price.toFixed(2)}</p>
                                        </div>
                                        <button className="btn-buy-again">Buy Again</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="order-footer-immersive">
                            <Button variant="secondary" size="small" className="track-btn">
                                Track Order <ChevronRight size={16} />
                            </Button>
                            <Button variant="outline" size="small">
                                View Invoice
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistory;
