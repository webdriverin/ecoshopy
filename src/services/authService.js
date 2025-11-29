import {
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    updateProfile
} from "firebase/auth";
import { auth } from "../firebase";

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
            emailVerified: user.emailVerified
        };

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

        // Send verification email with redirect to login
        const actionCodeSettings = {
            url: window.location.origin + '/login',
            handleCodeInApp: true
        };
        await sendEmailVerification(user, actionCodeSettings);

        const userData = {
            name: name,
            email: user.email,
            uid: user.uid,
            emailVerified: false
        };

        // Don't store in localStorage yet if we want to force verification first
        // But for now, let's store it so they can see the "Verify Email" screen if we build one
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
        const actionCodeSettings = {
            url: window.location.origin + '/login',
            handleCodeInApp: true
        };
        await sendEmailVerification(auth.currentUser, actionCodeSettings);
    }
};
