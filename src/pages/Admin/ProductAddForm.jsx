import React, { useState, useEffect } from 'react';
import Button from '../../components/UI/Button';
import { Save, Plus, Trash2, Search, Upload, X } from 'lucide-react';
import FirebaseService from '../../services/FirebaseService';
import { useNavigate, useParams } from 'react-router-dom';

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
    const [variants, setVariants] = useState([{ name: '', price: '', stock: '' }]);

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
                            attributes: product.attributes || [],
                            shippingInfo: product.shippingInfo || '',
                            customSections: product.customSections || []
                        });

                        // Populate Gallery with Colors
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

    // Multiple Count Logic
    const handleVariantChange = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const addVariant = () => {
        setVariants([...variants, { name: '', price: '', stock: '' }]);
    };

    const removeVariant = (index) => {
        const newVariants = variants.filter((_, i) => i !== index);
        setVariants(newVariants);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
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

            const productData = {
                ...formData,
                category: finalCategory,
                type: currentType ? currentType.toLowerCase() : 'standard',
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
        <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '2rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>{isEditing ? 'Edit' : 'Add'} {currentType || 'Standard'} Product</h1>

            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

                    {/* Basic Info */}
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                        />
                    </div>

                    {/* Category Selection */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Category</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required={!formData.newCategory}
                                style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}

                            </select>
                            <input
                                type="text"
                                name="newCategory"
                                placeholder="Or type new..."
                                value={formData.newCategory || ''}
                                onChange={handleChange}
                                style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            />
                        </div>
                    </div>

                    {/* Price & Stock */}
                    {currentType !== 'Multiple Count' && (
                        <>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>M.R.P. (₹)</label>
                                <input
                                    type="number"
                                    name="mrp"
                                    value={formData.mrp || ''}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="e.g. 1000"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                />
                                <small style={{ color: 'var(--color-text-light)' }}>Leave empty if same as selling price.</small>
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
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                />
                            </div>
                        </>
                    )}

                    {/* Attributes Section */}
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Product Attributes (Color, Size, Material, etc.)</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Name (e.g. Color)"
                                value={attributeInput.key}
                                onChange={(e) => setAttributeInput({ ...attributeInput, key: e.target.value })}
                                style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            />
                            <input
                                type="text"
                                placeholder="Value (e.g. Red, Blue)"
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
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                                {formData.attributes.map((attr, index) => (
                                    <div key={index} style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        padding: '0.5rem 0.75rem', backgroundColor: '#F3F4F6',
                                        borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
                                        fontSize: '0.875rem'
                                    }}>
                                        <span style={{ fontWeight: '600' }}>{attr.key}:</span>
                                        <span>{attr.value}</span>
                                        <button type="button" onClick={() => removeAttribute(index)} style={{ color: 'var(--color-error)', display: 'flex', cursor: 'pointer' }}>
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
                            Tip: For "Color", enter values separated by commas (e.g. "Red, Blue") to enable image color assignment.
                        </p>
                    </div>

                    {/* Image Upload (Max 5) */}
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Product Images (Max 5)</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                            {/* Previews */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                {galleryItems.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '120px' }}>
                                        <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                                            <img src={item.preview} alt={`Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryItem(index)}
                                                style={{
                                                    position: 'absolute', top: '-5px', right: '-5px',
                                                    backgroundColor: 'var(--color-error)', color: 'white',
                                                    borderRadius: '50%', width: '20px', height: '20px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    border: 'none', cursor: 'pointer'
                                                }}
                                            >
                                                <X size={12} />
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
                                        border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)',
                                        cursor: 'pointer', backgroundColor: '#F9FAFB'
                                    }}>
                                        <Upload size={24} color="var(--color-text-light)" />
                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: '0.25rem' }}>Add Image</span>
                                        <input type="file" accept="image/*" onChange={handleImageChangeRevised} style={{ display: 'none' }} multiple />
                                    </label>
                                )}
                            </div>

                            {/* URL Input */}
                            {galleryItems.length < 5 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Or enter image URL..."
                                        value={imageUrlInput}
                                        onChange={(e) => setImageUrlInput(e.target.value)}
                                        style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                    />
                                    <Button type="button" variant="secondary" size="sm" onClick={addImageUrlRevised} disabled={!imageUrlInput}>
                                        Add URL
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Key Features */}
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Key Features (Displayed in Product Info)</label>
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
                                    <button type="button" onClick={() => removeFeature(index)} style={{ color: 'var(--color-error)', cursor: 'pointer' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Type Specific Fields */}

                    {/* MULTIPLE COUNT PRODUCTS */}
                    {currentType === 'Multiple Count' && (
                        <div style={{ gridColumn: '1 / -1', padding: '1.5rem', backgroundColor: '#F9FAFB', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.1rem' }}>Product Variants</h3>
                                <Button type="button" variant="secondary" size="sm" onClick={addVariant}>
                                    <Plus size={16} style={{ marginRight: '0.25rem' }} /> Add Variant
                                </Button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {variants.map((variant, index) => (
                                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', fontWeight: '500', marginBottom: '0.25rem', display: 'block' }}>Variant Name (e.g. Pack of 2)</label>
                                            <input
                                                type="text"
                                                value={variant.name}
                                                onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                                                placeholder="Pack of 2"
                                                required
                                                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', fontWeight: '500', marginBottom: '0.25rem', display: 'block' }}>Price</label>
                                            <input
                                                type="number"
                                                value={variant.price}
                                                onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                                placeholder="0.00"
                                                required
                                                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', fontWeight: '500', marginBottom: '0.25rem', display: 'block' }}>Stock</label>
                                            <input
                                                type="number"
                                                value={variant.stock}
                                                onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                                placeholder="0"
                                                required
                                                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeVariant(index)}
                                            style={{ color: 'var(--color-error)', padding: '0.5rem', marginBottom: '2px' }}
                                            disabled={variants.length === 1}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                        ></textarea>
                    </div>

                    {/* Shipping Info */}
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Shipping Information</label>
                        <textarea
                            name="shippingInfo"
                            value={formData.shippingInfo || ''}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Enter shipping details (e.g., 'Free shipping on orders over ₹500. Delivery in 3-5 days.')"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                        ></textarea>
                    </div>

                    {/* Custom Sections */}
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Custom Sections (e.g. Warranty, Care Instructions)</label>

                        {/* Input Area */}
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

                        {/* List of Sections */}
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

                    {/* Featured Checkbox */}
                    <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center' }}>
                        <input
                            type="checkbox"
                            name="featured"
                            checked={formData.featured}
                            onChange={handleChange}
                            id="featured"
                            style={{ width: '18px', height: '18px', marginRight: '0.5rem', cursor: 'pointer' }}
                        />
                        <label htmlFor="featured" style={{ cursor: 'pointer', fontWeight: '500' }}>Mark as Featured (Show on Home Page)</label>
                    </div>

                    {/* Submit Button */}
                    <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <Button variant="primary" type="submit" disabled={loading} style={{ minWidth: '150px' }}>
                            <Save size={20} style={{ marginRight: '0.5rem' }} /> {loading ? 'Saving...' : 'Save Product'}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ProductAddForm;
