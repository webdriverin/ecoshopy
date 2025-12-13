import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

const ProductGallery = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);
    const [zoomStyle, setZoomStyle] = useState({ transform: 'scale(1)', transformOrigin: 'center center' });
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setZoomStyle({
            transform: 'scale(2)',
            transformOrigin: `${x}% ${y}%`
        });
    };

    const handleMouseLeave = () => {
        setZoomStyle({ transform: 'scale(1)', transformOrigin: 'center center' });
    };

    const openLightbox = () => {
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
    };

    const nextImage = (e) => {
        e.stopPropagation();
        const currentIndex = images.indexOf(selectedImage);
        const nextIndex = (currentIndex + 1) % images.length;
        setSelectedImage(images[nextIndex]);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        const currentIndex = images.indexOf(selectedImage);
        const prevIndex = (currentIndex - 1 + images.length) % images.length;
        setSelectedImage(images[prevIndex]);
    };

    return (
        <div className="product-gallery">
            <div
                className="main-image-container"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={openLightbox}
            >
                <img
                    src={selectedImage}
                    alt="Product"
                    className="main-image"
                    style={zoomStyle}
                />
                <div className="zoom-hint">
                    <Maximize2 size={20} />
                </div>
            </div>

            <div className="thumbnail-list">
                {images.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(img)}
                        className={`thumbnail-btn ${selectedImage === img ? 'active' : ''}`}
                    >
                        <img
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className="thumbnail-image"
                        />
                    </button>
                ))}
            </div>

            {/* Lightbox Overlay */}
            {isLightboxOpen && (
                <div className="lightbox-overlay" onClick={closeLightbox}>
                    <button className="lightbox-close" onClick={closeLightbox}>
                        <X size={32} />
                    </button>

                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <button className="lightbox-nav-btn prev" onClick={prevImage}>
                            <ChevronLeft size={40} />
                        </button>

                        <img src={selectedImage} alt="Product Fullscreen" className="lightbox-image" />

                        <button className="lightbox-nav-btn next" onClick={nextImage}>
                            <ChevronRight size={40} />
                        </button>
                    </div>

                    <div className="lightbox-thumbnails">
                        {images.map((img, index) => (
                            <button
                                key={index}
                                onClick={(e) => { e.stopPropagation(); setSelectedImage(img); }}
                                className={`lightbox-thumb ${selectedImage === img ? 'active' : ''}`}
                            >
                                <img src={img} alt={`Thumb ${index}`} />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductGallery;
