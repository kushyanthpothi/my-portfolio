'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MouseBubble from '@/components/MouseBubble';
import ErrorPage from '@/components/ErrorPage';
import ThemeSwitch from '@/components/ThemeSwitch';

export default function NotFound() {
    return (
        <>
            <MouseBubble />
            <Navbar />
            <ErrorPage />
            <Footer />
            <ThemeSwitch style={{ left: 'calc(56% - 100px)' }} />
        </>
    );
}
