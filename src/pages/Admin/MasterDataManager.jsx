import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DataGrid from './DataGrid';

const MasterDataManager = () => {
    return (
        <Routes>
            <Route path="category" element={<CategoryManager />} />
            <Route path="brands" element={<BrandManager />} />
            <Route path="highlights" element={<GenericManager title="Highlights" />} />
            <Route path="features" element={<GenericManager title="Features" />} />
            <Route path="size-charts" element={<GenericManager title="Size Charts" />} />
            <Route path="badges" element={<GenericManager title="Badges" />} />
            <Route path="hsn" element={<GenericManager title="HSN Codes" />} />
            <Route path="tax" element={<GenericManager title="Tax Groups" />} />
            <Route path="courier" element={<GenericManager title="Courier Partners" />} />
            <Route path="*" element={<Navigate to="category" replace />} />
        </Routes>
    );
};

const CategoryManager = () => {
    const [data, setData] = useState([
        { id: '1', name: 'Personal Care', slug: 'personal-care', status: 'Active' },
        { id: '2', name: 'Home Products', slug: 'home-products', status: 'Active' },
        { id: '3', name: 'Fashion', slug: 'fashion', status: 'Active' }
    ]);

    const columns = [
        { key: 'name', label: 'Category Name' },
        { key: 'slug', label: 'Slug' },
        { key: 'status', label: 'Status' }
    ];

    const handleAdd = (item) => setData([...data, item]);
    const handleEdit = (item) => console.log('Edit', item);
    const handleDelete = (id) => setData(data.filter(i => i.id !== id));

    return <DataGrid title="Categories" columns={columns} data={data} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />;
};

const BrandManager = () => {
    const [data, setData] = useState([
        { id: '1', name: 'EcoLife', website: 'ecolife.com' },
        { id: '2', name: 'GreenEarth', website: 'greenearth.org' }
    ]);

    const columns = [
        { key: 'name', label: 'Brand Name' },
        { key: 'website', label: 'Website' }
    ];

    const handleAdd = (item) => setData([...data, item]);
    const handleEdit = (item) => console.log('Edit', item);
    const handleDelete = (id) => setData(data.filter(i => i.id !== id));

    return <DataGrid title="Brands" columns={columns} data={data} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />;
};

const GenericManager = ({ title }) => {
    const [data, setData] = useState([]);
    const columns = [{ key: 'name', label: 'Name' }, { key: 'description', label: 'Description' }];

    const handleAdd = (item) => setData([...data, item]);
    const handleEdit = (item) => console.log('Edit', item);
    const handleDelete = (id) => setData(data.filter(i => i.id !== id));

    return <DataGrid title={title} columns={columns} data={data} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />;
};

export default MasterDataManager;
