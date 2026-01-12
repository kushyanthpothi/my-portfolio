'use client';

import { AuthProvider } from '@/lib/AuthContext';

export default function AdminLayout({ children }) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}
