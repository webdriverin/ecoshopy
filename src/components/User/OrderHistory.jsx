import React from 'react';
import Button from '../UI/Button';
import { Package, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FirebaseService from '../../services/FirebaseService';

const OrderHistory = ({ viewMode = 'all', layout = 'card', showTitle = true }) => {
    // Enhanced Dummy data with images and more details
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchOrders = async () => {
            if (!user.uid) return;
            try {
                // Pass userId to fetch only this user's orders
                let userOrders = await FirebaseService.getOrders(user.uid);

                if (viewMode === 'active') {
                    // Filter out delivered orders older than 24 hours
                    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                    userOrders = userOrders.filter(order => {
                        if (order.status !== 'DELIVERED') return true;
                        const deliveryDate = order.orderTimeline?.deliveredAt ? new Date(order.orderTimeline.deliveredAt) : new Date(order.updatedAt || order.createdAt);
                        return deliveryDate > oneDayAgo;
                    });
                } else if (viewMode === 'delivered') {
                    userOrders = userOrders.filter(order => order.status === 'DELIVERED');
                }

                // Sort by date desc
                setOrders(userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } catch (error) {
                console.error("Error fetching orders", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user.uid, user.email, viewMode]);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-light)' }}>Loading orders...</div>;

    if (orders.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                <Package size={48} color="var(--color-text-light)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>No orders found</h3>
                <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>Looks like you haven't placed any orders yet.</p>
                <Button variant="primary" onClick={() => navigate('/shop')}>Start Shopping</Button>
            </div>
        );
    }

    const getStatusStep = (status) => {
        const steps = ['INITIATED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
        return steps.indexOf(status) + 1;
    };

    if (layout === 'table') {
        return (
            <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Items</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium text-gray-900">#{order.id.substring(0, 8).toUpperCase()}</td>
                                <td className="p-4 text-gray-600 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <div className="flex -space-x-2 overflow-hidden">
                                        {order.items.slice(0, 3).map((item, idx) => (
                                            <img
                                                key={idx}
                                                className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                                                src={item.image}
                                                alt={item.name}
                                                title={item.name}
                                            />
                                        ))}
                                        {order.items.length > 3 && (
                                            <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 text-xs font-medium text-gray-600">
                                                +{order.items.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
                                </td>
                                <td className="p-4 font-semibold text-gray-900">₹{(order.totalAmount || order.total || 0).toFixed(2)}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button
                                        onClick={() => window.open(`/invoice/${order.id}`, '_blank')}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                        title="View Invoice"
                                    >
                                        <Package size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div>
            {showTitle && <h2 className="section-title">Order History</h2>}
            <div className="orders-list">
                {orders.map(order => (
                    <div key={order.id} className="order-card immersive">
                        <div className="order-header-immersive">
                            <div className="order-meta">
                                <span className="order-id">Order #{order.id.substring(0, 8).toUpperCase()}</span>
                                <span className="order-date">Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="order-total-badge">₹{(order.totalAmount || order.total || 0).toFixed(2)}</div>
                        </div>

                        {/* Visual Status Stepper */}
                        <div className="order-stepper">
                            {['Placed', 'Processing', 'Shipped', 'Delivered'].map((stepLabel, index) => {

                                const currentStep = getStatusStep(order.status);
                                const stepIndex = index + 1;
                                const isActive = stepIndex <= currentStep;
                                const isCompleted = stepIndex < currentStep;

                                return (
                                    <div key={stepLabel} className={`stepper-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                                        <div className="step-circle">
                                            {isCompleted ? '✓' : stepIndex}
                                        </div>
                                        <span className="step-label">{stepLabel}</span>
                                        {index < 3 && <div className={`step-line ${isCompleted ? 'completed' : ''}`}></div>}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="order-items-grid">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="order-item-card">
                                    <div
                                        className="item-image"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => navigate(`/product/${item.productId}`)}
                                    >
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className="item-info">
                                        <div className="item-details">
                                            <h4
                                                onClick={() => navigate(`/product/${item.productId}`)}
                                                style={{ cursor: 'pointer', display: 'inline-block' }}
                                                className="hover:text-primary transition-colors"
                                            >
                                                {item.name}
                                            </h4>
                                            <p className="item-qty">Qty: {item.quantity}</p>
                                            <p className="item-price">₹{item.price.toFixed(2)}</p>
                                        </div>
                                        <button
                                            className="btn-buy-again"
                                            onClick={() => navigate(`/product/${item.productId}`)}
                                        >
                                            Buy Again
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="order-footer-immersive">
                            <Button
                                variant="secondary"
                                size="small"
                                className="track-btn"
                                onClick={() => alert(`Tracking details for Order #${order.id} will be available soon!`)}
                            >
                                Track Order <ChevronRight size={16} />
                            </Button>
                            <Button
                                variant="outline"
                                size="small"
                                onClick={() => window.open(`/invoice/${order.id}`, '_blank')}
                            >
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
