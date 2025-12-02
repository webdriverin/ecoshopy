import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/UI/Button';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import FirebaseService from '../../services/FirebaseService';

const ProductManager = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await FirebaseService.getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await FirebaseService.deleteProduct(id);
                setProducts(products.filter(p => p.id !== id));
            } catch (error) {
                console.error("Error deleting product", error);
                alert("Failed to delete product");
            }
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Products</h1>
                <Button variant="primary" onClick={() => navigate('/admin/products/add')}>
                    <Plus size={20} style={{ marginRight: '0.5rem' }} /> Add Product
                </Button>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Search size={20} color="var(--color-text-light)" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem' }}
                    />
                </div>

                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading products...</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: 'var(--color-bg-body)' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--color-text-light)' }}>Product Name</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--color-text-light)' }}>Category</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--color-text-light)' }}>Type</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--color-text-light)' }}>Price</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--color-text-light)' }}>Stock</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--color-text-light)' }}>Status</th>
                                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: 'var(--color-text-light)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-light)' }}>No products found.</td>
                                </tr>
                            ) : (
                                filteredProducts.map(product => (
                                    <tr key={product.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '1rem' }}>{product.name}</td>
                                        <td style={{ padding: '1rem' }}>{product.category}</td>
                                        <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{product.type || 'Standard'}</td>
                                        <td style={{ padding: '1rem' }}>₹{product.price}</td>
                                        <td style={{ padding: '1rem' }}>{product.stock}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: 'var(--radius-full)',
                                                fontSize: '0.75rem',
                                                backgroundColor: product.stock > 0 ? '#D1FAE5' : '#FEE2E2',
                                                color: product.stock > 0 ? 'var(--color-success)' : 'var(--color-error)'
                                            }}>
                                                {product.stock > 0 ? 'Active' : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button onClick={() => navigate(`/admin/products/edit/${product.id}`)} style={{ marginRight: '0.5rem', color: 'var(--color-text-light)', cursor: 'pointer' }}><Edit size={18} /></button>
                                            <button onClick={() => handleDelete(product.id)} style={{ color: 'var(--color-error)', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ProductManager;
