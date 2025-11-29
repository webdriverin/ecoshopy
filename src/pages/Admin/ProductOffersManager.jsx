import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DataGrid from './DataGrid';

const ProductOffersManager = () => {
    return (
        <Routes>
            <Route path="offers" element={<GenericOfferManager title="Offers" />} />
            <Route path="deals" element={<GenericOfferManager title="Deals" />} />
            <Route path="collections" element={<GenericOfferManager title="Collections" />} />
            <Route path="coupons" element={<GenericOfferManager title="Coupons" />} />
            <Route path="freebies" element={<GenericOfferManager title="Freebies" />} />
            <Route path="*" element={<Navigate to="offers" replace />} />
        </Routes>
    );
};

const GenericOfferManager = ({ title }) => {
    const [data, setData] = useState([]);
    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code' },
        { key: 'discount', label: 'Discount' },
        { key: 'status', label: 'Status' }
    ];

    const handleAdd = (item) => setData([...data, item]);
    const handleEdit = (item) => console.log('Edit', item);
    const handleDelete = (id) => setData(data.filter(i => i.id !== id));

    return <DataGrid title={title} columns={columns} data={data} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />;
};

export default ProductOffersManager;
