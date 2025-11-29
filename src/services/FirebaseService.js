import { db, auth, storage } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
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
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    addProduct: (product) => addDoc(collection(db, 'products'), product),
    updateProduct: (id, updates) => updateDoc(doc(db, 'products', id), updates),
    deleteProduct: (id) => deleteDoc(doc(db, 'products', id)),

    // Orders
    getOrders: async () => {
        const querySnapshot = await getDocs(collection(db, 'orders'));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Storage
    uploadImage: async (file, path) => {
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
    }
};

export default FirebaseService;
