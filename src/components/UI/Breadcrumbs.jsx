import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ items }) => {
    return (
        <nav aria-label="Breadcrumb" style={{ marginBottom: '2rem' }}>
            <ol style={{
                display: 'flex',
                alignItems: 'center',
                listStyle: 'none',
                padding: 0,
                margin: 0,
                flexWrap: 'wrap',
                gap: '0.5rem',
                fontSize: '0.9rem',
                color: 'var(--color-text-light)'
            }}>
                <li>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-primary">
                        <Home size={16} />
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
                        <ChevronRight size={14} style={{ margin: '0 0.5rem', opacity: 0.5 }} />
                        {index === items.length - 1 ? (
                            <span style={{ color: 'var(--color-text-main)', fontWeight: '500' }} aria-current="page">
                                {item.label}
                            </span>
                        ) : (
                            <Link to={item.path} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-primary">
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
