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
                    <Route path="orders" element={<OrderManager />} />
                    <Route path="orders/failed" element={<ModulePlaceholder />} />
                    <Route path="pos" element={<POSSystem />} />

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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [orders, products, customers] = await Promise.all([
                    FirebaseService.getOrders(),
                    FirebaseService.getProducts(),
                    FirebaseService.getCustomers()
                ]);

                const totalSales = orders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);

                setStats([
                    { label: 'Total Sales', value: `₹${totalSales.toFixed(2)}`, change: '+0%' }, // Change logic needs historical data
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', height: '300px' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Recent Orders</h3>
                    <div style={{ color: 'var(--color-text-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                        Chart Placeholder
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', height: '300px' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Top Products</h3>
                    <div style={{ color: 'var(--color-text-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                        Chart Placeholder
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
