import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DataGrid from './DataGrid';

import FirebaseService from '../../services/FirebaseService';
import DealsManager from './DealsManager';

const MasterDataManager = () => {
    return (
        <Routes>
            <Route path="category" element={<CategoryManager />} />
            <Route path="brands" element={<BrandManager />} />
            <Route path="deals" element={<DealsManager />} />
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
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const result = await FirebaseService.getCategories();
            setData(result);
        } catch (error) {
            console.error("Error fetching categories", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { key: 'name', label: 'Category Name' },
        { key: 'slug', label: 'Slug' },
        { key: 'status', label: 'Status' }
    ];

    const handleAdd = async (item) => {
        try {
            await FirebaseService.addCategory(item);
            fetchData();
        } catch (error) {
            console.error("Error adding category", error);
            alert("Failed to add category");
        }
    };

    const handleEdit = (item) => console.log('Edit', item);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await FirebaseService.deleteCategory(id);
                setData(data.filter(i => i.id !== id));
            } catch (error) {
                console.error("Error deleting category", error);
            }
        }
    };

    return <DataGrid title="Categories" columns={columns} data={data} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />;
};

const BrandManager = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const result = await FirebaseService.getBrands();
            setData(result);
        } catch (error) {
            console.error("Error fetching brands", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { key: 'name', label: 'Brand Name' },
        { key: 'website', label: 'Website' }
    ];

    const handleAdd = async (item) => {
        try {
            await FirebaseService.addBrand(item);
            fetchData();
        } catch (error) {
            console.error("Error adding brand", error);
            alert("Failed to add brand");
        }
    };

    const handleEdit = (item) => console.log('Edit', item);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await FirebaseService.deleteBrand(id);
                setData(data.filter(i => i.id !== id));
            } catch (error) {
                console.error("Error deleting brand", error);
            }
        }
    };

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
