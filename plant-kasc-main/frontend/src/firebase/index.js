// Firebase Services - Central Export
// Import everything from one place: import { loginWithEmail, addPrediction, ... } from '../firebase';

// Config
export { auth, db, rtdb, storage, analytics, googleProvider } from './config';
export { default as app } from './config';

// Auth Service
export {
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logoutUser,
    resetPassword,
    sendVerification,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
    deleteAccount,
    getUserData,
    onAuthChange
} from './authService';

// Firestore Database Service
export {
    addPrediction,
    getUserPredictions,
    getPredictionById,
    updatePrediction,
    deletePrediction,
    getPredictionStats,
    onPredictionsChange,
    searchDisease,
    addDiseaseInfo,
    getAllUsers,
    updateUserRole,
    getAllPredictions,
    batchDeletePredictions,
    addDocument,
    getDocument,
    updateDocument,
    deleteDocument,
    getCollection
} from './dbService';

// Storage Service
export {
    uploadPlantImage,
    uploadWithProgress,
    uploadProfilePhoto,
    deleteFile,
    getFileURL,
    listUserUploads
} from './storageService';

// Realtime Database Service
export {
    saveToRealtimeDB,
    pushToRealtimeDB,
    readFromRealtimeDB,
    updateInRealtimeDB,
    deleteFromRealtimeDB,
    listenToRealtimeDB,
    setUserOnlineStatus,
    getRecentActivity
} from './realtimeService';
