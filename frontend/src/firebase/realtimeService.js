// Firebase Realtime Database Service
import {
    ref,
    set,
    get,
    update,
    remove,
    push,
    onValue,
    off,
    query,
    orderByChild,
    limitToLast,
    equalTo
} from 'firebase/database';
import { rtdb, auth } from './config';

// ==========================================
// 1. Save Data to Realtime DB
// ==========================================
export const saveToRealtimeDB = async (path, data) => {
    try {
        const dbRef = ref(rtdb, path);
        await set(dbRef, {
            ...data,
            timestamp: Date.now()
        });
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ==========================================
// 2. Push Data (auto-generate ID)
// ==========================================
export const pushToRealtimeDB = async (path, data) => {
    try {
        const dbRef = ref(rtdb, path);
        const newRef = push(dbRef);
        await set(newRef, {
            ...data,
            timestamp: Date.now()
        });
        return { success: true, id: newRef.key };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ==========================================
// 3. Read Data from Realtime DB
// ==========================================
export const readFromRealtimeDB = async (path) => {
    try {
        const dbRef = ref(rtdb, path);
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
            return { success: true, data: snapshot.val() };
        }
        return { success: false, message: 'No data found' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ==========================================
// 4. Update Data in Realtime DB
// ==========================================
export const updateInRealtimeDB = async (path, updates) => {
    try {
        const dbRef = ref(rtdb, path);
        await update(dbRef, {
            ...updates,
            updatedAt: Date.now()
        });
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ==========================================
// 5. Delete Data from Realtime DB
// ==========================================
export const deleteFromRealtimeDB = async (path) => {
    try {
        const dbRef = ref(rtdb, path);
        await remove(dbRef);
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ==========================================
// 6. Real-time Listener
// ==========================================
export const listenToRealtimeDB = (path, callback) => {
    const dbRef = ref(rtdb, path);
    onValue(dbRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.val());
        } else {
            callback(null);
        }
    });

    // Return unsubscribe function
    return () => off(dbRef);
};

// ==========================================
// 7. Save User Online Status
// ==========================================
export const setUserOnlineStatus = async (isOnline) => {
    try {
        const user = auth.currentUser;
        if (!user) return;

        const userStatusRef = ref(rtdb, `status/${user.uid}`);
        await set(userStatusRef, {
            online: isOnline,
            lastSeen: Date.now(),
            displayName: user.displayName || 'Anonymous'
        });
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ==========================================
// 8. Get Recent Activity (last N items)
// ==========================================
export const getRecentActivity = async (path, count = 10) => {
    try {
        const dbRef = ref(rtdb, path);
        const q = query(dbRef, orderByChild('timestamp'), limitToLast(count));
        const snapshot = await get(q);

        if (snapshot.exists()) {
            const data = [];
            snapshot.forEach(child => {
                data.push({ id: child.key, ...child.val() });
            });
            return { success: true, data: data.reverse() };
        }
        return { success: true, data: [] };
    } catch (error) {
        return { success: false, message: error.message };
    }
};
