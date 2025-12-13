import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import ProductManager from './ProductManager';
import OrderManager from './OrderManager';
import MasterDataManager from './MasterDataManager';
import ProductAddForm from './ProductAddForm';
import ProductOffersManager from './ProductOffersManager';
import InventoryManager from './InventoryManager';
import POSSystem from './POSSystem';
import ReportsManager from './ReportsManager';
import CMSManager from './CMSManager';
import UsersManager from './UsersManager';
import ModulePlaceholder from './ModulePlaceholder';

import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import FirebaseService from '../../services/FirebaseService';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [isAuthChecking, setIsAuthChecking] = React.useState(true);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/admin/login');
            }
            setIsAuthChecking(false);
        });
        return () => unsubscribe();
    }, [navigate]);

    if (isAuthChecking) return <div style={{ padding: '2rem' }}>Checking authentication...</div>;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-body)' }}>
            <AdminSidebar />

            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', height: '100vh' }}>
                <Routes>
                    <Route path="dashboard" element={<DashboardOverview />} />

                    {/* Orders */}
                    {/* Orders */}
                    <Route path="orders" element={<OrderManager />} />

                    {/* Products */}
                    <Route path="products" element={<ProductManager />} />
                    <Route path="products/add" element={<ProductAddForm type="Standard" />} />
                    <Route path="products/add-multiple" element={<ProductAddForm type="Multiple Count" />} />
                    <Route path="products/edit/:id" element={<ProductAddForm />} />
                    <Route path="products/*" element={<ProductOffersManager />} />

                    {/* Inventory */}
                    <Route path="inventory/*" element={<InventoryManager />} />

                    {/* Reports */}
                    <Route path="reports/*" element={<ReportsManager />} />

                    {/* Master Data */}
                    <Route path="master/*" element={<MasterDataManager />} />

                    {/* CMS */}
                    <Route path="cms/*" element={<CMSManager />} />

                    {/* Users */}
                    <Route path="users" element={<UsersManager />} />

                    <Route path="*" element={<DashboardOverview />} />
                </Routes>
            </main>
        </div>
    );
};


const DashboardOverview = () => {
    const [stats, setStats] = useState([
        { label: 'Total Sales', value: '₹0', change: '0%' },
        { label: 'Total Orders', value: '0', change: '0%' },
        { label: 'Products', value: '0', change: '0' },
        { label: 'Customers', value: '0', change: '0%' }
    ]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [orders, products, customers] = await Promise.all([
                    FirebaseService.getOrders(),
                    FirebaseService.getProducts(),
                    FirebaseService.getCustomers()
                ]);

                // Sort orders by date desc
                const sortedOrders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setRecentOrders(sortedOrders.slice(0, 5));

                // Calculate Top Products (Mock logic: just take first 5 for now, real logic needs order items aggregation)
                // In a real app, you'd aggregate order items to find best sellers.
                setTopProducts(products.slice(0, 5));

                const paidOrders = orders.filter(order => order.paymentStatus === 'PAID' || order.status === 'DELIVERED');
                const totalSales = paidOrders.reduce((sum, order) => sum + (parseFloat(order.totalAmount) || 0), 0);

                setStats([
                    { label: 'Total Sales', value: `₹${totalSales.toFixed(2)}`, change: '+0%' },
                    { label: 'Total Orders', value: orders.length.toString(), change: '+0%' },
                    { label: 'Products', value: products.length.toString(), change: '+0' },
                    { label: 'Customers', value: customers.length.toString(), change: '+0%' }
                ]);
            } catch (error) {
                console.error("Error fetching dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div style={{ padding: '2rem' }}>Loading dashboard stats...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Dashboard Overview</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {stats.map((stat, index) => (
                    <div key={index} style={{
                        backgroundColor: 'white',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <div style={{ color: 'var(--color-text-light)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{stat.label}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>{stat.value}</div>
                        <div style={{ color: 'var(--color-success)', fontSize: '0.875rem', fontWeight: '500' }}>{stat.change} from last month</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', height: '400px', overflowY: 'auto' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '700' }}>Recent Orders</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {recentOrders.length > 0 ? (
                            recentOrders.map(order => (
                                <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                                    <div>
                                        <div style={{ fontWeight: '600', color: 'var(--color-text-main)' }}>#{order.id.substring(0, 8)}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: '600' }}>₹{order.totalAmount}</div>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '999px',
                                            backgroundColor: order.status === 'DELIVERED' ? '#D1FAE5' : '#FEF3C7',
                                            color: order.status === 'DELIVERED' ? '#065F46' : '#92400E',
                                            fontWeight: '600'
                                        }}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'var(--color-text-light)', textAlign: 'center' }}>No recent orders</p>
                        )}
                    </div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', height: '400px', overflowY: 'auto' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '700' }}>Top Products</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {topProducts.length > 0 ? (
                            topProducts.map(product => (
                                <div key={product.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: '#F3F4F6', flexShrink: 0 }}>
                                        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600', color: 'var(--color-text-main)', fontSize: '0.95rem' }}>{product.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>{product.category}</div>
                                    </div>
                                    <div style={{ fontWeight: '600', color: 'var(--color-primary)' }}>₹{product.price}</div>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'var(--color-text-light)', textAlign: 'center' }}>No products found</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
