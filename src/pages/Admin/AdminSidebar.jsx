import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Layers,
    FileText,
    Database,
    Monitor,
    Users,
    ChevronDown,
    ChevronRight,
    LogOut
} from 'lucide-react';

const AdminSidebar = () => {
    const location = useLocation();
    const [expandedMenus, setExpandedMenus] = useState({});

    const toggleMenu = (menu) => {
        setExpandedMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    const menuItems = [
        {
            label: 'Dashboard',
            icon: LayoutDashboard,
            path: '/admin/dashboard'
        },
        {
            label: 'Orders',
            icon: ShoppingCart,
            submenu: [
                { label: 'All Orders', path: '/admin/orders' },
                { label: 'Failed Orders', path: '/admin/orders/failed' },
                { label: 'POS', path: '/admin/pos' }
            ]
        },
        {
            label: 'Products',
            icon: Package,
            submenu: [
                { label: 'View Products', path: '/admin/products' },
                { label: 'Add Product', path: '/admin/products/add' },
                { label: 'Add Multiple Count', path: '/admin/products/add-multiple' },
                { label: 'Offers', path: '/admin/products/offers' },
                { label: 'Deals', path: '/admin/products/deals' },
                { label: 'Collections', path: '/admin/products/collections' },
                { label: 'Coupons', path: '/admin/products/coupons' },
                { label: 'Freebies', path: '/admin/products/freebies' }
            ]
        },
        {
            label: 'Inventory',
            icon: Layers,
            submenu: [
                { label: 'Stock Availability', path: '/admin/inventory/availability' },
                { label: 'Add Inventory', path: '/admin/inventory/add' },
                { label: 'Running Low', path: '/admin/inventory/low-stock' },
                { label: 'Out of Stock', path: '/admin/inventory/out-of-stock' }
            ]
        },
        {
            label: 'Reports',
            icon: FileText,
            submenu: [
                { label: 'Customer Data', path: '/admin/reports/customers' },
                { label: 'Stock Inventory', path: '/admin/reports/stock' },
                { label: 'Product Requests', path: '/admin/reports/requests' },
                { label: 'Newsletter', path: '/admin/reports/newsletter' },
                { label: 'SEO Reports', path: '/admin/reports/seo' },
                { label: 'Auditor Reports', path: '/admin/reports/auditor' }
            ]
        },
        {
            label: 'Master Data',
            icon: Database,
            submenu: [
                { label: 'Category', path: '/admin/master/category' },
                { label: 'Brands', path: '/admin/master/brands' },
                { label: 'Deals', path: '/admin/master/deals' },
                { label: 'Highlights', path: '/admin/master/highlights' },
                { label: 'Features', path: '/admin/master/features' },
                { label: 'Size Charts', path: '/admin/master/size-charts' },
                { label: 'Badges', path: '/admin/master/badges' },
                { label: 'Manage HSN', path: '/admin/master/hsn' },
                { label: 'Tax Group', path: '/admin/master/tax' },
                { label: 'Courier Partners', path: '/admin/master/courier' }
            ]
        },
        {
            label: 'CMS',
            icon: Monitor,
            submenu: [
                { label: 'Home Page', path: '/admin/cms/home' },
                { label: 'Categories', path: '/admin/cms/categories' },
                { label: 'Pages', path: '/admin/cms/pages' },
                { label: 'FAQs', path: '/admin/cms/faqs' }
            ]
        },
        {
            label: 'Users',
            icon: Users,
            path: '/admin/users'
        }
    ];

    return (
        <aside style={{
            width: '280px',
            backgroundColor: 'white',
            borderRight: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            position: 'sticky',
            top: 0,
            overflowY: 'auto'
        }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                    Ecoshopy Admin
                </div>
            </div>

            <nav style={{ flex: 1, padding: '1rem 0' }}>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        const hasSubmenu = item.submenu && item.submenu.length > 0;
                        const isExpanded = expandedMenus[item.label];
                        const isActive = item.path === location.pathname || (hasSubmenu && item.submenu.some(sub => sub.path === location.pathname));

                        return (
                            <li key={index}>
                                {hasSubmenu ? (
                                    <>
                                        <button
                                            onClick={() => toggleMenu(item.label)}
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '0.75rem 1.5rem',
                                                backgroundColor: isActive ? 'var(--color-accent)' : 'transparent',
                                                color: isActive ? 'var(--color-primary)' : 'var(--color-text-main)',
                                                fontWeight: isActive ? '600' : '400',
                                                borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                                                cursor: 'pointer',
                                                transition: 'all var(--transition-fast)'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <Icon size={20} />
                                                <span>{item.label}</span>
                                            </div>
                                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                        </button>

                                        {isExpanded && (
                                            <ul style={{ backgroundColor: '#F9FAFB', padding: '0.5rem 0' }}>
                                                {item.submenu.map((sub, subIndex) => (
                                                    <li key={subIndex}>
                                                        <Link
                                                            to={sub.path}
                                                            style={{
                                                                display: 'block',
                                                                padding: '0.5rem 1.5rem 0.5rem 3.5rem',
                                                                color: location.pathname === sub.path ? 'var(--color-primary)' : 'var(--color-text-light)',
                                                                fontSize: '0.875rem',
                                                                fontWeight: location.pathname === sub.path ? '500' : '400'
                                                            }}
                                                        >
                                                            {sub.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        to={item.path}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.75rem 1.5rem',
                                            backgroundColor: isActive ? 'var(--color-accent)' : 'transparent',
                                            color: isActive ? 'var(--color-primary)' : 'var(--color-text-main)',
                                            fontWeight: isActive ? '600' : '400',
                                            borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                                            transition: 'all var(--transition-fast)'
                                        }}
                                    >
                                        <Icon size={20} />
                                        <span>{item.label}</span>
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div style={{ padding: '1rem', borderTop: '1px solid var(--color-border)' }}>
                <Link
                    to="/admin/login"
                    onClick={() => localStorage.removeItem('isAdmin')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        color: 'var(--color-error)',
                        borderRadius: 'var(--radius-md)',
                        transition: 'background-color var(--transition-fast)'
                    }}
                >
                    <LogOut size={20} /> Logout
                </Link>
            </div>
        </aside>
    );
};

export default AdminSidebar;
