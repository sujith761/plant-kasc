// Firebase Storage Service - File Upload & Management
import {
    ref,
    uploadBytes,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
    listAll
} from 'firebase/storage';
import { storage, auth } from './config';

// ==========================================
// 1. Upload Plant Image
// ==========================================
export const uploadPlantImage = async (file) => {
    try {
        const user = auth.currentUser;
        if (!user) return { success: false, message: 'Not authenticated' };

        const fileName = `${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `plant-images/${user.uid}/${fileName}`);

        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        return { success: true, url: downloadURL, path: snapshot.ref.fullPath };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ==========================================
// 2. Upload with Progress Tracking
// ==========================================
export const uploadWithProgress = (file, path, onProgress) => {
    return new Promise((resolve, reject) => {
        const user = auth.currentUser;
        if (!user) {
            reject({ success: false, message: 'Not authenticated' });
            return;
        }

        const fileName = `${Date.now()}_${file.name}`;
        const storagePath = path || `plant-images/${user.uid}/${fileName}`;
        const storageRef = ref(storage, storagePath);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (onProgress) onProgress(progress);
            },
            (error) => {
                reject({ success: false, message: error.message });
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve({ success: true, url: downloadURL, path: storagePath });
            }
        );
    });
};

// ==========================================
// 3. Upload Profile Photo
// ==========================================
export const uploadProfilePhoto = async (file) => {
    try {
        const user = auth.currentUser;
        if (!user) return { success: false, message: 'Not authenticated' };

        const storageRef = ref(storage, `profile-photos/${user.uid}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        return { success: true, url: downloadURL };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ==========================================
// 4. Delete File from Storage
// ==========================================
export const deleteFile = async (filePath) => {
    try {
        const storageRef = ref(storage, filePath);
        await deleteObject(storageRef);
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ==========================================
// 5. Get Download URL for a File
// ==========================================
export const getFileURL = async (filePath) => {
    try {
        const storageRef = ref(storage, filePath);
        const url = await getDownloadURL(storageRef);
        return { success: true, url };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ==========================================
// 6. List All User Uploads
// ==========================================
export const listUserUploads = async () => {
    try {
        const user = auth.currentUser;
        if (!user) return { success: false, message: 'Not authenticated' };

        const listRef = ref(storage, `plant-images/${user.uid}`);
        const result = await listAll(listRef);

        const files = await Promise.all(
            result.items.map(async (itemRef) => {
                const url = await getDownloadURL(itemRef);
                return {
                    name: itemRef.name,
                    path: itemRef.fullPath,
                    url
                };
            })
        );

        return { success: true, data: files };
    } catch (error) {
        return { success: false, message: error.message };
    }
};
