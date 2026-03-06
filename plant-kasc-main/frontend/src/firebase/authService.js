// Firebase Authentication Service - All Auth Functions
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    updateEmail,
    updatePassword,
    deleteUser,
    onAuthStateChanged,
    reauthenticateWithCredential,
    EmailAuthProvider,
    sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from './config';

// ==========================================
// 1. REGISTER with Email & Password
// ==========================================
export const registerWithEmail = async (name, email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update display name
        await updateProfile(user, { displayName: name });

        // Check if this is the first user - make them admin
        let role = 'user';
        try {
            const { getDocs, collection } = await import('firebase/firestore');
            const usersSnapshot = await getDocs(collection(db, 'users'));
            if (usersSnapshot.empty) {
                role = 'admin';
                console.log('First user registered - setting as admin');
            }
        } catch (e) {
            console.log('Could not check user count, defaulting to user role');
        }

        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            name: name,
            email: email,
            role: role,
            photoURL: null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        return { success: true, user };
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, message: getErrorMessage(error.code) };
    }
};

// ==========================================
// 2. LOGIN with Email & Password
// ==========================================
export const loginWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update last login time
        await updateDoc(doc(db, 'users', user.uid), {
            lastLoginAt: serverTimestamp()
        });

        return { success: true, user };
    } catch (error) {
        return { success: false, message: getErrorMessage(error.code) };
    }
};

// ==========================================
// 3. LOGIN with Google (Popup)
// ==========================================
export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Check if user document exists
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (!userDoc.exists()) {
            // Create user document for new Google users
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                role: 'user',
                photoURL: user.photoURL,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        } else {
            await updateDoc(doc(db, 'users', user.uid), {
                lastLoginAt: serverTimestamp()
            });
        }

        return { success: true, user };
    } catch (error) {
        return { success: false, message: getErrorMessage(error.code) };
    }
};

// ==========================================
// 4. LOGOUT
// ==========================================
export const logoutUser = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ==========================================
// 5. SEND Password Reset Email
// ==========================================
export const resetPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, message: 'Password reset email sent!' };
    } catch (error) {
        return { success: false, message: getErrorMessage(error.code) };
    }
};

// ==========================================
// 6. SEND Email Verification
// ==========================================
export const sendVerification = async () => {
    try {
        const user = auth.currentUser;
        if (user) {
            await sendEmailVerification(user);
            return { success: true, message: 'Verification email sent!' };
        }
        return { success: false, message: 'No user logged in' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ==========================================
// 7. UPDATE User Profile (name, photo)
// ==========================================
export const updateUserProfile = async (displayName, photoURL) => {
    try {
        const user = auth.currentUser;
        if (!user) return { success: false, message: 'No user logged in' };

        const updates = {};
        if (displayName) updates.displayName = displayName;
        if (photoURL) updates.photoURL = photoURL;

        await updateProfile(user, updates);

        // Also update Firestore
        const firestoreUpdates = { updatedAt: serverTimestamp() };
        if (displayName) firestoreUpdates.name = displayName;
        if (photoURL) firestoreUpdates.photoURL = photoURL;
        await updateDoc(doc(db, 'users', user.uid), firestoreUpdates);

        return { success: true, user: auth.currentUser };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ==========================================
// 8. UPDATE Email
// ==========================================
export const updateUserEmail = async (newEmail) => {
    try {
        const user = auth.currentUser;
        if (!user) return { success: false, message: 'No user logged in' };

        await updateEmail(user, newEmail);
        await updateDoc(doc(db, 'users', user.uid), {
            email: newEmail,
            updatedAt: serverTimestamp()
        });

        return { success: true };
    } catch (error) {
        return { success: false, message: getErrorMessage(error.code) };
    }
};

// ==========================================
// 9. UPDATE Password
// ==========================================
export const updateUserPassword = async (currentPassword, newPassword) => {
    try {
        const user = auth.currentUser;
        if (!user) return { success: false, message: 'No user logged in' };

        // Re-authenticate first
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);

        await updatePassword(user, newPassword);
        return { success: true, message: 'Password updated successfully!' };
    } catch (error) {
        return { success: false, message: getErrorMessage(error.code) };
    }
};

// ==========================================
// 10. DELETE Account
// ==========================================
export const deleteAccount = async (password) => {
    try {
        const user = auth.currentUser;
        if (!user) return { success: false, message: 'No user logged in' };

        // Re-authenticate before deleting
        if (password) {
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);
        }

        // Delete Firestore document
        const { deleteDoc } = await import('firebase/firestore');
        await deleteDoc(doc(db, 'users', user.uid));

        // Delete the user
        await deleteUser(user);
        return { success: true };
    } catch (error) {
        return { success: false, message: getErrorMessage(error.code) };
    }
};

// ==========================================
// 11. GET Current User Data from Firestore
// ==========================================
export const getUserData = async (uid) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
            return { success: true, data: userDoc.data() };
        }
        return { success: false, message: 'User not found' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ==========================================
// 12. AUTH STATE LISTENER
// ==========================================
export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};

// ==========================================
// Helper: Error Message Parser
// ==========================================
const getErrorMessage = (errorCode) => {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'This email is already registered.';
        case 'auth/invalid-email':
            return 'Invalid email address.';
        case 'auth/operation-not-allowed':
            return 'This sign-in method is not enabled.';
        case 'auth/weak-password':
            return 'Password must be at least 6 characters.';
        case 'auth/user-disabled':
            return 'This account has been disabled.';
        case 'auth/user-not-found':
            return 'No account found with this email.';
        case 'auth/wrong-password':
            return 'Incorrect password.';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please try again later.';
        case 'auth/popup-closed-by-user':
            return 'Google sign-in was cancelled.';
        case 'auth/requires-recent-login':
            return 'Please log in again to perform this action.';
        case 'auth/invalid-credential':
            return 'Invalid email or password.';
        case 'auth/configuration-not-found':
            return 'Authentication service is not configured. Please enable Email/Password provider in Firebase Console.';
        default:
            return 'An unexpected error occurred. Please try again.';
    }
};
