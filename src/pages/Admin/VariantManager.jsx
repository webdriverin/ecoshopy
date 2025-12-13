import React, { useState } from 'react';
import Button from '../../components/UI/Button';
import { Plus, Trash2, Edit2, Check, X, AlertCircle } from 'lucide-react';

const VariantManager = ({ variants, onChange }) => {
    const [editingIndex, setEditingIndex] = useState(-1);
    const [tempVariant, setTempVariant] = useState(null);
    const [error, setError] = useState('');

    const emptyVariant = {
        name: '',
        sku: '',
        mrp: '',
        price: '',
        stock: ''
    };

    const handleAdd = () => {
        setEditingIndex(variants.length);
        setTempVariant({ ...emptyVariant });
        setError('');
    };

    const handleEdit = (index) => {
        setEditingIndex(index);
        setTempVariant({ ...variants[index] });
        setError('');
    };

    const handleDelete = (index) => {
        if (window.confirm('Are you sure you want to remove this variant?')) {
            const newVariants = variants.filter((_, i) => i !== index);
            onChange(newVariants);
        }
    };

    const handleCancel = () => {
        setEditingIndex(-1);
        setTempVariant(null);
        setError('');
    };

    const handleSave = () => {
        // Validation
        if (!tempVariant.name.trim()) {
            setError('Variant Name is required');
            return;
        }
        if (!tempVariant.price || parseFloat(tempVariant.price) < 0) {
            setError('Valid Selling Price is required');
            return;
        }
        if (tempVariant.mrp && parseFloat(tempVariant.mrp) < parseFloat(tempVariant.price)) {
            setError('MRP cannot be less than Selling Price');
            return;
        }
        if (!tempVariant.stock || parseInt(tempVariant.stock) < 0) {
            setError('Valid Stock is required');
            return;
        }

        const newVariants = [...variants];
        if (editingIndex === variants.length) {
            newVariants.push(tempVariant);
        } else {
            newVariants[editingIndex] = tempVariant;
        }

        onChange(newVariants);
        setEditingIndex(-1);
        setTempVariant(null);
        setError('');
    };

    const handleChange = (field, value) => {
        setTempVariant({ ...tempVariant, [field]: value });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-text-main)' }}>Product Variants</h3>
                <Button type="button" variant="secondary" size="sm" onClick={handleAdd} disabled={editingIndex !== -1}>
                    <Plus size={16} style={{ marginRight: '0.25rem' }} /> Add Variant
                </Button>
            </div>

            {error && (
                <div style={{
                    padding: '0.75rem',
                    backgroundColor: '#FEE2E2',
                    color: '#DC2626',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            <div style={{
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: 'white'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid var(--color-border)' }}>
                        <tr>
                            <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: 'var(--color-text-light)' }}>Variant Name</th>
                            <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: 'var(--color-text-light)' }}>SKU</th>
                            <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: '600', color: 'var(--color-text-light)' }}>MRP</th>
                            <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: '600', color: 'var(--color-text-light)' }}>Price</th>
                            <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: '600', color: 'var(--color-text-light)' }}>Stock</th>
                            <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: '600', color: 'var(--color-text-light)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {variants.length === 0 && editingIndex === -1 && (
                            <tr>
                                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
                                    No variants added yet. Click "Add Variant" to start.
                                </td>
                            </tr>
                        )}

                        {variants.map((variant, index) => (
                            editingIndex === index ? (
                                <tr key={index} style={{ backgroundColor: '#F0FDF4' }}>
                                    {/* Editing Row */}
                                    <td style={{ padding: '0.5rem' }}>
                                        <input
                                            type="text"
                                            value={tempVariant.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            placeholder="e.g. Pack of 2"
                                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                                            autoFocus
                                        />
                                    </td>
                                    <td style={{ padding: '0.5rem' }}>
                                        <input
                                            type="text"
                                            value={tempVariant.sku}
                                            onChange={(e) => handleChange('sku', e.target.value)}
                                            placeholder="SKU-123"
                                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                                        />
                                    </td>
                                    <td style={{ padding: '0.5rem' }}>
                                        <input
                                            type="number"
                                            value={tempVariant.mrp}
                                            onChange={(e) => handleChange('mrp', e.target.value)}
                                            placeholder="0.00"
                                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', textAlign: 'right' }}
                                        />
                                    </td>
                                    <td style={{ padding: '0.5rem' }}>
                                        <input
                                            type="number"
                                            value={tempVariant.price}
                                            onChange={(e) => handleChange('price', e.target.value)}
                                            placeholder="0.00"
                                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', textAlign: 'right' }}
                                        />
                                    </td>
                                    <td style={{ padding: '0.5rem' }}>
                                        <input
                                            type="number"
                                            value={tempVariant.stock}
                                            onChange={(e) => handleChange('stock', e.target.value)}
                                            placeholder="0"
                                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', textAlign: 'right' }}
                                        />
                                    </td>
                                    <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                            <button type="button" onClick={handleSave} style={{ color: 'var(--color-success)', cursor: 'pointer', background: 'none', border: 'none' }} title="Save">
                                                <Check size={18} />
                                            </button>
                                            <button type="button" onClick={handleCancel} style={{ color: 'var(--color-error)', cursor: 'pointer', background: 'none', border: 'none' }} title="Cancel">
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                <tr key={index} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    {/* Display Row */}
                                    <td style={{ padding: '1rem' }}>{variant.name}</td>
                                    <td style={{ padding: '1rem', color: 'var(--color-text-light)' }}>{variant.sku || '-'}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right', color: 'var(--color-text-light)', textDecoration: 'line-through' }}>
                                        {variant.mrp ? `₹${variant.mrp}` : '-'}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>₹{variant.price}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '10px',
                                            backgroundColor: parseInt(variant.stock) > 0 ? '#ECFDF5' : '#FEF2F2',
                                            color: parseInt(variant.stock) > 0 ? '#059669' : '#DC2626',
                                            fontSize: '0.75rem',
                                            fontWeight: '500'
                                        }}>
                                            {variant.stock}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                            <button type="button" onClick={() => handleEdit(index)} style={{ color: 'var(--color-primary)', cursor: 'pointer', background: 'none', border: 'none' }} title="Edit">
                                                <Edit2 size={16} />
                                            </button>
                                            <button type="button" onClick={() => handleDelete(index)} style={{ color: 'var(--color-error)', cursor: 'pointer', background: 'none', border: 'none' }} title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        ))}

                        {/* New Variant Row */}
                        {editingIndex === variants.length && (
                            <tr style={{ backgroundColor: '#F0FDF4' }}>
                                <td style={{ padding: '0.5rem' }}>
                                    <input
                                        type="text"
                                        value={tempVariant.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        placeholder="e.g. Pack of 2"
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                                        autoFocus
                                    />
                                </td>
                                <td style={{ padding: '0.5rem' }}>
                                    <input
                                        type="text"
                                        value={tempVariant.sku}
                                        onChange={(e) => handleChange('sku', e.target.value)}
                                        placeholder="SKU-123"
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                                    />
                                </td>
                                <td style={{ padding: '0.5rem' }}>
                                    <input
                                        type="number"
                                        value={tempVariant.mrp}
                                        onChange={(e) => handleChange('mrp', e.target.value)}
                                        placeholder="0.00"
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', textAlign: 'right' }}
                                    />
                                </td>
                                <td style={{ padding: '0.5rem' }}>
                                    <input
                                        type="number"
                                        value={tempVariant.price}
                                        onChange={(e) => handleChange('price', e.target.value)}
                                        placeholder="0.00"
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', textAlign: 'right' }}
                                    />
                                </td>
                                <td style={{ padding: '0.5rem' }}>
                                    <input
                                        type="number"
                                        value={tempVariant.stock}
                                        onChange={(e) => handleChange('stock', e.target.value)}
                                        placeholder="0"
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', textAlign: 'right' }}
                                    />
                                </td>
                                <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                        <button type="button" onClick={handleSave} style={{ color: 'var(--color-success)', cursor: 'pointer', background: 'none', border: 'none' }} title="Save">
                                            <Check size={18} />
                                        </button>
                                        <button type="button" onClick={handleCancel} style={{ color: 'var(--color-error)', cursor: 'pointer', background: 'none', border: 'none' }} title="Cancel">
                                            <X size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VariantManager;
