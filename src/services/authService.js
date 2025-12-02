import {
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    updateProfile
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        const userData = {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            uid: user.uid,
            emailVerified: user.emailVerified,
            role: 'customer', // Default role
            lastLogin: new Date().toISOString()
        };

        // Check if user exists, if not create, if yes update lastLogin
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, { ...userData, createdAt: new Date().toISOString() });
        } else {
            await setDoc(userRef, { lastLogin: new Date().toISOString() }, { merge: true });
        }

        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
    } catch (error) {
        console.error("Error signing in with Google", error);
        throw error;
    }
};

export const registerWithEmailAndPassword = async (name, email, password) => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;

        // Update profile with name
        await updateProfile(user, { displayName: name });

        // Save user to Firestore
        const userData = {
            name: name,
            email: user.email,
            uid: user.uid,
            emailVerified: false,
            role: 'customer',
            createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, "users", user.uid), userData);

        // Send verification email with redirect to login
        const actionCodeSettings = {
            url: window.location.origin + '/login',
            handleCodeInApp: true
        };
        await sendEmailVerification(user, actionCodeSettings);

        return userData;
    } catch (error) {
        console.error("Error registering", error);
        throw error;
    }
};

export const loginWithEmailAndPassword = async (email, password) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;

        if (!user.emailVerified) {
            throw new Error("Please verify your email address before logging in.");
        }

        const userData = {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            uid: user.uid,
            emailVerified: user.emailVerified
        };

        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
    } catch (error) {
        console.error("Error logging in", error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem('user');
    } catch (error) {
        console.error("Error signing out", error);
        throw error;
    }
};

export const resendVerificationEmail = async () => {
    if (auth.currentUser && !auth.currentUser.emailVerified) {
        try {
            console.log("Attempting to resend verification email to:", auth.currentUser.email);
            const actionCodeSettings = {
                url: window.location.origin + '/login',
                handleCodeInApp: true
            };
            await sendEmailVerification(auth.currentUser, actionCodeSettings);
            console.log("Verification email sent successfully.");
        } catch (error) {
            console.error("Error in resendVerificationEmail:", error);
            throw error;
        }
    } else {
        console.log("User not signed in or already verified.");
    }
};
