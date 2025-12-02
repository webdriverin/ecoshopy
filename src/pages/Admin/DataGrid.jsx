import React, { useState } from 'react';
import Button from '../../components/UI/Button';
import { Plus, Edit, Trash2, Search, Save, X } from 'lucide-react';
import FirebaseService from '../../services/FirebaseService';

const DataGrid = ({ title, columns, data, onAdd, onEdit, onDelete }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Editing State
    const [editingId, setEditingId] = useState(null);
    const [editItem, setEditItem] = useState({});

    const handleAddClick = () => {
        setIsAdding(true);
        setNewItem({});
        setEditingId(null); // Cancel any active edit
    };

    const handleCancelAdd = () => {
        setIsAdding(false);
        setNewItem({});
    };

    const handleSaveNew = async () => {
        setIsSaving(true);
        try {
            await onAdd({ ...newItem, id: Date.now().toString() });
            setIsAdding(false);
            setNewItem({});
        } catch (error) {
            console.error("Error saving item", error);
            alert("Failed to save item. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditClick = (item) => {
        setEditingId(item.id);
        setEditItem({ ...item });
        setIsAdding(false); // Cancel any active add
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditItem({});
    };

    const handleSaveEdit = async () => {
        setIsSaving(true);
        try {
            await onEdit(editItem);
            setEditingId(null);
            setEditItem({});
        } catch (error) {
            console.error("Error updating item", error);
            alert("Failed to update item. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const filteredData = data.filter(item =>
        Object.values(item).some(val =>
            String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const renderInput = (col, value, onChange) => {
        if (col.type === 'select') {
            return (
                <select
                    value={value || ''}
                    onChange={onChange}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)'
                    }}
                >
                    <option value="">Select {col.label}</option>
                    {col.options.map(opt => {
                        const optValue = typeof opt === 'object' ? opt.value : opt;
                        const optLabel = typeof opt === 'object' ? opt.label : opt;
                        return <option key={optValue} value={optValue}>{optLabel}</option>;
                    })}
                </select>
            );
        }
        if (col.type === 'color') {
            return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                        type="color"
                        value={value || '#000000'}
                        onChange={onChange}
                        style={{
                            width: '40px',
                            height: '40px',
                            padding: '0',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    />
                    <input
                        type="text"
                        value={value || ''}
                        onChange={onChange}
                        placeholder="#000000"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-border)'
                        }}
                    />
                </div>
            );
        }
        if (col.type === 'image') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {value && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <img
                                src={value}
                                alt="Preview"
                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                                try {
                                    console.log("Uploading file directly:", file.name);
                                    const url = await FirebaseService.uploadImage(file, 'banners');
                                    console.log("Upload success:", url);
                                    onChange({ target: { value: url } });
                                } catch (error) {
                                    console.error("Upload failed", error);
                                    alert("Image upload failed");
                                }
                            }
                        }}
                        style={{ fontSize: '0.875rem' }}
                    />
                    <input
                        type="text"
                        value={value || ''}
                        onChange={onChange}
                        placeholder="Or enter URL"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-border)',
                            fontSize: '0.875rem'
                        }}
                    />
                </div>
            );
        }
        if (col.type === 'date') {
            return (
                <input
                    type="date"
                    value={value || ''}
                    onChange={onChange}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)'
                    }}
                />
            );
        }
        if (col.type === 'number') {
            return (
                <input
                    type="number"
                    placeholder={col.label}
                    value={value || ''}
                    onChange={onChange}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)'
                    }}
                />
            );
        }
        return (
            <input
                type="text"
                placeholder={col.label}
                value={value || ''}
                onChange={onChange}
                style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)'
                }}
            />
        );
    };

    const renderCell = (col, item) => {
        const value = item[col.key];
        if (col.type === 'image') {
            return value ? (
                <img
                    src={value}
                    alt="Thumbnail"
                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                />
            ) : <span style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>No Image</span>;
        }
        if (col.type === 'color') {
            return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        backgroundColor: value || 'transparent',
                        border: '1px solid var(--color-border)'
                    }} />
                    <span>{value}</span>
                </div>
            );
        }
        return (
            <div style={{
                maxWidth: '200px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                title: value // Show full text on hover
            }}>
                {value}
            </div>
        );
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>{title}</h1>
                <Button variant="primary" onClick={handleAddClick} disabled={isAdding || editingId}>
                    <Plus size={20} style={{ marginRight: '0.5rem' }} /> Add {title.slice(0, -1)}
                </Button>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Search size={20} color="var(--color-text-light)" />
                    <input
                        type="text"
                        placeholder={`Search ${title.toLowerCase()}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem' }}
                    />
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: 'var(--color-bg-body)' }}>
                        <tr>
                            {columns.map(col => (
                                <th key={col.key} style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--color-text-light)' }}>
                                    {col.label}
                                </th>
                            ))}
                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: 'var(--color-text-light)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isAdding && (
                            <tr style={{ backgroundColor: '#F0FDF4' }}>
                                {columns.map(col => (
                                    <td key={col.key} style={{ padding: '1rem' }}>
                                        {renderInput(col, newItem[col.key], (e) => setNewItem({ ...newItem, [col.key]: e.target.value }))}
                                    </td>
                                ))}
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button onClick={handleSaveNew} disabled={isSaving} style={{ marginRight: '0.5rem', color: 'var(--color-success)', opacity: isSaving ? 0.5 : 1 }}>
                                        {isSaving ? '...' : <Save size={18} />}
                                    </button>
                                    <button onClick={handleCancelAdd} style={{ color: 'var(--color-error)' }}><X size={18} /></button>
                                </td>
                            </tr>
                        )}

                        {filteredData.map(item => (
                            <React.Fragment key={item.id}>
                                {editingId === item.id ? (
                                    <tr style={{ backgroundColor: '#EFF6FF' }}>
                                        {columns.map(col => (
                                            <td key={col.key} style={{ padding: '1rem' }}>
                                                {renderInput(col, editItem[col.key], (e) => setEditItem({ ...editItem, [col.key]: e.target.value }))}
                                            </td>
                                        ))}
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button onClick={handleSaveEdit} disabled={isSaving} style={{ marginRight: '0.5rem', color: 'var(--color-success)', opacity: isSaving ? 0.5 : 1 }}>
                                                {isSaving ? '...' : <Save size={18} />}
                                            </button>
                                            <button onClick={handleCancelEdit} style={{ color: 'var(--color-error)' }}><X size={18} /></button>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        {columns.map(col => (
                                            <td key={col.key} style={{ padding: '1rem' }}>
                                                {renderCell(col, item)}
                                            </td>
                                        ))}
                                        <td style={{ padding: '1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                            <button onClick={() => handleEditClick(item)} style={{ marginRight: '0.5rem', color: 'var(--color-text-light)' }}><Edit size={18} /></button>
                                            <button onClick={() => onDelete(item.id)} style={{ color: 'var(--color-error)' }}><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}

                        {filteredData.length === 0 && !isAdding && (
                            <tr>
                                <td colSpan={columns.length + 1} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
                                    No records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataGrid;
