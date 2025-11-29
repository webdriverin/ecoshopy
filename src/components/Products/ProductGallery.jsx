import React, { useState } from 'react';

const ProductGallery = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    return (
        <div className="product-gallery">
            <div className="main-image-container">
                <img
                    src={selectedImage}
                    alt="Product"
                    className="main-image"
                />
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
        </div>
    );
};

export default ProductGallery;
