import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DataGrid from './DataGrid';
import FirebaseService from '../../services/FirebaseService';

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

const getStatus = (stock) => {
    if (stock === 0) return 'Out of Stock';
    if (stock < 10) return 'Low Stock';
    return 'In Stock';
};

const StockAvailability = () => {
    const [data, setData] = useState([]);

    const fetchData = React.useCallback(async () => {
        try {
            const result = await FirebaseService.getProducts();
            const flattenedData = [];

            result.forEach(p => {
                if (p.type === 'multiple count' && p.variants && p.variants.length > 0) {
                    p.variants.forEach((v, index) => {
                        flattenedData.push({
                            id: `${p.id}_${index}`, // Composite ID
                            productId: p.id,
                            name: `${p.name} - ${v.name}`,
                            category: p.category,
                            stock: parseInt(v.stock || 0),
                            variantIndex: index,
                            isVariant: true,
                            status: getStatus(parseInt(v.stock || 0))
                        });
                    });
                } else {
                    flattenedData.push({
                        id: p.id,
                        productId: p.id,
                        name: p.name,
                        category: p.category,
                        stock: parseInt(p.stock || 0),
                        isVariant: false,
                        status: getStatus(parseInt(p.stock || 0))
                    });
                }
            });

            setData(flattenedData);
        } catch (error) {
            console.error("Error fetching inventory", error);
        }
    }, []);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const columns = [
        { key: 'name', label: 'Product / Variant' },
        { key: 'category', label: 'Category' },
        { key: 'stock', label: 'Current Stock' },
        { key: 'status', label: 'Status' }
    ];

    const handleEdit = async (item) => {
        const newStock = prompt(`Enter new stock for ${item.name}:`, item.stock);
        if (newStock !== null && !isNaN(newStock)) {
            const stockValue = parseInt(newStock);
            try {
                if (item.isVariant) {
                    // Fetch fresh product data to ensure we don't overwrite other changes
                    const product = await FirebaseService.getProductById(item.productId);
                    const newVariants = [...product.variants];
                    newVariants[item.variantIndex].stock = stockValue;

                    await FirebaseService.updateProduct(item.productId, { variants: newVariants });
                } else {
                    await FirebaseService.updateProduct(item.productId, { stock: stockValue });
                }
                fetchData();
            } catch (error) {
                console.error("Error updating stock", error);
                alert("Failed to update stock");
            }
        }
    };

    return (
        <div>
            <DataGrid
                title="Stock Availability"
                columns={columns}
                data={data}
                onAdd={() => alert("Please use 'Add Product' to add new items.")}
                onEdit={handleEdit}
                onDelete={() => { }}
            />
        </div>
    );
};

const AddInventory = () => {
    return <StockAvailability />;
};

const LowStock = () => {
    const [data, setData] = useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            const result = await FirebaseService.getProducts();
            const flattenedData = [];

            result.forEach(p => {
                if (p.type === 'multiple count' && p.variants && p.variants.length > 0) {
                    p.variants.forEach((v, index) => {
                        const stock = parseInt(v.stock || 0);
                        if (stock < 10 && stock > 0) {
                            flattenedData.push({
                                id: `${p.id}_${index}`,
                                name: `${p.name} - ${v.name}`,
                                stock: stock,
                                status: 'Low Stock'
                            });
                        }
                    });
                } else {
                    const stock = parseInt(p.stock || 0);
                    if (stock < 10 && stock > 0) {
                        flattenedData.push({
                            id: p.id,
                            name: p.name,
                            stock: stock,
                            status: 'Low Stock'
                        });
                    }
                }
            });
            setData(flattenedData);
        };
        fetchData();
    }, []);

    const columns = [
        { key: 'name', label: 'Product Name' },
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
    const [data, setData] = useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            const result = await FirebaseService.getProducts();
            const flattenedData = [];

            result.forEach(p => {
                if (p.type === 'multiple count' && p.variants && p.variants.length > 0) {
                    p.variants.forEach((v, index) => {
                        const stock = parseInt(v.stock || 0);
                        if (stock === 0) {
                            flattenedData.push({
                                id: `${p.id}_${index}`,
                                name: `${p.name} - ${v.name}`,
                                stock: stock,
                                status: 'Out of Stock'
                            });
                        }
                    });
                } else {
                    const stock = parseInt(p.stock || 0);
                    if (stock === 0) {
                        flattenedData.push({
                            id: p.id,
                            name: p.name,
                            stock: stock,
                            status: 'Out of Stock'
                        });
                    }
                }
            });
            setData(flattenedData);
        };
        fetchData();
    }, []);

    const columns = [
        { key: 'name', label: 'Product Name' },
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
