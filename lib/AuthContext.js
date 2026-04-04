'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const loginTimeRef = useRef(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                // Set memory login time on initial load if user exists
                if (!loginTimeRef.current) {
                    loginTimeRef.current = Date.now();
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        // Check session timeout
        const checkSessionTimeout = () => {
            if (loginTimeRef.current) {
                const now = Date.now();
                const eightHours = 8 * 60 * 60 * 1000;

                if (now - loginTimeRef.current > eightHours) {
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
        loginTimeRef.current = Date.now();
        return result;
    };

    const logout = async () => {
        setUser(null);
        loginTimeRef.current = null;
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};
