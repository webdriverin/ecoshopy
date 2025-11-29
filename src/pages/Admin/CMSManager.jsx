import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DataGrid from './DataGrid';

const CMSManager = () => {
    return (
        <Routes>
            <Route path="home" element={<HomePageBuilder />} />
            <Route path="pages" element={<PagesManager />} />
            <Route path="faqs" element={<FAQManager />} />
            <Route path="*" element={<Navigate to="home" replace />} />
        </Routes>
    );
};

const HomePageBuilder = () => {
    const [tickers] = useState([
        { id: '1', content: 'Free Shipping on orders over $50!', status: 'Active' },
        { id: '2', content: 'Summer Sale is Live!', status: 'Inactive' }
    ]);

    const [banners] = useState([
        { id: '1', title: 'New Arrivals', image: 'banner1.jpg', status: 'Active' }
    ]);

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Home Page Builder</h1>

            <div style={{ marginBottom: '3rem' }}>
                <DataGrid
                    title="Header Tickers"
                    columns={[{ key: 'content', label: 'Content' }, { key: 'status', label: 'Status' }]}
                    data={tickers}
                    onAdd={() => { }}
                    onEdit={() => { }}
                    onDelete={() => { }}
                />
            </div>

            <div style={{ marginBottom: '3rem' }}>
                <DataGrid
                    title="Home Banners"
                    columns={[{ key: 'title', label: 'Title' }, { key: 'image', label: 'Image' }, { key: 'status', label: 'Status' }]}
                    data={banners}
                    onAdd={() => { }}
                    onEdit={() => { }}
                    onDelete={() => { }}
                />
            </div>

            {/* Add more sections for Ads, Testimonials, etc. */}
        </div>
    );
};

const PagesManager = () => {
    const [data] = useState([
        { id: '1', title: 'About Us', slug: 'about', status: 'Published' },
        { id: '2', title: 'Contact Us', slug: 'contact', status: 'Published' },
        { id: '3', title: 'Privacy Policy', slug: 'privacy', status: 'Draft' }
    ]);

    const columns = [
        { key: 'title', label: 'Page Title' },
        { key: 'slug', label: 'Slug' },
        { key: 'status', label: 'Status' }
    ];

    return <DataGrid title="Pages" columns={columns} data={data} onAdd={() => { }} onEdit={() => { }} onDelete={() => { }} />;
};

const FAQManager = () => {
    const [data] = useState([
        { id: '1', question: 'What is your return policy?', category: 'Returns' },
        { id: '2', question: 'How long does shipping take?', category: 'Shipping' }
    ]);

    const columns = [
        { key: 'question', label: 'Question' },
        { key: 'category', label: 'Category' }
    ];

    return <DataGrid title="FAQs" columns={columns} data={data} onAdd={() => { }} onEdit={() => { }} onDelete={() => { }} />;
};

export default CMSManager;
