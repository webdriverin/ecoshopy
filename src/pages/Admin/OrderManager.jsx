import React, { useState, useEffect } from 'react';
import { Eye, Search, Filter, X, Calendar, CheckCircle, Clock, Truck, Package, AlertCircle, CreditCard } from 'lucide-react';
import FirebaseService from '../../services/FirebaseService';
import Button from '../../components/UI/Button';

const OrderManager = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [dateFilter, setDateFilter] = useState('All Time');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await FirebaseService.getOrders();
            // Sort by date desc (newest first)
            const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedData);
        } catch (error) {
            console.error("Error fetching orders", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await FirebaseService.updateOrderStatus(id, newStatus);
            setOrders(orders.map(order =>
                order.id === id ? { ...order, status: newStatus } : order
            ));
            if (selectedOrder && selectedOrder.id === id) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (error) {
            console.error("Error updating status", error);
            alert("Failed to update status");
        }
    };

    const filterOrders = () => {
        return orders.filter(order => {
            const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
            const matchesPaymentStatus = paymentStatusFilter === 'All' || order.paymentStatus === paymentStatusFilter;

            let matchesDate = true;
            const orderDate = new Date(order.createdAt);
            const today = new Date();

            if (dateFilter === 'Today') {
                matchesDate = orderDate.toDateString() === today.toDateString();
            } else if (dateFilter === 'Last 7 Days') {
                const last7Days = new Date(today.setDate(today.getDate() - 7));
                matchesDate = orderDate >= last7Days;
            } else if (dateFilter === 'Last 30 Days') {
                const last30Days = new Date(today.setDate(today.getDate() - 30));
                matchesDate = orderDate >= last30Days;
            }

            return matchesSearch && matchesStatus && matchesPaymentStatus && matchesDate;
        });
    };

    const filteredOrders = filterOrders();

    const getStatusColor = (status) => {
        switch (status) {
            case 'DELIVERED': return '#10B981'; // Green
            case 'SHIPPED': return '#3B82F6'; // Blue
            case 'PROCESSING': return '#F59E0B'; // Orange
            case 'CANCELLED': return '#EF4444'; // Red
            case 'INITIATED': return '#6B7280'; // Gray
            default: return '#6B7280'; // Gray
        }
    };

    const getStatusBg = (status) => {
        switch (status) {
            case 'DELIVERED': return '#D1FAE5';
            case 'SHIPPED': return '#DBEAFE';
            case 'PROCESSING': return '#FEF3C7';
            case 'CANCELLED': return '#FEE2E2';
            case 'INITIATED': return '#F3F4F6';
            default: return '#F3F4F6';
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--color-text-main)' }}>Order Management</h1>
                    <p style={{ color: 'var(--color-text-light)' }}>Track and manage customer orders</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ padding: '0.5rem 1rem', backgroundColor: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Total Orders:</span>
                        <span style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{orders.length}</span>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                    <Search size={18} color="var(--color-text-light)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', outline: 'none' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Filter size={16} color="var(--color-text-light)" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', outline: 'none', cursor: 'pointer' }}
                        >
                            <option value="All">All Status</option>
                            <option value="INITIATED">Initiated</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CreditCard size={16} color="var(--color-text-light)" />
                        <select
                            value={paymentStatusFilter}
                            onChange={(e) => setPaymentStatusFilter(e.target.value)}
                            style={{ padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', outline: 'none', cursor: 'pointer' }}
                        >
                            <option value="All">All Payments</option>
                            <option value="PAID">Paid</option>
                            <option value="AWAITING_PAYMENT">Awaiting Payment</option>
                            <option value="FAILED">Failed</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={16} color="var(--color-text-light)" />
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            style={{ padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', outline: 'none', cursor: 'pointer' }}
                        >
                            <option value="All Time">All Time</option>
                            <option value="Today">Today</option>
                            <option value="Last 7 Days">Last 7 Days</option>
                            <option value="Last 30 Days">Last 30 Days</option>
                        </select>
                    </div>
                </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-light)' }}>Loading orders...</div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                            <thead style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid var(--color-border)' }}>
                                <tr>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-light)' }}>Order ID</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-light)' }}>Customer</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-light)' }}>Date</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-light)' }}>Total</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-light)' }}>Payment</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-light)' }}>Status</th>
                                    <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-light)' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                                <Search size={40} color="#E5E7EB" />
                                                <p>No orders found matching your filters.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map(order => (
                                        <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background-color 0.2s' }} className="hover:bg-gray-50">
                                            <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--color-primary)' }}>#{order.id.substring(0, 8).toUpperCase()}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: '500' }}>{order.customerName || 'Guest'}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>{order.email}</div>
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td style={{ padding: '1rem', fontWeight: '600' }}>₹{order.totalAmount}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.6rem',
                                                    borderRadius: '999px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    backgroundColor: order.paymentStatus === 'PAID' ? '#D1FAE5' : order.paymentStatus === 'FAILED' ? '#FEE2E2' : '#FEF3C7',
                                                    color: order.paymentStatus === 'PAID' ? '#065F46' : order.paymentStatus === 'FAILED' ? '#991B1B' : '#92400E'
                                                }}>
                                                    {order.paymentStatus || 'AWAITING_PAYMENT'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.6rem',
                                                    borderRadius: '999px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    backgroundColor: getStatusBg(order.status),
                                                    color: getStatusColor(order.status),
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem'
                                                }}>
                                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: getStatusColor(order.status) }}></span>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    style={{
                                                        padding: '0.5rem',
                                                        borderRadius: 'var(--radius-md)',
                                                        border: '1px solid var(--color-border)',
                                                        backgroundColor: 'white',
                                                        cursor: 'pointer',
                                                        color: 'var(--color-text-main)',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }} onClick={() => setSelectedOrder(null)}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: 'var(--radius-lg)',
                        width: '100%',
                        maxWidth: '800px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        boxShadow: 'var(--shadow-lg)',
                        position: 'relative'
                    }} onClick={e => e.stopPropagation()}>

                        {/* Modal Header */}
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10 }}>
                            <div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem' }}>Order Details</h2>
                                <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>ID: #{selectedOrder.id.substring(0, 8).toUpperCase()}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-light)' }}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div style={{ padding: '1.5rem' }}>

                            {/* Status Bar */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F9FAFB', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
                                <div>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '0.25rem' }}>Current Status</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '999px',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            backgroundColor: getStatusBg(selectedOrder.status),
                                            color: getStatusColor(selectedOrder.status)
                                        }}>
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Update Status:</span>
                                    <select
                                        value={selectedOrder.status}
                                        onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                                        style={{
                                            padding: '0.5rem',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--color-border)',
                                            fontSize: '0.875rem',
                                            cursor: 'pointer',
                                            outline: 'none'
                                        }}
                                    >
                                        <option value="INITIATED">Initiated</option>
                                        <option value="PROCESSING">Processing</option>
                                        <option value="SHIPPED">Shipped</option>
                                        <option value="DELIVERED">Delivered</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            {/* Payment Information Section - NEW */}
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <CreditCard size={18} /> Payment Information
                                </h3>
                                <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1rem', backgroundColor: '#F9FAFB' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                        <div>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>Payment Status</p>
                                            <p style={{ fontWeight: '600', color: selectedOrder.paymentStatus === 'PAID' ? '#059669' : selectedOrder.paymentStatus === 'FAILED' ? '#DC2626' : '#D97706' }}>
                                                {selectedOrder.paymentStatus}
                                            </p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>Payment Method</p>
                                            <p style={{ fontWeight: '600' }}>{selectedOrder.paymentMethod || 'Razorpay'}</p>
                                        </div>
                                        {selectedOrder.razorpay_payment_id && (
                                            <div>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>Transaction ID</p>
                                                <p style={{ fontFamily: 'monospace', fontWeight: '500' }}>{selectedOrder.razorpay_payment_id}</p>
                                            </div>
                                        )}
                                        {selectedOrder.failureReason && (
                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>Failure Reason</p>
                                                <p style={{ color: '#DC2626', fontWeight: '500' }}>{selectedOrder.failureReason}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                                {/* Customer Info */}
                                <div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Clock size={18} /> Customer Details
                                    </h3>
                                    <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                                        <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{selectedOrder.customerName || 'Guest User'}</p>
                                        <p style={{ color: 'var(--color-text-light)', marginBottom: '0.25rem' }}>{selectedOrder.email}</p>
                                        <p style={{ color: 'var(--color-text-light)' }}>{selectedOrder.phone || 'No phone provided'}</p>
                                    </div>
                                </div>

                                {/* Shipping Info */}
                                <div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Truck size={18} /> Shipping Address
                                    </h3>
                                    <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1rem', backgroundColor: '#F9FAFB' }}>
                                        {(selectedOrder.shippingAddress || selectedOrder.address) ? (
                                            (() => {
                                                const addr = selectedOrder.shippingAddress || selectedOrder.address;
                                                return (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                        <p style={{ fontWeight: '600', color: 'var(--color-text-main)' }}>{addr.street || addr.address}</p>
                                                        {addr.locality && <p style={{ color: 'var(--color-text-main)' }}>{addr.locality}</p>}
                                                        <p style={{ color: 'var(--color-text-main)' }}>{addr.city}, {addr.state || ''}</p>
                                                        <p style={{ color: 'var(--color-text-main)' }}>{addr.zipCode || addr.pincode || addr.zip}, {addr.country || 'India'}</p>
                                                        {addr.landmark && <p style={{ color: 'var(--color-text-light)', fontSize: '0.85rem' }}>Landmark: {addr.landmark}</p>}
                                                        {addr.alternatePhone && <p style={{ color: 'var(--color-text-light)', fontSize: '0.85rem' }}>Alt Phone: {addr.alternatePhone}</p>}
                                                    </div>
                                                );
                                            })()
                                        ) : (
                                            <p style={{ color: 'var(--color-text-light)' }}>No shipping address provided</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Package size={18} /> Order Items
                            </h3>
                            <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '2rem' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid var(--color-border)' }}>
                                        <tr>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Product</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Quantity</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Price</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                <td style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                                                        <img src={item.image || 'https://via.placeholder.com/40'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{item.name}</span>
                                                </td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center' }}>{item.quantity}</td>
                                                <td style={{ padding: '0.75rem', textAlign: 'right' }}>₹{item.price}</td>
                                                <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600' }}>₹{(item.price * item.quantity).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot style={{ backgroundColor: '#F9FAFB' }}>
                                        <tr>
                                            <td colSpan="3" style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>Total Amount:</td>
                                            <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '700', fontSize: '1.1rem', color: 'var(--color-primary)' }}>₹{selectedOrder.totalAmount || selectedOrder.total}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            {/* Payment Actions */}
                            {(selectedOrder.paymentStatus === 'AWAITING_PAYMENT' || selectedOrder.paymentStatus === 'FAILED') && (
                                <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#991B1B' }}>
                                        <AlertCircle size={20} />
                                        <span><strong>Payment Pending:</strong> This order has not been paid for yet.</span>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm('Are you sure you want to mark this order as PAID? Only do this if you have verified the payment in Razorpay dashboard.')) {
                                                const adminAction = {
                                                    action: 'MARK_AS_PAID',
                                                    timestamp: new Date().toISOString(),
                                                    adminId: 'current-admin', // Ideally fetch from auth context
                                                    reason: 'Manual verification via Razorpay Dashboard'
                                                };

                                                // Update order with new status and log action
                                                const updates = {
                                                    paymentStatus: 'PAID',
                                                    status: 'PROCESSING',
                                                    adminActions: selectedOrder.adminActions ? [...selectedOrder.adminActions, adminAction] : [adminAction]
                                                };

                                                await FirebaseService.updateOrder(selectedOrder.id, updates);
                                                setSelectedOrder({ ...selectedOrder, ...updates });
                                                fetchOrders();
                                            }
                                        }}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            backgroundColor: '#10B981',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: 'var(--radius-md)',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <CheckCircle size={16} /> Mark as Paid
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManager;
