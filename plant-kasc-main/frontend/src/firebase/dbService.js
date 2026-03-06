// Firebase Firestore Database Service - All CRUD Operations
import {
    collection,
    doc,
    addDoc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    serverTimestamp,
    onSnapshot,
    increment,
    arrayUnion,
    arrayRemove,
    writeBatch
} from 'firebase/firestore';
import { db } from './config';
import { auth } from './config';
import { getDiseaseByClass } from '../data/diseaseDatabase';

// ==========================================
// PREDICTIONS / DISEASE SCANS
// ==========================================

// 1. Add a New Prediction
export const addPrediction = async (predictionData) => {
    try {
        const user = auth.currentUser;
        if (!user) return { success: false, message: 'Not authenticated' };

        const docRef = await addDoc(collection(db, 'predictions'), {
            userId: user.uid,
            userName: user.displayName || 'Unknown',
            plantType: predictionData.plantType,
            predictedDisease: predictionData.predictedDisease,
            confidence: predictionData.confidence,
            severity: predictionData.severity || 'unknown',
            imageUrl: predictionData.imageUrl && !predictionData.imageUrl.startsWith('blob:') ? predictionData.imageUrl : null,
            description: predictionData.description || '',
            treatment: predictionData.treatment || '',
            prevention: predictionData.prevention || '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        return { success: true, id: docRef.id };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// 2. Get All Predictions for Current User
export const getUserPredictions = async (pageSize = 50) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.error('getUserPredictions: Not authenticated');
            return { success: false, message: 'Not authenticated' };
        }

        console.log('Fetching predictions for user:', user.uid);

        const q = query(
            collection(db, 'predictions'),
            where('userId', '==', user.uid)
        );

        const snapshot = await getDocs(q);
        console.log('Found predictions:', snapshot.size);

        const predictions = snapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));

        // Sort by createdAt descending (client-side to avoid index requirement)
        predictions.sort((a, b) => {
            const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
            const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
            return timeB - timeA;
        });

        return { success: true, data: predictions.slice(0, pageSize) };
    } catch (error) {
        console.error('getUserPredictions error:', error);
        return { success: false, message: error.message };
    }
};

// 3. Get Single Prediction by ID
export const getPredictionById = async (predictionId) => {
    try {
        const docSnap = await getDoc(doc(db, 'predictions', predictionId));

        if (docSnap.exists()) {
            return { success: true, data: { _id: docSnap.id, ...docSnap.data() } };
        }
        return { success: false, message: 'Prediction not found' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// 4. Update a Prediction
export const updatePrediction = async (predictionId, updates) => {
    try {
        await updateDoc(doc(db, 'predictions', predictionId), {
            ...updates,
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// 5. Delete a Prediction
export const deletePrediction = async (predictionId) => {
    try {
        await deleteDoc(doc(db, 'predictions', predictionId));
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// 6. Get Prediction Stats for Dashboard
export const getPredictionStats = async () => {
    try {
        const user = auth.currentUser;
        if (!user) return { success: false, message: 'Not authenticated' };

        const q = query(
            collection(db, 'predictions'),
            where('userId', '==', user.uid)
        );

        const snapshot = await getDocs(q);
        const predictions = snapshot.docs.map(doc => doc.data());

        // Calculate stats
        const total = predictions.length;
        const diseaseMap = {};
        let totalConfidence = 0;

        predictions.forEach(p => {
            const disease = p.predictedDisease || 'Unknown';
            if (!diseaseMap[disease]) {
                diseaseMap[disease] = { count: 0, totalConfidence: 0 };
            }
            diseaseMap[disease].count++;
            diseaseMap[disease].totalConfidence += p.confidence || 0;
            totalConfidence += p.confidence || 0;
        });

        const byDisease = Object.entries(diseaseMap).map(([disease, data]) => ({
            disease,
            count: data.count,
            avgConfidence: data.totalConfidence / data.count
        }));

        return {
            success: true,
            data: {
                total,
                avgConfidence: total > 0 ? totalConfidence / total : 0,
                byDisease
            }
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// 7. Real-time Listener for Predictions
export const onPredictionsChange = (callback) => {
    const user = auth.currentUser;
    if (!user) return () => { };

    const q = query(
        collection(db, 'predictions'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(20)
    );

    return onSnapshot(q, (snapshot) => {
        const predictions = snapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));
        callback(predictions);
    });
};

// ==========================================
// DISEASE SEARCH / INFO
// ==========================================

// 8. Search Disease by Class Name (uses local DB first, then Firestore fallback)
export const searchDisease = async (diseaseClass) => {
    try {
        // First check local comprehensive database
        const localData = getDiseaseByClass(diseaseClass);
        if (localData) {
            return { success: true, data: localData };
        }

        // Fallback to Firestore if not found locally
        const q = query(
            collection(db, 'diseases'),
            where('class', '==', diseaseClass)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const diseaseDoc = snapshot.docs[0];
            return { success: true, data: { _id: diseaseDoc.id, ...diseaseDoc.data() } };
        }

        // Final fallback - generic info
        return {
            success: true,
            data: {
                class: diseaseClass,
                plant: diseaseClass.split('___')[0]?.replace(/_/g, ' ') || 'Unknown',
                disease: diseaseClass.split('___')[1]?.replace(/_/g, ' ') || diseaseClass,
                description: 'Detailed information for this disease is not yet available.',
                symptoms: ['Consult a plant pathologist for accurate diagnosis'],
                causes: ['Multiple environmental and pathogenic factors may contribute'],
                remedies: ['Consult a local agricultural extension for treatment recommendations'],
                prevention: ['Follow standard plant health and sanitation practices'],
                severity: 'medium'
            }
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// 9. Add Disease Info (Admin only)
export const addDiseaseInfo = async (diseaseData) => {
    try {
        const docRef = await addDoc(collection(db, 'diseases'), {
            ...diseaseData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ==========================================
// USER MANAGEMENT (Admin)
// ==========================================

// 10. Get All Users (Admin)
export const getAllUsers = async () => {
    try {
        const snapshot = await getDocs(collection(db, 'users'));
        const users = snapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));
        return { success: true, data: users };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// 11. Update User Role (Admin)
export const updateUserRole = async (userId, role) => {
    try {
        await updateDoc(doc(db, 'users', userId), {
            role: role,
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// 12. Get All Predictions (Admin - all users)
export const getAllPredictions = async (pageSize = 50) => {
    try {
        const q = query(
            collection(db, 'predictions'),
            orderBy('createdAt', 'desc'),
            limit(pageSize)
        );

        const snapshot = await getDocs(q);
        const predictions = snapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));
        return { success: true, data: predictions };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ==========================================
// BATCH OPERATIONS
// ==========================================

// 13. Delete Multiple Predictions
export const batchDeletePredictions = async (predictionIds) => {
    try {
        const batch = writeBatch(db);
        predictionIds.forEach(id => {
            batch.delete(doc(db, 'predictions', id));
        });
        await batch.commit();
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ==========================================
// GENERIC HELPERS
// ==========================================

// 14. Add Document to any Collection
export const addDocument = async (collectionName, data) => {
    try {
        const docRef = await addDoc(collection(db, collectionName), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// 15. Get Document by ID from any Collection
export const getDocument = async (collectionName, docId) => {
    try {
        const docSnap = await getDoc(doc(db, collectionName, docId));
        if (docSnap.exists()) {
            return { success: true, data: { _id: docSnap.id, ...docSnap.data() } };
        }
        return { success: false, message: 'Document not found' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// 16. Update Document in any Collection
export const updateDocument = async (collectionName, docId, updates) => {
    try {
        await updateDoc(doc(db, collectionName, docId), {
            ...updates,
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// 17. Delete Document from any Collection
export const deleteDocument = async (collectionName, docId) => {
    try {
        await deleteDoc(doc(db, collectionName, docId));
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// 18. Get All Documents from any Collection
export const getCollection = async (collectionName, constraints = []) => {
    try {
        let q;
        if (constraints.length > 0) {
            q = query(collection(db, collectionName), ...constraints);
        } else {
            q = collection(db, collectionName);
        }

        const snapshot = await getDocs(q);
        const documents = snapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));
        return { success: true, data: documents };
    } catch (error) {
        return { success: false, message: error.message };
    }
};
