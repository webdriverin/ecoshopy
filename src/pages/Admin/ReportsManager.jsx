import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DataGrid from './DataGrid';

const ReportsManager = () => {
    return (
        <Routes>
            <Route path="customers" element={<CustomerReports />} />
            <Route path="stock" element={<StockReports />} />
            <Route path="requests" element={<GenericReport title="Product Requests" />} />
            <Route path="newsletter" element={<GenericReport title="Newsletter Subscribers" />} />
            <Route path="seo" element={<GenericReport title="SEO Reports" />} />
            <Route path="auditor" element={<GenericReport title="Auditor Logs" />} />
            <Route path="*" element={<Navigate to="customers" replace />} />
        </Routes>
    );
};

const CustomerReports = () => {
    const [data] = useState([
        { id: '1', name: 'John Doe', email: 'john@example.com', orders: 5, totalSpent: '$450.00' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', orders: 12, totalSpent: '$1200.50' },
    ]);

    const columns = [
        { key: 'name', label: 'Customer Name' },
        { key: 'email', label: 'Email' },
        { key: 'orders', label: 'Total Orders' },
        { key: 'totalSpent', label: 'Total Spent' }
    ];

    return <DataGrid title="Customer Reports" columns={columns} data={data} onAdd={() => { }} onEdit={() => { }} onDelete={() => { }} />;
};

const StockReports = () => {
    const [data] = useState([
        { id: '1', name: 'Bamboo Toothbrush', sku: 'BT-001', stock: 150, value: '$1948.50' },
        { id: '2', name: 'Cotton Pads', sku: 'CP-002', stock: 45, value: '$832.50' },
    ]);

    const columns = [
        { key: 'name', label: 'Product Name' },
        { key: 'sku', label: 'SKU' },
        { key: 'stock', label: 'Stock Level' },
        { key: 'value', label: 'Stock Value' }
    ];

    return <DataGrid title="Stock Inventory Reports" columns={columns} data={data} onAdd={() => { }} onEdit={() => { }} onDelete={() => { }} />;
};

const GenericReport = ({ title }) => {
    const [data] = useState([]);
    const columns = [{ key: 'date', label: 'Date' }, { key: 'details', label: 'Details' }];

    return <DataGrid title={title} columns={columns} data={data} onAdd={() => { }} onEdit={() => { }} onDelete={() => { }} />;
};

export default ReportsManager;
