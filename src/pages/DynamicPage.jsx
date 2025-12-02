import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FirebaseService from '../services/FirebaseService';
import './DynamicPage.css'; // We'll create a basic CSS file for this

const DynamicPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const pages = await FirebaseService.getPages();
                const foundPage = pages.find(p => p.slug === slug && p.status === 'Published');

                if (foundPage) {
                    setPage(foundPage);
                } else {
                    // Redirect to 404 or show not found
                    console.log("Page not found");
                }
            } catch (error) {
                console.error("Error fetching page", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, [slug]);

    if (loading) {
        return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading...</div>;
    }

    if (!page) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h1>Page Not Found</h1>
                <p>The page you are looking for does not exist.</p>
            </div>
        );
    }

    return (
        <div className="container dynamic-page">
            <h1 className="page-title">{page.title}</h1>
            <div className="page-content" dangerouslySetInnerHTML={{ __html: page.content || '<p>No content yet.</p>' }} />
        </div>
    );
};

export default DynamicPage;
