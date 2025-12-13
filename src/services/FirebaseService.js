import { db, auth, storage } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, getDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const FirebaseService = {
    // Auth
    signup: (email, password) => createUserWithEmailAndPassword(auth, email, password),
    login: (email, password) => signInWithEmailAndPassword(auth, email, password),
    logout: () => signOut(auth),

    // Products
    getProducts: async () => {
        const querySnapshot = await getDocs(collection(db, 'products'));
        return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    },
    getFeaturedProducts: async () => {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const allProducts = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        return allProducts.filter(p => p.featured === true).slice(0, 8);
    },
    getProductById: async (id) => {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { ...docSnap.data(), id: docSnap.id };
        } else {
            throw new Error("Product not found");
        }
    },
    getDealProducts: async () => {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const allProducts = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        return allProducts.filter(p => p.isDealOfTheDay === true);
    },
    addProduct: (product) => addDoc(collection(db, 'products'), {
        ...product,
        createdAt: new Date().toISOString(),
        price: parseFloat(product.price),
        stock: parseInt(product.stock)
    }),
    updateProduct: (id, updates) => updateDoc(doc(db, 'products', id), updates),
    deleteProduct: (id) => deleteDoc(doc(db, 'products', id)),

    // Categories & Brands
    getCategories: async () => {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const categories = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        return categories.sort((a, b) => {
            const orderA = a.order !== undefined ? a.order : 9999;
            const orderB = b.order !== undefined ? b.order : 9999;
            return orderA - orderB;
        });
    },
    addCategory: (category) => addDoc(collection(db, 'categories'), category),
    updateCategory: (id, updates) => updateDoc(doc(db, 'categories', id), updates),
    deleteCategory: (id) => deleteDoc(doc(db, 'categories', id)),

    getBrands: async () => {
        const querySnapshot = await getDocs(collection(db, 'brands'));
        return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    },
    addBrand: (brand) => addDoc(collection(db, 'brands'), brand),
    deleteBrand: (id) => deleteDoc(doc(db, 'brands', id)),

    // Offers & Coupons
    getOffers: async () => {
        const querySnapshot = await getDocs(collection(db, 'offers'));
        return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    },
    addOffer: (offer) => addDoc(collection(db, 'offers'), offer),
    updateOffer: (id, updates) => updateDoc(doc(db, 'offers', id), updates),
    deleteOffer: (id) => deleteDoc(doc(db, 'offers', id)),
    getOfferById: async (id) => {
        const docRef = doc(db, 'offers', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { ...docSnap.data(), id: docSnap.id };
        } else {
            throw new Error("Offer not found");
        }
    },

    // Users / Customers
    getCustomers: async () => {
        // In a real app, you might use the Admin SDK for listing users, 
        // or query a 'users' collection if you sync auth users there.
        // For now, let's assume we have a 'users' collection.
        const querySnapshot = await getDocs(collection(db, 'users'));
        return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    },
    deleteCustomer: (id) => deleteDoc(doc(db, 'users', id)),

    // User Addresses
    getUserAddresses: async (userId) => {
        const querySnapshot = await getDocs(collection(db, 'users', userId, 'addresses'));
        return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    },
    addUserAddress: (userId, address) => addDoc(collection(db, 'users', userId, 'addresses'), {
        ...address,
        createdAt: new Date().toISOString()
    }),
    updateUserAddress: (userId, addressId, updates) => updateDoc(doc(db, 'users', userId, 'addresses', addressId), updates),
    deleteUserAddress: (userId, addressId) => deleteDoc(doc(db, 'users', userId, 'addresses', addressId)),

    // Orders
    getOrders: async (userId = null) => {
        let q;
        if (userId) {
            q = query(collection(db, 'orders'), where('userId', '==', userId));
        } else {
            q = collection(db, 'orders');
        }
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    },
    createOrder: async (order) => {
        const docRef = await addDoc(collection(db, 'orders'), {
            ...order,
            createdAt: new Date().toISOString(),
            status: order.status || 'Pending'
        });
        return docRef.id;
    },
    updateOrder: (id, updates) => updateDoc(doc(db, 'orders', id), updates),
    updateOrderStatus: (id, status) => updateDoc(doc(db, 'orders', id), { status }),
    getOrderById: async (id) => {
        const docRef = doc(db, 'orders', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { ...docSnap.data(), id: docSnap.id };
        } else {
            throw new Error("Order not found");
        }
    },

    // CMS
    getTickers: async () => {
        const querySnapshot = await getDocs(collection(db, 'tickers'));
        return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    },
    addTicker: (ticker) => addDoc(collection(db, 'tickers'), ticker),
    updateTicker: (id, updates) => updateDoc(doc(db, 'tickers', id), updates),
    deleteTicker: (id) => deleteDoc(doc(db, 'tickers', id)),

    getBanners: async () => {
        const querySnapshot = await getDocs(collection(db, 'banners'));
        return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    },
    addBanner: (banner) => addDoc(collection(db, 'banners'), banner),
    updateBanner: (id, updates) => updateDoc(doc(db, 'banners', id), updates),
    deleteBanner: (id) => deleteDoc(doc(db, 'banners', id)),

    getPages: async () => {
        const querySnapshot = await getDocs(collection(db, 'pages'));
        return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    },
    addPage: (page) => addDoc(collection(db, 'pages'), page),
    updatePage: (id, updates) => updateDoc(doc(db, 'pages', id), updates),
    deletePage: (id) => deleteDoc(doc(db, 'pages', id)),

    getFAQs: async () => {
        const querySnapshot = await getDocs(collection(db, 'faqs'));
        return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    },
    addFAQ: (faq) => addDoc(collection(db, 'faqs'), faq),
    updateFAQ: (id, updates) => updateDoc(doc(db, 'faqs', id), updates),
    deleteFAQ: (id) => deleteDoc(doc(db, 'faqs', id)),

    getAds: async () => {
        const querySnapshot = await getDocs(collection(db, 'ads'));
        return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    },
    addAd: (ad) => addDoc(collection(db, 'ads'), ad),
    updateAd: (id, updates) => updateDoc(doc(db, 'ads', id), updates),
    deleteAd: (id) => deleteDoc(doc(db, 'ads', id)),

    getTestimonials: async () => {
        const querySnapshot = await getDocs(collection(db, 'testimonials'));
        return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    },
    addTestimonial: (testimonial) => addDoc(collection(db, 'testimonials'), testimonial),
    updateTestimonial: (id, updates) => updateDoc(doc(db, 'testimonials', id), updates),
    deleteTestimonial: (id) => deleteDoc(doc(db, 'testimonials', id)),

    getFeaturedCollections: async () => {
        const querySnapshot = await getDocs(collection(db, 'featuredCollections'));
        return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    },
    addFeaturedCollection: (collectionData) => addDoc(collection(db, 'featuredCollections'), collectionData),
    updateFeaturedCollection: (id, updates) => updateDoc(doc(db, 'featuredCollections', id), updates),
    deleteFeaturedCollection: (id) => deleteDoc(doc(db, 'featuredCollections', id)),

    // Reviews
    getReviews: async (productId) => {
        const querySnapshot = await getDocs(collection(db, 'reviews'));
        const allReviews = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        return allReviews.filter(r => r.productId === productId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    addReview: (review) => addDoc(collection(db, 'reviews'), {
        ...review,
        createdAt: new Date().toISOString()
    }),
    updateProductRating: (productId, rating, reviewsCount) => updateDoc(doc(db, 'products', productId), {
        rating: rating,
        reviews: reviewsCount
    }),

    // Reports & Logs
    getProductRequests: async () => {
        const querySnapshot = await getDocs(collection(db, 'productRequests'));
        return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    },
    addProductRequest: (request) => addDoc(collection(db, 'productRequests'), {
        ...request,
        createdAt: new Date().toISOString(),
        status: 'Pending'
    }),

    getNewsletterSubscribers: async () => {
        const querySnapshot = await getDocs(collection(db, 'newsletterSubscribers'));
        return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    },
    addNewsletterSubscriber: (email) => addDoc(collection(db, 'newsletterSubscribers'), {
        email,
        subscribedAt: new Date().toISOString()
    }),

    getAuditLogs: async () => {
        const querySnapshot = await getDocs(collection(db, 'auditLogs'));
        return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },
    logAuditAction: async (action, details) => {
        const user = auth.currentUser;
        if (!user) return;
        try {
            await addDoc(collection(db, 'auditLogs'), {
                action,
                details,
                userEmail: user.email,
                userId: user.uid,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error("Failed to log audit action", error);
        }
    },

    // Storage
    uploadImage: async (file, folder = 'uploads') => {
        const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
        const metadata = { contentType: file.type };
        await uploadBytes(storageRef, file, metadata);
        return getDownloadURL(storageRef);
    },
    uploadFile: async (file, folder = 'files') => {
        const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
    }
};

export default FirebaseService;
