import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/index.css';
import './Button.css'; // Ensure this file exists or add styles to index.css

const Button = ({ children, variant = 'primary', size = 'medium', onClick, className = '', ...props }) => {
    return (
        <button
            className={`btn btn-${variant} btn-${size} ${className} hover-lift`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost']),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    onClick: PropTypes.func,
    className: PropTypes.string,
};

export default Button;
