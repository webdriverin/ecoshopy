import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DataGrid from './DataGrid';

const InventoryManager = () => {
    return (
        <Routes>
            <Route path="availability" element={<StockAvailability />} />
            <Route path="add" element={<AddInventory />} />
            <Route path="low-stock" element={<LowStock />} />
            <Route path="out-of-stock" element={<OutOfStock />} />
            <Route path="*" element={<Navigate to="availability" replace />} />
        </Routes>
    );
};

const StockAvailability = () => {
    const [data] = useState([
        { id: '1', name: 'Bamboo Toothbrush', sku: 'BT-001', stock: 150, status: 'In Stock' },
        { id: '2', name: 'Cotton Pads', sku: 'CP-002', stock: 45, status: 'In Stock' },
        { id: '3', name: 'Glass Bottle', sku: 'GB-003', stock: 0, status: 'Out of Stock' }
    ]);

    const columns = [
        { key: 'name', label: 'Product Name' },
        { key: 'sku', label: 'SKU' },
        { key: 'stock', label: 'Current Stock' },
        { key: 'status', label: 'Status' }
    ];

    return (
        <div>
            <DataGrid
                title="Stock Availability"
                columns={columns}
                data={data}
                onAdd={() => { }}
                onEdit={() => { }}
                onDelete={() => { }}
            />
        </div>
    );
};

const AddInventory = () => {
    return (
        <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Add Inventory</h2>
            <p style={{ color: 'var(--color-text-light)' }}>Select a product to add stock...</p>
            {/* Add Inventory Form would go here */}
        </div>
    );
};

const LowStock = () => {
    const [data] = useState([
        { id: '4', name: 'Eco Tote Bag', sku: 'TB-004', stock: 5, status: 'Low Stock' }
    ]);

    const columns = [
        { key: 'name', label: 'Product Name' },
        { key: 'sku', label: 'SKU' },
        { key: 'stock', label: 'Current Stock' },
        { key: 'status', label: 'Status' }
    ];

    return (
        <DataGrid
            title="Low Stock Alerts"
            columns={columns}
            data={data}
            onAdd={() => { }}
            onEdit={() => { }}
            onDelete={() => { }}
        />
    );
};

const OutOfStock = () => {
    const [data] = useState([
        { id: '3', name: 'Glass Bottle', sku: 'GB-003', stock: 0, status: 'Out of Stock' }
    ]);

    const columns = [
        { key: 'name', label: 'Product Name' },
        { key: 'sku', label: 'SKU' },
        { key: 'stock', label: 'Current Stock' },
        { key: 'status', label: 'Status' }
    ];

    return (
        <DataGrid
            title="Out of Stock"
            columns={columns}
            data={data}
            onAdd={() => { }}
            onEdit={() => { }}
            onDelete={() => { }}
        />
    );
};

export default InventoryManager;
