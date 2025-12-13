import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DataGrid from './DataGrid';

import FirebaseService from '../../services/FirebaseService';

const CMSManager = () => {
    return (
        <Routes>
            <Route path="home" element={<HomePageBuilder />} />
            <Route path="categories" element={<CategoriesManager />} />
            <Route path="branding" element={<BrandingManager />} />
            <Route path="*" element={<Navigate to="home" replace />} />
        </Routes>
    );
};

const BrandingManager = () => {
    const [settings, setSettings] = useState({
        storeName: '',
        logo: '',
        favicon: '',
        contactEmail: '',
        phoneNumber: '',
        address: '',
        maintenanceMode: false
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await FirebaseService.getStoreSettings();
                if (data) setSettings(data);
            } catch (error) {
                console.error("Error fetching settings", error);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            // For logos, we usually WANT transparency, so we use standard uploadImage
            // which preserves PNG alpha channel.
            const url = await FirebaseService.uploadImage(file, 'branding');
            setSettings(prev => ({ ...prev, [field]: url }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await FirebaseService.updateStoreSettings(settings);
            alert("Settings saved successfully!");
        } catch (error) {
            console.error("Save failed", error);
            alert("Failed to save settings: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 'bold' }}>Store Branding & Settings</h1>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {/* Logo Section */}
                <div style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Logo & Favicon</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Store Logo</label>
                            <div style={{ marginBottom: '1rem', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #e5e7eb', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#f9fafb' }}>
                                {settings.logo ? (
                                    <img src={settings.logo} alt="Store Logo" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                                ) : (
                                    <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>No Logo</span>
                                )}
                            </div>
                            <input type="file" onChange={(e) => handleUpload(e, 'logo')} accept="image/*" style={{ fontSize: '0.875rem' }} disabled={uploading} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Favicon</label>
                            <div style={{ marginBottom: '1rem', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #e5e7eb', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#f9fafb' }}>
                                {settings.favicon ? (
                                    <img src={settings.favicon} alt="Favicon" style={{ width: '32px', height: '32px' }} />
                                ) : (
                                    <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>No Favicon</span>
                                )}
                            </div>
                            <input type="file" onChange={(e) => handleUpload(e, 'favicon')} accept="image/*" style={{ fontSize: '0.875rem' }} disabled={uploading} />
                        </div>
                    </div>
                </div>

                {/* Store Info Section */}
                <div style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>General Information</h2>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Store Name</label>
                            <input
                                type="text"
                                name="storeName"
                                value={settings.storeName || ''}
                                onChange={handleChange}
                                placeholder="Ecoshopy"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Contact Email</label>
                                <input
                                    type="email"
                                    name="contactEmail"
                                    value={settings.contactEmail || ''}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Phone Number</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={settings.phoneNumber || ''}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Maintenance Mode Section */}
                <div style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: settings.maintenanceMode ? '#FEF2F2' : 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem', color: settings.maintenanceMode ? '#DC2626' : 'inherit' }}>Maintenance Mode</h2>
                            <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                                When enabled, the public website will be hidden and show a "Under Maintenance" message. Admin panel remains accessible.
                            </p>
                        </div>
                        <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
                            <input
                                type="checkbox"
                                checked={settings.maintenanceMode || false}
                                onChange={(e) => setSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                                backgroundColor: settings.maintenanceMode ? '#DC2626' : '#ccc',
                                transition: '.4s', borderRadius: '34px'
                            }}></span>
                            <span style={{
                                position: 'absolute', content: '""', height: '26px', width: '26px', left: '4px', bottom: '4px',
                                backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                                transform: settings.maintenanceMode ? 'translateX(26px)' : 'translateX(0)'
                            }}></span>
                        </label>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem' }}>
                    <button
                        onClick={handleSave}
                        disabled={loading || uploading}
                        style={{
                            padding: '0.75rem 2rem',
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: '600',
                            cursor: (loading || uploading) ? 'not-allowed' : 'pointer',
                            opacity: (loading || uploading) ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
};


const HomePageBuilder = () => {
    const [tickers, setTickers] = useState([]);
    const [banners, setBanners] = useState([]);
    const [ads, setAds] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [collections, setCollections] = useState([]);

    const fetchTickers = async () => {
        const result = await FirebaseService.getTickers();
        setTickers(result);
    };

    const fetchBanners = async () => {
        const result = await FirebaseService.getBanners();
        setBanners(result);
    };

    const fetchAds = async () => {
        const result = await FirebaseService.getAds();
        setAds(result);
    };

    const fetchTestimonials = async () => {
        const result = await FirebaseService.getTestimonials();
        setTestimonials(result);
    };

    const fetchCollections = async () => {
        const result = await FirebaseService.getFeaturedCollections();
        setCollections(result);
    };

    React.useEffect(() => {
        fetchTickers();
        fetchBanners();
        fetchAds();
        fetchTestimonials();
        fetchCollections();
    }, []);

    // Add Handlers
    const handleAddTicker = async ({ ...item }) => {
        await FirebaseService.addTicker({ ...item, status: 'Active' });
        await fetchTickers();
    };

    const handleAddBanner = async ({ ...item }) => {
        await FirebaseService.addBanner({ ...item, status: 'Active' });
        await fetchBanners();
    };

    const handleAddAd = async ({ ...item }) => {
        await FirebaseService.addAd({ ...item, status: 'Active' });
        await fetchAds();
    };

    const handleAddTestimonial = async ({ ...item }) => {
        await FirebaseService.addTestimonial({ ...item, status: 'Active' });
        await fetchTestimonials();
    };

    const handleAddCollection = async ({ ...item }) => {
        await FirebaseService.addFeaturedCollection({ ...item, status: 'Active' });
        await fetchCollections();
    };

    // Edit Handlers
    const handleEditTicker = async (item) => {
        await FirebaseService.updateTicker(item.id, item);
        await fetchTickers();
    };

    const handleEditBanner = async (item) => {
        await FirebaseService.updateBanner(item.id, item);
        await fetchBanners();
    };

    const handleEditAd = async (item) => {
        await FirebaseService.updateAd(item.id, item);
        await fetchAds();
    };

    const handleEditTestimonial = async (item) => {
        await FirebaseService.updateTestimonial(item.id, item);
        await fetchTestimonials();
    };

    const handleEditCollection = async (item) => {
        await FirebaseService.updateFeaturedCollection(item.id, item);
        await fetchCollections();
    };

    // Delete Handlers
    const handleDeleteTicker = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                console.log("Deleting ticker with ID:", id);
                await FirebaseService.deleteTicker(id);
                setTickers(tickers.filter(i => i.id !== id));
                console.log("Ticker deleted successfully");
            } catch (error) {
                console.error("Error deleting ticker:", error);
                alert("Failed to delete ticker: " + error.message);
            }
        }
    };

    const handleDeleteBanner = async (id) => {
        console.log("Delete requested for ID:", id);
        if (window.confirm('Are you sure?')) {
            try {
                await FirebaseService.deleteBanner(id);
                console.log("Delete success");
                setBanners(banners.filter(i => i.id !== id));
            } catch (error) {
                console.error("Delete failed", error);
                alert("Delete failed: " + error.message);
            }
        }
    };

    const handleDeleteAd = async (id) => {
        if (window.confirm('Are you sure?')) {
            await FirebaseService.deleteAd(id);
            setAds(ads.filter(i => i.id !== id));
        }
    };

    const handleDeleteTestimonial = async (id) => {
        if (window.confirm('Are you sure?')) {
            await FirebaseService.deleteTestimonial(id);
            setTestimonials(testimonials.filter(i => i.id !== id));
        }
    };

    const handleDeleteCollection = async (id) => {
        if (window.confirm('Are you sure?')) {
            await FirebaseService.deleteFeaturedCollection(id);
            setCollections(collections.filter(i => i.id !== id));
        }
    };

    const statusColumn = { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] };

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Home Page Builder</h1>

            <div style={{ marginBottom: '3rem' }}>
                <DataGrid
                    title="Header Tickers"
                    columns={[
                        { key: 'content', label: 'Content' },
                        { key: 'backgroundColor', label: 'Bg Color', type: 'color' },
                        { key: 'textColor', label: 'Text Color', type: 'color' },
                        statusColumn
                    ]}
                    data={tickers}
                    onAdd={handleAddTicker}
                    onEdit={handleEditTicker}
                    onDelete={handleDeleteTicker}
                />
            </div>

            <div style={{ marginBottom: '3rem' }}>
                <DataGrid
                    title="Home Banners"
                    columns={[
                        { key: 'title', label: 'Title' },
                        { key: 'subtitle', label: 'Subtitle' },
                        { key: 'image', label: 'Image', type: 'image' },
                        { key: 'ctaPrimary', label: 'Primary Button' },
                        { key: 'ctaSecondary', label: 'Secondary Button' },
                        { key: 'buttonColor', label: 'Btn Color', type: 'color' },
                        { key: 'buttonTextColor', label: 'Btn Text Color', type: 'color' },
                        statusColumn
                    ]}
                    data={banners}
                    onAdd={handleAddBanner}
                    onEdit={handleEditBanner}
                    onDelete={handleDeleteBanner}
                />
            </div>

            <div style={{ marginBottom: '3rem' }}>
                <DataGrid
                    title="Promotional Ads"
                    columns={[
                        { key: 'title', label: 'Title' },
                        { key: 'subtitle', label: 'Subtitle' },
                        { key: 'image', label: 'Background Image', type: 'image' },
                        { key: 'content', label: 'Content' },
                        { key: 'ctaText', label: 'Button Text' },
                        { key: 'ctaLink', label: 'Button Link' },
                        { key: 'buttonColor', label: 'Btn Color', type: 'color' },
                        { key: 'buttonTextColor', label: 'Btn Text Color', type: 'color' },
                        { key: 'backgroundColor', label: 'Bg Color (Hex)' },
                        { key: 'layout', label: 'Layout', type: 'select', options: ['Left', 'Center', 'Right'] },
                        statusColumn
                    ]}
                    data={ads}
                    onAdd={handleAddAd}
                    onEdit={handleEditAd}
                    onDelete={handleDeleteAd}
                />
            </div>

            <div style={{ marginBottom: '3rem' }}>
                <DataGrid
                    title="Featured Collections"
                    columns={[
                        { key: 'title', label: 'Title' },
                        { key: 'subtitle', label: 'Subtitle' },
                        { key: 'image', label: 'Image', type: 'image' },
                        { key: 'link', label: 'Link' },
                        { key: 'size', label: 'Grid Size', type: 'select', options: ['small', 'medium', 'large', 'tall'] },
                        statusColumn
                    ]}
                    data={collections}
                    onAdd={handleAddCollection}
                    onEdit={handleEditCollection}
                    onDelete={handleDeleteCollection}
                />
            </div>

            <div style={{ marginBottom: '3rem' }}>
                <DataGrid
                    title="Testimonials"
                    columns={[{ key: 'name', label: 'Customer Name' }, { key: 'review', label: 'Review' }, statusColumn]}
                    data={testimonials}
                    onAdd={handleAddTestimonial}
                    onEdit={handleEditTestimonial}
                    onDelete={handleDeleteTestimonial}
                />
            </div>
        </div>
    );
};

const PagesManager = () => {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        const result = await FirebaseService.getPages();
        setData(result);
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = async ({ ...item }) => {
        await FirebaseService.addPage({ ...item, status: 'Draft' });
        await fetchData();
    };

    const handleEdit = async (item) => {
        await FirebaseService.updatePage(item.id, item);
        await fetchData();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            await FirebaseService.deletePage(id);
            setData(data.filter(i => i.id !== id));
        }
    };

    const columns = [
        { key: 'title', label: 'Page Title' },
        { key: 'slug', label: 'Slug' },
        { key: 'status', label: 'Status', type: 'select', options: ['Published', 'Draft'] }
    ];

    return <DataGrid title="Pages" columns={columns} data={data} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />;
};

const FAQManager = () => {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        const result = await FirebaseService.getFAQs();
        setData(result);
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = async ({ ...item }) => {
        await FirebaseService.addFAQ(item);
        await fetchData();
    };

    const handleEdit = async (item) => {
        await FirebaseService.updateFAQ(item.id, item);
        await fetchData();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            await FirebaseService.deleteFAQ(id);
            setData(data.filter(i => i.id !== id));
        }
    };

    const columns = [
        { key: 'question', label: 'Question' },
        { key: 'category', label: 'Category' }
    ];

    return <DataGrid title="FAQs" columns={columns} data={data} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />;
};

const CategoriesManager = () => {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        const result = await FirebaseService.getCategories();
        setData(result);
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = async ({ ...item }) => {
        await FirebaseService.addCategory(item);
        await fetchData();
    };

    const handleEdit = async (item) => {
        await FirebaseService.updateCategory(item.id, item);
        await fetchData();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            await FirebaseService.deleteCategory(id);
            setData(data.filter(i => i.id !== id));
        }
    };

    const columns = [
        { key: 'name', label: 'Category Name' },
        { key: 'image', label: 'Image URL', type: 'image' },
        { key: 'link', label: 'Link (Optional)' }
    ];

    const handleMoveUp = async (item) => {
        const index = data.findIndex(i => i.id === item.id);
        if (index > 0) {
            const prevItem = data[index - 1];
            const itemOrder = item.order || index;
            const prevItemOrder = prevItem.order || (index - 1);

            const newOrderForItem = prevItemOrder;
            const newOrderForPrev = itemOrder;

            try {
                // Determine orders to swap
                const order1 = typeof item.order === 'number' ? item.order : index;
                const order2 = typeof prevItem.order === 'number' ? prevItem.order : index - 1;

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

export default CMSManager;
