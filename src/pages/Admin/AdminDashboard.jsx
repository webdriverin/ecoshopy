import React from 'react';
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
import ModulePlaceholder from './ModulePlaceholder';

const AdminDashboard = () => {
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
                    <Route path="products/add-combo" element={<ProductAddForm type="Combo" />} />
                    <Route path="products/add-multiple" element={<ProductAddForm type="Multiple Count" />} />
                    <Route path="products/add-digital" element={<ProductAddForm type="Digital" />} />
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
                    <Route path="users" element={<ModulePlaceholder />} />

                    <Route path="*" element={<DashboardOverview />} />
                </Routes>
            </main>
        </div>
    );
};

const DashboardOverview = () => {
    const stats = [
        { label: 'Total Sales', value: '$12,450', change: '+15%' },
        { label: 'Total Orders', value: '156', change: '+8%' },
        { label: 'Products', value: '45', change: '+2' },
        { label: 'Customers', value: '1,203', change: '+12%' }
    ];

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
