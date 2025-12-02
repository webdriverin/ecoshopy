import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Header from './Header';
import '../../styles/index.css';

import Footer from './Footer';

const Layout = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
