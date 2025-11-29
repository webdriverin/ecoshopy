import React, { useState } from 'react';
import Button from '../../components/UI/Button';
import { Plus, Edit, Trash2, Search, Save, X } from 'lucide-react';

const DataGrid = ({ title, columns, data, onAdd, onEdit, onDelete }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    const handleAddClick = () => {
        setIsAdding(true);
        setNewItem({});
    };

    const handleCancelAdd = () => {
        setIsAdding(false);
        setNewItem({});
    };

    const handleSaveNew = () => {
        onAdd({ ...newItem, id: Date.now().toString() }); // Dummy ID generation
        setIsAdding(false);
        setNewItem({});
    };

    const filteredData = data.filter(item =>
        Object.values(item).some(val =>
            String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>{title}</h1>
                <Button variant="primary" onClick={handleAddClick}>
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
                                        <input
                                            type="text"
                                            placeholder={col.label}
                                            value={newItem[col.key] || ''}
                                            onChange={(e) => setNewItem({ ...newItem, [col.key]: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '0.5rem',
                                                borderRadius: 'var(--radius-sm)',
                                                border: '1px solid var(--color-border)'
                                            }}
                                        />
                                    </td>
                                ))}
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button onClick={handleSaveNew} style={{ marginRight: '0.5rem', color: 'var(--color-success)' }}><Save size={18} /></button>
                                    <button onClick={handleCancelAdd} style={{ color: 'var(--color-error)' }}><X size={18} /></button>
                                </td>
                            </tr>
                        )}

                        {filteredData.map(item => (
                            <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                {columns.map(col => (
                                    <td key={col.key} style={{ padding: '1rem' }}>{item[col.key]}</td>
                                ))}
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button onClick={() => onEdit(item)} style={{ marginRight: '0.5rem', color: 'var(--color-text-light)' }}><Edit size={18} /></button>
                                    <button onClick={() => onDelete(item.id)} style={{ color: 'var(--color-error)' }}><Trash2 size={18} /></button>
                                </td>
                            </tr>
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
