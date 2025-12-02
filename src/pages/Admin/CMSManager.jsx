import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DataGrid from './DataGrid';

import FirebaseService from '../../services/FirebaseService';

const CMSManager = () => {
    return (
        <Routes>
            <Route path="home" element={<HomePageBuilder />} />
            <Route path="pages" element={<PagesManager />} />
            <Route path="categories" element={<CategoriesManager />} />
            <Route path="faqs" element={<FAQManager />} />
            <Route path="*" element={<Navigate to="home" replace />} />
        </Routes>
    );
};

const HomePageBuilder = () => {
    const [tickers, setTickers] = useState([]);
    const [banners, setBanners] = useState([]);
    const [ads, setAds] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [collections, setCollections] = useState([]);

    React.useEffect(() => {
        fetchTickers();
        fetchBanners();
        fetchAds();
        fetchTestimonials();
        fetchCollections();
    }, []);

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

    // Add Handlers
    const handleAddTicker = async ({ id, ...item }) => {
        await FirebaseService.addTicker({ ...item, status: 'Active' });
        await fetchTickers();
    };

    const handleAddBanner = async ({ id, ...item }) => {
        await FirebaseService.addBanner({ ...item, status: 'Active' });
        await fetchBanners();
    };

    const handleAddAd = async ({ id, ...item }) => {
        await FirebaseService.addAd({ ...item, status: 'Active' });
        await fetchAds();
    };

    const handleAddTestimonial = async ({ id, ...item }) => {
        await FirebaseService.addTestimonial({ ...item, status: 'Active' });
        await fetchTestimonials();
    };

    const handleAddCollection = async ({ id, ...item }) => {
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
        if (window.confirm('Are you sure?')) {
            await FirebaseService.deleteBanner(id);
            setBanners(banners.filter(i => i.id !== id));
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

    React.useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const result = await FirebaseService.getPages();
        setData(result);
    };

    const handleAdd = async ({ id, ...item }) => {
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

    React.useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const result = await FirebaseService.getFAQs();
        setData(result);
    };

    const handleAdd = async ({ id, ...item }) => {
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

    React.useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const result = await FirebaseService.getCategories();
        setData(result);
    };

    const handleAdd = async ({ id, ...item }) => {
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

    return <DataGrid title="Categories" columns={columns} data={data} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />;
};

export default CMSManager;
