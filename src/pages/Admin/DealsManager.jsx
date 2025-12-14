import React, { useState, useEffect } from 'react';
import FirebaseService from '../../services/FirebaseService';
import { Search, Tag, Check, X, Save } from 'lucide-react';
import Button from '../../components/UI/Button';

const DealsManager = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [savingId, setSavingId] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await FirebaseService.getProducts();
            // Sort: Active deals first, then by name
            const sortedData = data.sort((a, b) => {
                if (a.isDealOfTheDay === b.isDealOfTheDay) {
                    return a.name.localeCompare(b.name);
                }
                return a.isDealOfTheDay ? -1 : 1;
            });
            setProducts(sortedData);
        } catch (error) {
            console.error("Error fetching products", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleDeal = async (product) => {
        setSavingId(product.id);
        try {
            const isTurningOn = !product.isDealOfTheDay;
            let updates = {
                isDealOfTheDay: isTurningOn
            };

            if (isTurningOn) {
                // Turning Deal ON
                // 1. Set default discount label
                const discountLabel = product.dealDiscount || '10% OFF';
                updates.dealDiscount = discountLabel;

                // 2. Calculate new price
                // Base calculation on current price if originalPrice is not already set
                // If originalPrice exists, it means item might already be discounted or have an MSRP
                // For simplicity in this "Flash Deal" logic:
                // We assume current 'price' is the starting point.
                // We snapshot current 'price' as 'originalPrice' (if null).

                const basePrice = product.originalPrice || product.price;
                const match = discountLabel.match(/(\d+)%/);
                const percentage = match ? parseInt(match[1]) : 10;

                updates.originalPrice = basePrice;
                updates.price = Math.round(basePrice * (1 - percentage / 100));

            } else {
                // Turning Deal OFF
                updates.dealDiscount = null;

                // Restore price if we have an originalPrice
                if (product.originalPrice) {
                    updates.price = product.originalPrice;
                    updates.originalPrice = null; // Clear it, or keep it? Usually clear for flash deals.
                }
            }

            await FirebaseService.updateProduct(product.id, updates);

            // Update local state
            setProducts(products.map(p =>
                p.id === product.id ? { ...p, ...updates } : p
            ));
        } catch (error) {
            console.error("Error updating deal status", error);
            alert("Failed to update deal status");
        } finally {
            setSavingId(null);
        }
    };

    const handleDiscountChange = (id, value) => {
        setProducts(products.map(p =>
            p.id === id ? { ...p, dealDiscount: value } : p
        ));
    };

    const handleSaveDiscount = async (product) => {
        if (!product.isDealOfTheDay) return;

        setSavingId(product.id);
        try {
            // Recalculate price based on new discount label
            const match = product.dealDiscount?.match(/(\d+)%/);
            let updates = { dealDiscount: product.dealDiscount };

            if (match) {
                const percentage = parseInt(match[1]);
                const basePrice = product.originalPrice || product.price; // Always base off original if available

                updates.originalPrice = basePrice;
                updates.price = Math.round(basePrice * (1 - percentage / 100));
            }

            await FirebaseService.updateProduct(product.id, updates);

            // Update local state
            setProducts(products.map(p =>
                p.id === product.id ? { ...p, ...updates } : p
            ));

            // Optional: Show success toast
            // alert(`Price updated to ₹${updates.price}`);
        } catch (error) {
            console.error("Error updating discount", error);
            alert("Failed to update discount");
        } finally {
            setSavingId(null);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeDealsCount = products.filter(p => p.isDealOfTheDay).length;

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading products...</div>;

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            padding: '1.5rem'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
            }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text-main)' }}>Deals of the Day Manager</h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginTop: '0.25rem' }}>
                        Select products to feature in the "Deals of the Day" section on the home page.
                        <br />
                        <span style={{ fontWeight: '500', color: 'var(--color-success)' }}>{activeDealsCount} active deals</span>
                    </p>
                </div>
                <div style={{ position: 'relative' }}>
                    <Search style={{
                        position: 'absolute',
                        left: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--color-text-light)'
                    }} size={20} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        style={{
                            padding: '0.5rem 1rem 0.5rem 2.5rem',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            outline: 'none',
                            width: '250px'
                        }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>
                            <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--color-text-light)' }}>Product</th>
                            <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--color-text-light)' }}>Category</th>
                            <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--color-text-light)' }}>Price</th>
                            <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--color-text-light)', textAlign: 'center' }}>Is Deal?</th>
                            <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--color-text-light)' }}>Discount Label</th>
                            <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--color-text-light)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.id} style={{
                                borderBottom: '1px solid var(--color-border)',
                                backgroundColor: product.isDealOfTheDay ? 'rgba(16, 185, 129, 0.05)' : 'transparent'
                            }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '4px',
                                            backgroundColor: '#f0f0f0',
                                            overflow: 'hidden',
                                            flexShrink: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {product.image ? (
                                                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <span style={{ fontSize: '0.6rem', color: '#999' }}>No Img</span>
                                            )}
                                        </div>
                                        <span style={{ fontWeight: '500', color: 'var(--color-text-main)' }}>{product.name}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', color: 'var(--color-text-light)' }}>{product.category}</td>
                                <td style={{ padding: '1rem', color: 'var(--color-text-light)' }}>₹{product.price}</td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <button
                                        onClick={() => handleToggleDeal(product)}
                                        disabled={savingId === product.id}
                                        style={{
                                            padding: '0.5rem',
                                            borderRadius: '50%',
                                            border: 'none',
                                            cursor: 'pointer',
                                            backgroundColor: product.isDealOfTheDay ? '#d1fae5' : '#f3f4f6',
                                            color: product.isDealOfTheDay ? '#059669' : '#9ca3af',
                                            transition: 'all 0.2s'
                                        }}
                                        title={product.isDealOfTheDay ? "Remove from Deals" : "Add to Deals"}
                                    >
                                        {product.isDealOfTheDay ? <Check size={20} /> : <X size={20} />}
                                    </button>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {product.isDealOfTheDay && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Tag size={16} style={{ color: 'var(--color-text-light)' }} />
                                            <input
                                                type="text"
                                                value={product.dealDiscount || ''}
                                                onChange={(e) => handleDiscountChange(product.id, e.target.value)}
                                                placeholder="e.g. 50% OFF"
                                                style={{
                                                    border: '1px solid var(--color-border)',
                                                    borderRadius: '4px',
                                                    padding: '0.25rem 0.5rem',
                                                    fontSize: '0.875rem',
                                                    width: '120px',
                                                    outline: 'none'
                                                }}
                                            />
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {product.isDealOfTheDay && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleSaveDiscount(product)}
                                            disabled={savingId === product.id}
                                            icon={Save}
                                        >
                                            Save
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
                                    No products found matching "{searchTerm}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DealsManager;
