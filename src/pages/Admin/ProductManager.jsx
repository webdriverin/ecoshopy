import React, { useState, useEffect } from 'react';
import Button from '../../components/UI/Button';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import FirebaseService from '../../services/FirebaseService';

const ProductManager = () => {
    // Dummy data
    const [products] = useState([
        { id: '1', name: 'Bamboo Toothbrush Set', price: 12.99, category: 'Personal Care', stock: 50, status: 'Active' },
        { id: '2', name: 'Reusable Cotton Pads', price: 18.50, category: 'Beauty', stock: 30, status: 'Active' },
        { id: '3', name: 'Glass Water Bottle', price: 24.00, category: 'Accessories', stock: 0, status: 'Out of Stock' },
        { id: '4', name: 'Eco-Friendly Tote Bag', price: 15.00, category: 'Fashion', stock: 100, status: 'Draft' },
    ]);

    useEffect(() => {
        // Uncomment when Firebase config is real
        // const fetchProducts = async () => {
        //   const data = await FirebaseService.getProducts();
        //   setProducts(data);
        // };
        // fetchProducts();
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Products</h1>
                <Button variant="primary">
                    <Plus size={20} style={{ marginRight: '0.5rem' }} /> Add Product
                </Button>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Search size={20} color="var(--color-text-light)" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem' }}
                    />
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: 'var(--color-bg-body)' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--color-text-light)' }}>Product Name</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--color-text-light)' }}>Category</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--color-text-light)' }}>Price</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--color-text-light)' }}>Stock</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--color-text-light)' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: 'var(--color-text-light)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '1rem' }}>{product.name}</td>
                                <td style={{ padding: '1rem' }}>{product.category}</td>
                                <td style={{ padding: '1rem' }}>${product.price.toFixed(2)}</td>
                                <td style={{ padding: '1rem' }}>{product.stock}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '0.75rem',
                                        backgroundColor: product.status === 'Active' ? '#D1FAE5' : product.status === 'Out of Stock' ? '#FEE2E2' : '#F3F4F6',
                                        color: product.status === 'Active' ? 'var(--color-success)' : product.status === 'Out of Stock' ? 'var(--color-error)' : 'var(--color-text-light)'
                                    }}>
                                        {product.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button style={{ marginRight: '0.5rem', color: 'var(--color-text-light)' }}><Edit size={18} /></button>
                                    <button style={{ color: 'var(--color-error)' }}><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductManager;
