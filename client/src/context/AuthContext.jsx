import React, { createContext, useState, useEffect, useContext } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updatePassword,
    sendPasswordResetEmail,
    EmailAuthProvider,
    reauthenticateWithCredential,
    signInWithPopup,
    reauthenticateWithPopup
} from 'firebase/auth';
import { auth, db, googleProvider } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const register = async (email, password, name, phone) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "settings", user.uid), {
            businessName: name,
            address: '',
            phone: phone,
            email: email,
            gstNumber: '',
            fssai: '',
            upiId: '',
            merchantName: '',
            transactionName: '',
            taxEnabled: false,
            taxName: 'GST',
            taxPercent: '0',
            thermalPrint: true
        });

        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length === 10) {
            await setDoc(doc(db, "phoneToEmail", cleanPhone), {
                email: email
            });
        }

        return user;
    };

    const login = async (identifier, password) => {
        let email = identifier;

        const cleanPhone = identifier.replace(/\D/g, '');
        if (cleanPhone.length === 10 && !identifier.includes('@')) {
            const phoneDoc = await getDoc(doc(db, "phoneToEmail", cleanPhone));
            if (phoneDoc.exists()) {
                email = phoneDoc.data().email;
            } else {
                throw new Error('No account found with this phone number');
            }
        }

        if (!email.includes('@')) {
            throw new Error('Please enter a valid email address');
        }

        return signInWithEmailAndPassword(auth, email, password);
    };

    const loginWithGoogle = async () => {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const docRef = doc(db, "settings", user.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            const fallbackName = user.email ? user.email.split('@')[0] : 'Merchant';
            const displayName = user.displayName || fallbackName;

            await setDoc(docRef, {
                businessName: displayName,
                address: '',
                phone: '',
                email: user.email,
                gstNumber: '',
                fssai: '',
                upiId: '',
                merchantName: '',
                transactionName: '',
                taxEnabled: false,
                taxName: 'GST',
                taxPercent: '0',
                thermalPrint: true
            });
        }
        return user;
    };

    const logout = () => {
        return signOut(auth);
    };

    const reauthenticate = (currentPassword) => {
        const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
        return reauthenticateWithCredential(currentUser, credential);
    };

    const reauthenticateWithGoogle = () => {
        return reauthenticateWithPopup(currentUser, googleProvider);
    };

    const changePassword = (newPassword) => {
        return updatePassword(currentUser, newPassword);
    };

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        register,
        login,
        loginWithGoogle,
        logout,
        reauthenticate,
        reauthenticateWithGoogle,
        changePassword,
        resetPassword
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem', background: 'var(--bg-main)', color: 'var(--text-main)' }}>
                    <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading... Please wait it may take some while</p>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};
