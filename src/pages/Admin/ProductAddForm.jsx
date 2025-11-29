import React, { useState } from 'react';
import Button from '../../components/UI/Button';
import { Save } from 'lucide-react';

const ProductAddForm = ({ type }) => {
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        price: '',
        stock: '',
        category: '',
        description: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`Adding ${type} product:`, formData);
        alert(`${type} Product Added!`);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>Add {type} Product</h1>

            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>SKU</label>
                        <input
                            type="text"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Price</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                        >
                            <option value="">Select Category</option>
                            <option value="personal-care">Personal Care</option>
                            <option value="home-products">Home Products</option>
                            <option value="fashion">Fashion</option>
                        </select>
                    </div>

                    {type === 'Combo' && (
                        <div style={{ gridColumn: '1 / -1', padding: '1rem', backgroundColor: '#F9FAFB', borderRadius: 'var(--radius-md)' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Combo Details</h3>
                            <p style={{ color: 'var(--color-text-light)' }}>Select products to include in this combo...</p>
                            {/* Combo selection logic would go here */}
                        </div>
                    )}

                    {type === 'Digital' && (
                        <div style={{ gridColumn: '1 / -1', padding: '1rem', backgroundColor: '#F9FAFB', borderRadius: 'var(--radius-md)' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Digital File</h3>
                            <input type="file" />
                        </div>
                    )}

                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                        ></textarea>
                    </div>

                    <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="primary" type="submit">
                            <Save size={20} style={{ marginRight: '0.5rem' }} /> Save Product
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductAddForm;
