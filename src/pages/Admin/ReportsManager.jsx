import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DataGrid from './DataGrid';
import FirebaseService from '../../services/FirebaseService';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const ReportsManager = () => {
    return (
        <Routes>
            <Route path="customers" element={<CustomerReports />} />
            <Route path="stock" element={<StockReports />} />
            <Route path="requests" element={<ProductRequestsReport />} />
            <Route path="newsletter" element={<NewsletterReport />} />
            <Route path="seo" element={<SEOReport />} />
            <Route path="auditor" element={<AuditorReport />} />
            <Route path="*" element={<Navigate to="customers" replace />} />
        </Routes>
    );
};

const CustomerReports = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [customers, orders] = await Promise.all([
                    FirebaseService.getCustomers(),
                    FirebaseService.getOrders()
                ]);

                // Aggregate order data per customer
                const customerStats = customers.map(customer => {
                    const customerOrders = orders.filter(o => o.userId === customer.id || o.email === customer.email);
                    // Filter for paid orders only
                    const paidOrders = customerOrders.filter(o => o.paymentStatus === 'Paid' || o.status === 'Delivered');
                    const totalSpent = paidOrders.reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0);
                    return {
                        ...customer,
                        ordersCount: customerOrders.length, // Keep total count or change to paid count? Usually total count is fine, but spend should be real.
                        totalSpent: `₹${totalSpent.toFixed(2)}`
                    };
                });

                setData(customerStats);
            } catch (error) {
                console.error("Error fetching customer reports", error);
            }
        };
        fetchData();
    }, []);

    const columns = [
        { key: 'displayName', label: 'Customer Name' }, // Firebase Auth uses displayName
        { key: 'email', label: 'Email' },
        { key: 'ordersCount', label: 'Total Orders' },
        { key: 'totalSpent', label: 'Total Spent' }
    ];

    return <DataGrid title="Customer Reports" columns={columns} data={data} />;
};

const StockReports = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await FirebaseService.getProducts();
                setData(result.map(p => {
                    let status = 'In Stock';
                    if (p.stock <= 0) status = 'Out of Stock';
                    else if (p.stock < 10) status = 'Low Stock';

                    return {
                        ...p,
                        value: `₹${(p.price * p.stock).toFixed(2)}`,
                        stockStatus: status
                    };
                }));
            } catch (error) {
                console.error("Error fetching stock reports", error);
            }
        };
        fetchData();
    }, []);

    const columns = [
        { key: 'name', label: 'Product Name' },
        { key: 'stock', label: 'Stock Level' },
        { key: 'value', label: 'Stock Value' },
        {
            key: 'stockStatus',
            label: 'Status',
            render: (row) => (
                <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '50px',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    backgroundColor: row.stockStatus === 'In Stock' ? '#d1fae5' : row.stockStatus === 'Low Stock' ? '#fef3c7' : '#fee2e2',
                    color: row.stockStatus === 'In Stock' ? '#059669' : row.stockStatus === 'Low Stock' ? '#d97706' : '#dc2626'
                }}>
                    {row.stockStatus}
                </span>
            )
        }
    ];

    return <DataGrid title="Stock Inventory Reports" columns={columns} data={data} />;
};

const ProductRequestsReport = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await FirebaseService.getProductRequests();
                setData(result);
            } catch (error) {
                console.error("Error fetching product requests", error);
            }
        };
        fetchData();
    }, []);

    const columns = [
        { key: 'productName', label: 'Requested Product' },
        { key: 'email', label: 'User Email' },
        { key: 'createdAt', label: 'Date Requested', render: (row) => new Date(row.createdAt).toLocaleDateString() },
        { key: 'status', label: 'Status' }
    ];

    return <DataGrid title="Product Requests" columns={columns} data={data} />;
};

const NewsletterReport = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await FirebaseService.getNewsletterSubscribers();
                setData(result);
            } catch (error) {
                console.error("Error fetching newsletter subscribers", error);
            }
        };
        fetchData();
    }, []);

    const columns = [
        { key: 'email', label: 'Subscriber Email' },
        { key: 'subscribedAt', label: 'Date Subscribed', render: (row) => new Date(row.subscribedAt).toLocaleDateString() }
    ];

    return <DataGrid title="Newsletter Subscribers" columns={columns} data={data} />;
};

const SEOReport = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [products, pages] = await Promise.all([
                    FirebaseService.getProducts(),
                    FirebaseService.getPages()
                ]);

                const issues = [];

                // Check Products
                products.forEach(p => {
                    if (!p.metaTitle || !p.metaDescription) {
                        issues.push({
                            id: p.id,
                            type: 'Product',
                            name: p.name,
                            issue: !p.metaTitle && !p.metaDescription ? 'Missing Title & Desc' : !p.metaTitle ? 'Missing Title' : 'Missing Desc',
                            link: `/admin/products/edit/${p.id}`
                        });
                    }
                });

                // Check Pages
                pages.forEach(p => {
                    if (!p.metaTitle || !p.metaDescription) {
                        issues.push({
                            id: p.id,
                            type: 'Page',
                            name: p.title,
                            issue: !p.metaTitle && !p.metaDescription ? 'Missing Title & Desc' : !p.metaTitle ? 'Missing Title' : 'Missing Desc',
                            link: `/admin/cms/pages` // Simplified link
                        });
                    }
                });

                setData(issues);
            } catch (error) {
                console.error("Error fetching SEO report", error);
            }
        };
        fetchData();
    }, []);

    const columns = [
        { key: 'type', label: 'Type' },
        { key: 'name', label: 'Name' },
        { key: 'issue', label: 'SEO Issue', render: (row) => <span style={{ color: '#dc2626', fontWeight: '500' }}>{row.issue}</span> },
        { key: 'link', label: 'Action', render: (row) => <a href={row.link} style={{ color: 'blue', textDecoration: 'underline' }}>Fix</a> }
    ];

    return <DataGrid title="SEO Reports (Missing Metadata)" columns={columns} data={data} />;
};

const AuditorReport = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await FirebaseService.getAuditLogs();
                setData(result);
            } catch (error) {
                console.error("Error fetching audit logs", error);
            }
        };
        fetchData();
    }, []);

    const columns = [
        { key: 'timestamp', label: 'Time', render: (row) => new Date(row.timestamp).toLocaleString() },
        { key: 'userEmail', label: 'User' },
        { key: 'action', label: 'Action' },
        { key: 'details', label: 'Details' }
    ];

    return <DataGrid title="Auditor Logs" columns={columns} data={data} />;
};

export default ReportsManager;
