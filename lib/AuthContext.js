'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user ? user : null);
            setLoading(false);
        });

        // Check session timeout
        const checkSessionTimeout = () => {
            const loginTime = localStorage.getItem('loginTime');
            if (loginTime) {
                const now = Date.now();
                const eightHours = 8 * 60 * 60 * 1000;

                if (now - parseInt(loginTime) > eightHours) {
                    logout();
                    alert('Session expired. Please login again.');
                }
            }
        };

        // Check initially and then every minute
        checkSessionTimeout();
        const interval = setInterval(checkSessionTimeout, 60000);

        return () => {
            unsubscribe();
            clearInterval(interval);
        };
    }, []);

    const login = async (email, password) => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem('loginTime', Date.now().toString());
        return result;
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('loginTime');
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};
