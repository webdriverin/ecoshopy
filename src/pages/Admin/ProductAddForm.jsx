import React, { useState, useEffect } from 'react';
import Button from '../../components/UI/Button';
import { Save, Plus, Trash2, Search, Upload, X, ArrowLeft, Info, Layers, Image as ImageIcon, Tag, Truck, List } from 'lucide-react';
import FirebaseService from '../../services/FirebaseService';
import { useNavigate, useParams } from 'react-router-dom';
import VariantManager from './VariantManager';

const ProductAddForm = ({ type: initialType }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [currentType, setCurrentType] = useState(initialType || 'Standard');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        mrp: '',
        price: '',
        stock: '',
        category: '',
        newCategory: '',
        keyFeatures: [],
        description: '',
        featured: false,
        images: [], // Array of image URLs
        features: [], // Array of feature strings
        attributes: [], // Array of { key, value } objects
        shippingInfo: '', // Shipping Information
        customSections: [] // Array of { title, content } objects
    });

    // Image Upload State
    // { type: 'file' | 'url', file?: File, preview: string, color?: string }
    const [galleryItems, setGalleryItems] = useState([]);
    const [imageUrlInput, setImageUrlInput] = useState('');

    // Features State
    const [featureInput, setFeatureInput] = useState('');

    // Attributes State
    const [attributeInput, setAttributeInput] = useState({ key: '', value: '' });

    // Custom Sections State
    const [sectionInput, setSectionInput] = useState({ title: '', content: '' });

    // Multiple Count State
    const [variants, setVariants] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cats = await FirebaseService.getCategories();
                setCategories(cats);

                // If editing, fetch product data
                if (isEditing) {
                    const product = await FirebaseService.getProductById(id);
                    if (product) {
                        const typeMap = {
                            'standard': 'Standard',
                            'multiple count': 'Multiple Count'
                        };
                        const normalizedType = typeMap[product.type] || 'Standard';
                        setCurrentType(normalizedType);

                        setFormData({
                            name: product.name || '',
                            sku: product.sku || '',
                            mrp: product.mrp || '',
                            price: product.price || '',
                            stock: product.stock || '',
                            category: product.category || '',
                            newCategory: '',
                            keyFeatures: product.keyFeatures || product.features || [],
                            description: product.description || '',
                            featured: product.featured || false,
                            images: product.images || [],
                            features: product.features || [],
                            attributes: product.attributes || [],
                            shippingInfo: product.shippingInfo || '',
                            customSections: product.customSections || [],
                            offerText: product.offerText || ''
                        });

                        const images = product.images && product.images.length > 0
                            ? product.images
                            : (product.image ? [product.image] : []);

                        // If we have imageColors map, use it
                        const imageColors = product.imageColors || {};

                        setGalleryItems(images.map(url => ({
                            type: 'url',
                            preview: url,
                            color: imageColors[url] || ''
                        })));

                        // Populate Type Specifics
                        if (normalizedType === 'Multiple Count' && product.variants) {
                            setVariants(product.variants);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, [id, initialType, isEditing]);

    // Sync currentType with initialType when not editing
    useEffect(() => {
        if (!isEditing && initialType) {
            setCurrentType(initialType);
        }
    }, [initialType, isEditing]);


    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    // Image Handling
    const handleImageChangeRevised = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + galleryItems.length > 5) {
            alert("You can only upload a maximum of 5 images.");
            return;
        }

        const newItems = files.map(file => ({
            type: 'file',
            file: file,
            preview: URL.createObjectURL(file),
            color: ''
        }));

        setGalleryItems([...galleryItems, ...newItems]);
    };

    const addImageUrlRevised = () => {
        if (imageUrlInput && (galleryItems.length < 5)) {
            setGalleryItems([...galleryItems, { type: 'url', preview: imageUrlInput, color: '' }]);
            setImageUrlInput('');
        }
    };

    const removeGalleryItem = (index) => {
        setGalleryItems(galleryItems.filter((_, i) => i !== index));
    };

    const handleImageColorChange = (index, color) => {
        const newItems = [...galleryItems];
        newItems[index].color = color;
        setGalleryItems(newItems);
    };

    // Features Handling
    const addFeature = () => {
        if (featureInput.trim()) {
            setFormData({
                ...formData,
                keyFeatures: [...(formData.keyFeatures || []), featureInput.trim()]
            });
            setFeatureInput('');
        }
    };

    const removeFeature = (index) => {
        const newFeatures = (formData.keyFeatures || []).filter((_, i) => i !== index);
        setFormData({ ...formData, keyFeatures: newFeatures });
    };

    // Attributes Handling
    const addAttribute = () => {
        if (attributeInput.key.trim() && attributeInput.value.trim()) {
            setFormData({
                ...formData,
                attributes: [...formData.attributes, { key: attributeInput.key.trim(), value: attributeInput.value.trim() }]
            });
            setAttributeInput({ key: '', value: '' });
        }
    };

    const removeAttribute = (index) => {
        const newAttributes = formData.attributes.filter((_, i) => i !== index);
        setFormData({ ...formData, attributes: newAttributes });
    };

    // Custom Sections Handling
    const addSection = () => {
        if (sectionInput.title.trim() && sectionInput.content.trim()) {
            setFormData({
                ...formData,
                customSections: [...formData.customSections, { title: sectionInput.title.trim(), content: sectionInput.content.trim() }]
            });
            setSectionInput({ title: '', content: '' });
        }
    };

    const removeSection = (index) => {
        const newSections = formData.customSections.filter((_, i) => i !== index);
        setFormData({ ...formData, customSections: newSections });
    };

    // Helper to get available colors from attributes
    const getAvailableColors = () => {
        const colorAttr = formData.attributes.find(a => a.key.toLowerCase() === 'color');
        if (!colorAttr) return [];
        return colorAttr.value.split(',').map(c => c.trim()).filter(Boolean);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validation for Multiple Count
            if (currentType === 'Multiple Count' && variants.length === 0) {
                alert("Please add at least one variant for Multiple Count product.");
                setLoading(false);
                return;
            }

            // Upload Images
            const finalImages = [];
            const imageColors = {};

            for (const item of galleryItems) {
                let url = item.preview;
                if (item.type === 'file') {
                    url = await FirebaseService.uploadImage(item.file, 'products');
                }
                finalImages.push(url);
                if (item.color) {
                    imageColors[url] = item.color;
                }
            }

            const finalCategory = formData.newCategory || formData.category;

            // Determine price range or base price for Multiple Count
            let finalPrice = formData.price;
            let finalMrp = formData.mrp;
            let finalStock = formData.stock;

            if (currentType === 'Multiple Count') {
                // Use the lowest price variant as the base price
                const minPriceVariant = variants.reduce((min, v) => parseFloat(v.price) < parseFloat(min.price) ? v : min, variants[0]);
                finalPrice = minPriceVariant.price;
                finalMrp = minPriceVariant.mrp || '';
                // Sum stock
                finalStock = variants.reduce((sum, v) => sum + parseInt(v.stock || 0), 0);
            }

            const productData = {
                ...formData,
                category: finalCategory,
                type: currentType ? currentType.toLowerCase() : 'standard',
                price: finalPrice,
                mrp: finalMrp,
                stock: finalStock,
                images: finalImages,
                image: finalImages[0] || '', // Backward compatibility
                imageColors: imageColors, // Save color mapping
                // Don't overwrite createdAt on edit
                ...(isEditing ? {} : { createdAt: new Date().toISOString() }),
                updatedAt: new Date().toISOString()
            };

            // Remove temporary fields
            delete productData.newCategory;
            delete productData.imageUrlInput;

            if (currentType === 'Multiple Count') {
                productData.variants = variants;
            }

            if (isEditing) {
                await FirebaseService.updateProduct(id, productData);
                alert('Product Updated Successfully!');
            } else {
                await FirebaseService.addProduct(productData);
                if (formData.newCategory) {
                    try {
                        await FirebaseService.addCategory({ name: formData.newCategory });
                    } catch (err) {
                        console.log("Could not auto-save new category", err);
                    }
                }
                alert(`${currentType || 'Standard'} Product Added Successfully!`);
            }

            navigate('/admin/products');
        } catch (error) {
            console.error("Error saving product", error);
            alert("Failed to save product: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const availableColors = getAvailableColors();

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <Button variant="secondary" onClick={() => navigate('/admin/products')} style={{ marginRight: '1rem' }}>
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text-main)' }}>
                        {isEditing ? 'Edit' : 'Add New'} {currentType} Product
                    </h1>
                    <p style={{ color: 'var(--color-text-light)' }}>
                        Fill in the details below to {isEditing ? 'update the' : 'create a new'} product.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                {/* Left Column: Main Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Basic Information Card */}
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Info size={20} color="var(--color-primary)" /> Basic Information
                        </h2>

                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Premium Bamboo Toothbrush"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>SKU (Stock Keeping Unit)</label>
                                    <input
                                        type="text"
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleChange}
                                        placeholder="e.g. PROD-001"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                    />
                                </div>
                                {currentType !== 'Multiple Count' && (
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Stock Quantity</label>
                                        <input
                                            type="number"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            placeholder="0"
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="5"
                                    required
                                    placeholder="Detailed description of the product..."
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Card (Standard Only) */}
                    {currentType !== 'Multiple Count' && (
                        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Tag size={20} color="var(--color-primary)" /> Pricing
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>M.R.P. (₹)</label>
                                    <input
                                        type="number"
                                        name="mrp"
                                        value={formData.mrp || ''}
                                        onChange={handleChange}
                                        min="0"
                                        placeholder="0.00"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Selling Price (₹)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        placeholder="0.00"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                    />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Offer Text (Optional)</label>
                                    <input
                                        type="text"
                                        name="offerText"
                                        value={formData.offerText || ''}
                                        onChange={handleChange}
                                        placeholder="e.g. 20% OFF, Festive Offer"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                    />
                                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '0.25rem' }}>
                                        If left empty, no discount badge will be shown.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Variants Card (Multiple Count Only) */}
                    {currentType === 'Multiple Count' && (
                        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Layers size={20} color="var(--color-primary)" /> Variants
                            </h2>
                            <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
                                Manage different packs or sizes for this product.
                            </p>
                            <VariantManager variants={variants} onChange={setVariants} />
                        </div>
                    )}

                    {/* Media Card */}
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ImageIcon size={20} color="var(--color-primary)" /> Media
                        </h2>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                            {galleryItems.map((item, index) => (
                                <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '120px' }}>
                                    <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                                        <img src={item.preview} alt={`Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryItem(index)}
                                            style={{
                                                position: 'absolute', top: '-8px', right: '-8px',
                                                backgroundColor: 'white', color: 'var(--color-error)',
                                                borderRadius: '50%', width: '24px', height: '24px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                border: '1px solid var(--color-border)', cursor: 'pointer',
                                                boxShadow: 'var(--shadow-sm)'
                                            }}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>

                                    {/* Color Assignment */}
                                    {availableColors.length > 0 && (
                                        <select
                                            value={item.color || ''}
                                            onChange={(e) => handleImageColorChange(index, e.target.value)}
                                            style={{ width: '100%', padding: '0.25rem', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                                        >
                                            <option value="">No Color</option>
                                            {availableColors.map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            ))}

                            {galleryItems.length < 5 && (
                                <label style={{
                                    width: '120px', height: '120px',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer', backgroundColor: '#F9FAFB', transition: 'all 0.2s'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                                >
                                    <Upload size={24} color="var(--color-text-light)" />
                                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: '0.5rem', fontWeight: '500' }}>Upload Image</span>
                                    <input type="file" accept="image/*" onChange={handleImageChangeRevised} style={{ display: 'none' }} multiple />
                                </label>
                            )}
                        </div>

                        {galleryItems.length < 5 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    placeholder="Or paste image URL..."
                                    value={imageUrlInput}
                                    onChange={(e) => setImageUrlInput(e.target.value)}
                                    style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                />
                                <Button type="button" variant="secondary" onClick={addImageUrlRevised} disabled={!imageUrlInput}>
                                    Add URL
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Attributes & Features */}
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <List size={20} color="var(--color-primary)" /> Specifications
                        </h2>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Key Features</label>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                <input
                                    type="text"
                                    placeholder="Add a feature (e.g., '100% Natural')"
                                    value={featureInput}
                                    onChange={(e) => setFeatureInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                    style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                />
                                <Button type="button" variant="secondary" onClick={addFeature}>
                                    <Plus size={20} />
                                </Button>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {formData.keyFeatures && formData.keyFeatures.map((feature, index) => (
                                    <li key={index} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '0.75rem', backgroundColor: '#F9FAFB', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)'
                                    }}>
                                        <span>{feature}</span>
                                        <button type="button" onClick={() => removeFeature(index)} style={{ color: 'var(--color-error)', cursor: 'pointer', background: 'none', border: 'none' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Attributes (Color, Size, etc.)</label>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={attributeInput.key}
                                    onChange={(e) => setAttributeInput({ ...attributeInput, key: e.target.value })}
                                    style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                />
                                <input
                                    type="text"
                                    placeholder="Value"
                                    value={attributeInput.value}
                                    onChange={(e) => setAttributeInput({ ...attributeInput, value: e.target.value })}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAttribute())}
                                    style={{ flex: 2, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                />
                                <Button type="button" variant="secondary" onClick={addAttribute}>
                                    <Plus size={20} />
                                </Button>
                            </div>
                            {formData.attributes.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {formData.attributes.map((attr, index) => (
                                        <div key={index} style={{
                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                            padding: '0.5rem 0.75rem', backgroundColor: '#F3F4F6',
                                            borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
                                            fontSize: '0.875rem'
                                        }}>
                                            <span style={{ fontWeight: '600' }}>{attr.key}:</span>
                                            <span>{attr.value}</span>
                                            <button type="button" onClick={() => removeAttribute(index)} style={{ color: 'var(--color-error)', display: 'flex', cursor: 'pointer', background: 'none', border: 'none' }}>
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Custom Sections */}
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <List size={20} color="var(--color-primary)" /> Additional Info
                        </h2>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Shipping Information</label>
                            <textarea
                                name="shippingInfo"
                                value={formData.shippingInfo || ''}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Enter shipping details..."
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                            ></textarea>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Custom Sections</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem', padding: '1rem', backgroundColor: '#F9FAFB', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                                <input
                                    type="text"
                                    placeholder="Section Title (e.g. Warranty)"
                                    value={sectionInput.title}
                                    onChange={(e) => setSectionInput({ ...sectionInput, title: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                />
                                <textarea
                                    placeholder="Section Content"
                                    value={sectionInput.content}
                                    onChange={(e) => setSectionInput({ ...sectionInput, content: e.target.value })}
                                    rows="3"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                                ></textarea>
                                <Button type="button" variant="secondary" onClick={addSection} disabled={!sectionInput.title || !sectionInput.content}>
                                    <Plus size={20} style={{ marginRight: '0.5rem' }} /> Add Section
                                </Button>
                            </div>

                            {formData.customSections.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {formData.customSections.map((section, index) => (
                                        <div key={index} style={{
                                            padding: '1rem', backgroundColor: 'white',
                                            borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
                                            position: 'relative'
                                        }}>
                                            <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{section.title}</div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', whiteSpace: 'pre-line' }}>{section.content}</div>
                                            <button
                                                type="button"
                                                onClick={() => removeSection(index)}
                                                style={{
                                                    position: 'absolute', top: '1rem', right: '1rem',
                                                    color: 'var(--color-error)', cursor: 'pointer',
                                                    background: 'none', border: 'none'
                                                }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Right Column: Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Organization Card */}
                    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Organization</h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required={!formData.newCategory}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: '0.5rem' }}
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                name="newCategory"
                                placeholder="Or create new..."
                                value={formData.newCategory || ''}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="checkbox"
                                name="featured"
                                checked={formData.featured}
                                onChange={handleChange}
                                id="featured"
                                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                            />
                            <label htmlFor="featured" style={{ cursor: 'pointer', fontSize: '0.9rem' }}>Featured Product</label>
                        </div>
                    </div>

                    {/* Actions Card */}
                    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Actions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Button variant="primary" type="submit" disabled={loading} style={{ width: '100%' }}>
                                <Save size={20} style={{ marginRight: '0.5rem' }} /> {loading ? 'Saving...' : 'Save Product'}
                            </Button>
                            <Button variant="secondary" type="button" onClick={() => navigate('/admin/products')} style={{ width: '100%' }}>
                                Cancel
                            </Button>
                        </div>
                    </div>

                </div>
            </form>
        </div>
    );
};

export default ProductAddForm;
