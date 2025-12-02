import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DataGrid from './DataGrid';
import FirebaseService from '../../services/FirebaseService';
import Button from '../../components/UI/Button';
import { Tag, X, Save, Percent, Calendar, Plus, Edit, Trash2, Search } from 'lucide-react';

const ProductOffersManager = () => {
    return (
        <Routes>
            <Route path="offers" element={<ProductOfferGrid title="Product Offers" />} />
            {/* Keep other routes as Generic for now, or update if requested */}
            <Route path="deals" element={<GenericOfferManager title="Deals" type="deal" />} />
            <Route path="collections" element={<CollectionManager />} />
            <Route path="coupons" element={<GenericOfferManager title="Coupons" type="coupon" />} />
            <Route path="freebies" element={<GenericOfferManager title="Freebies" type="freebie" />} />
            <Route path="*" element={<Navigate to="offers" replace />} />
        </Routes>
    );
};

const CollectionManager = () => {
    const [collections, setCollections] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCollection, setCurrentCollection] = useState(null); // null for new, object for edit
    const [searchQuery, setSearchQuery] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        products: [], // Array of product names
        status: 'Active'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [offersData, productsData] = await Promise.all([
                FirebaseService.getOffers(),
                FirebaseService.getProducts()
            ]);
            setCollections(offersData.filter(o => o.type === 'collection'));
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setCurrentCollection(null);
        setFormData({
            name: '',
            description: '',
            image: '',
            products: [],
            status: 'Active'
        });
        setIsModalOpen(true);
    };

    const handleEditClick = (collection) => {
        setCurrentCollection(collection);
        setFormData({
            name: collection.name,
            description: collection.description || '',
            image: collection.image || '',
            products: collection.products || [],
            status: collection.status || 'Active'
        });
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm("Are you sure you want to delete this collection?")) {
            try {
                await FirebaseService.deleteOffer(id);
                fetchData();
            } catch (error) {
                console.error("Error deleting collection", error);
                alert("Failed to delete collection");
            }
        }
    };

    const handleProductToggle = (productName) => {
        setFormData(prev => {
            const newProducts = prev.products.includes(productName)
                ? prev.products.filter(p => p !== productName)
                : [...prev.products, productName];
            return { ...prev, products: newProducts };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const collectionData = {
                ...formData,
                type: 'collection'
            };

            if (currentCollection) {
                await FirebaseService.updateOffer(currentCollection.id, collectionData);
            } else {
                await FirebaseService.addOffer(collectionData);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            console.error("Error saving collection", error);
            alert("Failed to save collection");
        }
    };

    // Image Upload Handler
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const url = await FirebaseService.uploadImage(file, 'collections');
                setFormData({ ...formData, image: url });
            } catch (error) {
                console.error("Error uploading image", error);
                alert("Image upload failed");
            }
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Collections</h2>
                <Button variant="primary" onClick={handleAddClick}>
                    <Plus size={20} style={{ marginRight: '0.5rem' }} /> Add Collection
                </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {collections.map(collection => (
                    <div key={collection.id} style={{
                        backgroundColor: 'white',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-sm)',
                        overflow: 'hidden',
                        border: '1px solid var(--color-border)'
                    }}>
                        <div style={{ height: '150px', backgroundColor: '#f3f4f6', position: 'relative' }}>
                            {collection.image ? (
                                <img src={collection.image} alt={collection.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-light)' }}>
                                    No Image
                                </div>
                            )}
                            <div style={{
                                position: 'absolute', top: '10px', right: '10px',
                                backgroundColor: collection.status === 'Active' ? 'var(--color-success)' : 'var(--color-text-light)',
                                color: 'white', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 'bold'
                            }}>
                                {collection.status}
                            </div>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{collection.name}</h3>
                            <p style={{ color: 'var(--color-text-light)', fontSize: '0.875rem', marginBottom: '1rem', height: '40px', overflow: 'hidden' }}>
                                {collection.description}
                            </p>
                            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
                                {collection.products ? collection.products.length : 0} Products Linked
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Button variant="secondary" onClick={() => handleEditClick(collection)} style={{ flex: 1 }}>
                                    <Edit size={16} style={{ marginRight: '0.25rem' }} /> Edit
                                </Button>
                                <Button variant="secondary" onClick={() => handleDeleteClick(collection.id)} style={{ flex: 1, color: 'var(--color-error)', borderColor: 'var(--color-error)' }}>
                                    <Trash2 size={16} style={{ marginRight: '0.25rem' }} /> Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)',
                        width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', position: 'relative'
                    }}>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <X size={24} />
                        </button>

                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                            {currentCollection ? 'Edit Collection' : 'Add Collection'}
                        </h3>

                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            {/* Left Column: Details */}
                            <div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Collection Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows="3"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Cover Image</label>
                                    {formData.image && (
                                        <img src={formData.image} alt="Preview" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem' }} />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ width: '100%', marginBottom: '0.5rem' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Or enter Image URL"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            {/* Right Column: Product Selection */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Select Products ({formData.products.length} selected)</label>

                                <div style={{ marginBottom: '1rem', position: 'relative' }}>
                                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                    />
                                </div>

                                <div style={{
                                    height: '400px',
                                    overflowY: 'auto',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: '0.5rem'
                                }}>
                                    {filteredProducts.map(product => (
                                        <div
                                            key={product.id}
                                            onClick={() => handleProductToggle(product.name)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                padding: '0.5rem',
                                                borderBottom: '1px solid #f3f4f6',
                                                cursor: 'pointer',
                                                backgroundColor: formData.products.includes(product.name) ? '#F0FDF4' : 'transparent'
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.products.includes(product.name)}
                                                readOnly
                                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                            />
                                            <img
                                                src={(product.images && product.images.length > 0) ? product.images[0] : (product.image || 'https://placehold.co/50')}
                                                alt={product.name}
                                                style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>{product.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>₹{product.price}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button type="submit" variant="primary">
                                    <Save size={18} style={{ marginRight: '0.5rem' }} /> Save Collection
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const ProductOfferGrid = ({ title }) => {
    const [products, setProducts] = useState([]);
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Modal Form State
    const [offerForm, setOfferForm] = useState({
        discount: '',
        code: '',
        validUntil: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [productsData, offersData] = await Promise.all([
                FirebaseService.getProducts(),
                FirebaseService.getOffers()
            ]);
            setProducts(productsData);
            // Filter offers that are of type 'offer' (or whatever type we decide for product offers)
            setOffers(offersData.filter(o => o.type === 'offer'));
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const getOfferForProduct = (productId) => {
        return offers.find(o => o.productId === productId);
    };

    const handleProductClick = (product) => {
        const existingOffer = getOfferForProduct(product.id);
        setSelectedProduct(product);
        if (existingOffer) {
            setOfferForm({
                discount: existingOffer.discount,
                code: existingOffer.code || '',
                validUntil: existingOffer.validUntil || ''
            });
        } else {
            setOfferForm({
                discount: '',
                code: '',
                validUntil: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSaveOffer = async (e) => {
        e.preventDefault();
        if (!selectedProduct) return;

        try {
            const existingOffer = getOfferForProduct(selectedProduct.id);
            const offerData = {
                type: 'offer',
                productId: selectedProduct.id,
                productName: selectedProduct.name, // Fallback
                discount: parseFloat(offerForm.discount),
                code: offerForm.code,
                validUntil: offerForm.validUntil,
                status: 'Active'
            };

            if (existingOffer) {
                await FirebaseService.updateOffer(existingOffer.id, offerData);
            } else {
                await FirebaseService.addOffer(offerData);
            }

            await fetchData(); // Refresh
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving offer", error);
            alert("Failed to save offer");
        }
    };

    const handleRemoveOffer = async () => {
        if (!selectedProduct) return;
        const existingOffer = getOfferForProduct(selectedProduct.id);
        if (!existingOffer) return;

        if (window.confirm("Are you sure you want to remove this offer?")) {
            try {
                await FirebaseService.deleteOffer(existingOffer.id);
                await fetchData();
                setIsModalOpen(false);
            } catch (error) {
                console.error("Error removing offer", error);
                alert("Failed to remove offer");
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>{title}</h2>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1.5rem'
            }}>
                {products.map(product => {
                    const offer = getOfferForProduct(product.id);
                    const image = (product.images && product.images.length > 0) ? product.images[0] : (product.image || 'https://placehold.co/200');

                    return (
                        <div
                            key={product.id}
                            onClick={() => handleProductClick(product)}
                            style={{
                                border: offer ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                backgroundColor: 'white'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {offer && (
                                <div style={{
                                    position: 'absolute', top: '10px', right: '10px',
                                    backgroundColor: 'var(--color-error)', color: 'white',
                                    padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.75rem', fontWeight: 'bold', zIndex: 1
                                }}>
                                    {offer.discount}% OFF
                                </div>
                            )}

                            <div style={{ height: '150px', overflow: 'hidden' }}>
                                <img src={image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>

                            <div style={{ padding: '1rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h3>
                                <p style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>₹{product.price}</p>
                                {offer && (
                                    <p style={{ color: 'var(--color-primary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                        Offer Active
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)',
                        width: '90%', maxWidth: '500px', position: 'relative'
                    }}>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <X size={24} />
                        </button>

                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                            {getOfferForProduct(selectedProduct?.id) ? 'Edit Offer' : 'Add Offer'}
                        </h3>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <img
                                src={(selectedProduct?.images && selectedProduct.images.length > 0) ? selectedProduct.images[0] : (selectedProduct?.image || '')}
                                alt={selectedProduct?.name}
                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                            />
                            <div>
                                <div style={{ fontWeight: '600' }}>{selectedProduct?.name}</div>
                                <div style={{ color: 'var(--color-text-light)' }}>₹{selectedProduct?.price}</div>
                            </div>
                        </div>

                        <form onSubmit={handleSaveOffer}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Discount Percentage (%)</label>
                                <div style={{ position: 'relative' }}>
                                    <Percent size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                                    <input
                                        type="number"
                                        value={offerForm.discount}
                                        onChange={(e) => setOfferForm({ ...offerForm, discount: e.target.value })}
                                        required
                                        min="1" max="100"
                                        placeholder="e.g. 10"
                                        style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Offer Code (Optional)</label>
                                <div style={{ position: 'relative' }}>
                                    <Tag size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                                    <input
                                        type="text"
                                        value={offerForm.code}
                                        onChange={(e) => setOfferForm({ ...offerForm, code: e.target.value })}
                                        placeholder="e.g. SUMMER10"
                                        style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Valid Until (Optional)</label>
                                <div style={{ position: 'relative' }}>
                                    <Calendar size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                                    <input
                                        type="date"
                                        value={offerForm.validUntil}
                                        onChange={(e) => setOfferForm({ ...offerForm, validUntil: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Button type="submit" variant="primary" style={{ flex: 1 }}>
                                    <Save size={18} style={{ marginRight: '0.5rem' }} /> Save Offer
                                </Button>
                                {getOfferForProduct(selectedProduct?.id) && (
                                    <Button type="button" variant="secondary" onClick={handleRemoveOffer} style={{ flex: 1, backgroundColor: '#FEE2E2', color: '#DC2626', borderColor: '#FECACA' }}>
                                        <X size={18} style={{ marginRight: '0.5rem' }} /> Remove Offer
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Kept for other routes
const GenericOfferManager = ({ title, type }) => {
    const [data, setData] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [offersData, productsData] = await Promise.all([
                    FirebaseService.getOffers(),
                    FirebaseService.getProducts()
                ]);
                setData(offersData.filter(item => item.type === type));
                setProducts(productsData.map(p => ({ label: p.name, value: p.name })));
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [type]);

    const getColumns = () => {
        const commonStatus = { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] };

        switch (type) {
            case 'deal':
                return [
                    { key: 'name', label: 'Deal Name' },
                    { key: 'product', label: 'Product', type: 'select', options: products },
                    { key: 'dealPrice', label: 'Deal Price', type: 'number' },
                    { key: 'endsAt', label: 'Ends At', type: 'date' },
                    commonStatus
                ];
            case 'collection':
                return [
                    { key: 'name', label: 'Collection Name' },
                    { key: 'image', label: 'Cover Image', type: 'image' },
                    { key: 'description', label: 'Description' },
                    commonStatus
                ];
            case 'coupon':
                return [
                    { key: 'code', label: 'Coupon Code' },
                    { key: 'discountType', label: 'Type', type: 'select', options: ['Percentage', 'Fixed Amount'] },
                    { key: 'value', label: 'Value', type: 'number' },
                    { key: 'minPurchase', label: 'Min Purchase', type: 'number' },
                    { key: 'expiry', label: 'Expiry Date', type: 'date' },
                    commonStatus
                ];
            case 'freebie':
                return [
                    { key: 'name', label: 'Campaign Name' },
                    { key: 'minOrderValue', label: 'Min Order Value', type: 'number' },
                    { key: 'freeProduct', label: 'Free Product', type: 'select', options: products },
                    commonStatus
                ];
            default:
                return [{ key: 'name', label: 'Name' }];
        }
    };

    const handleAdd = async (item) => {
        try {
            await FirebaseService.addOffer({ ...item, type, status: item.status || 'Active' });
            // Refresh data
            const result = await FirebaseService.getOffers();
            setData(result.filter(i => i.type === type));
        } catch (error) {
            console.error("Error adding offer", error);
            alert("Failed to add offer");
        }
    };

    const handleEdit = async (item) => {
        try {
            const { id, ...updates } = item;
            await FirebaseService.updateOffer(id, updates);
            // Refresh data
            const result = await FirebaseService.getOffers();
            setData(result.filter(i => i.type === type));
        } catch (error) {
            console.error("Error updating", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await FirebaseService.deleteOffer(id);
                setData(data.filter(i => i.id !== id));
            } catch (error) {
                console.error("Error deleting offer", error);
            }
        }
    };

    return <DataGrid title={title} columns={getColumns()} data={data} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />;
};

export default ProductOffersManager;
