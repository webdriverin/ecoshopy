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
            <Route path="*" element={<Navigate to="category" replace />} />
        </Routes>
    );
};

const CategoryManager = () => {
    const [data, setData] = useState([]);

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
            // loading removed
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

    const handleMoveUp = async (item) => {
        const index = data.findIndex(i => i.id === item.id);
        if (index > 0) {
            const prevItem = data[index - 1];

            // Swap orders
            const itemOrder = item.order || index;
            const prevItemOrder = prevItem.order || (index - 1);

            // Using a simple swap strategy or index based strategy
            // If orders are missing, we should probably initialize all of them, but specific swap is faster
            // Let's swap the order values. 
            // If they are equal or missing, unique values needed.
            // Better strategy: Use array index as source of truth for order if field missing

            const newOrderForItem = prevItemOrder;
            const newOrderForPrev = itemOrder;

            // If orders were same or confusing, just swap based on current positions
            // Simplified: Swap in DB

            // Note: Firebase updates
            try {
                // Optimistic UI update
                const newData = [...data];
                newData[index] = { ...prevItem, order: itemOrder }; // prev moves down (gets higher index/order?) - Wait, order asc. 
                // index 0: order 0. index 1: order 1.
                // Move Up (index 1 -> 0): takes order 0.

                // Let's just swap the 'order' field values. If undefined, assume index.
                const order1 = typeof item.order === 'number' ? item.order : index;
                const order2 = typeof prevItem.order === 'number' ? prevItem.order : index - 1;

                // If they happen to be same due to missing data, force a difference
                let newOrder1 = order2;
                let newOrder2 = order1;

                if (newOrder1 === newOrder2) {
                    newOrder1 = index - 1;
                    newOrder2 = index;
                }

                await FirebaseService.updateCategory(item.id, { order: newOrder1 });
                await FirebaseService.updateCategory(prevItem.id, { order: newOrder2 });
                fetchData();
            } catch (error) {
                console.error("Error moving category", error);
            }
        }
    };

    const handleMoveDown = async (item) => {
        const index = data.findIndex(i => i.id === item.id);
        if (index < data.length - 1) {
            const nextItem = data[index + 1];

            const order1 = typeof item.order === 'number' ? item.order : index;
            const order2 = typeof nextItem.order === 'number' ? nextItem.order : index + 1;

            // If we swap item (idx) with next (idx+1), item gets order2, next gets order1
            let newOrder1 = order2;
            let newOrder2 = order1;

            if (newOrder1 === newOrder2) {
                newOrder1 = index + 1;
                newOrder2 = index;
            }

            try {
                await FirebaseService.updateCategory(item.id, { order: newOrder1 });
                await FirebaseService.updateCategory(nextItem.id, { order: newOrder2 });
                fetchData();
            } catch (error) {
                console.error("Error moving category", error);
            }
        }
    };

    return <DataGrid title="Categories" columns={columns} data={data} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} onMoveUp={handleMoveUp} onMoveDown={handleMoveDown} />;
};

const BrandManager = () => {
    const [data, setData] = useState([]);

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
            // loading removed
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
