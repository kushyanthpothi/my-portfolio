'use client';

import { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import Hero from "./(home)/Hero";
import Services from "./(home)/Services";
import About from "./(home)/About";
import Footer from "../components/Footer";
import FloatingProfile from "../components/FloatingProfile";
import Projects from "./(home)/Projects";
import ContactSection from "../components/ContactSection";
import ThemeSwitch from "../components/ThemeSwitch";
import { logVisit } from '@/lib/firestoreUtils';

export default function Home() {
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  // Track visitor on page load
  useEffect(() => {
    logVisit();
  }, []);

  // Handle hash navigation (e.g., /#contact-form)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#contact-form') {
      // Wait for content to load, then scroll
      const timer = setTimeout(() => {
        const contactSection = document.getElementById('contact-form');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 1000); // Wait for profile animation and content to load

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <main>
      <FloatingProfile onAnimationComplete={() => setIsProfileLoaded(true)} />

      {/* Only show other content after profile animation is done */}
      <div style={{ opacity: isProfileLoaded ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}>

        <Navbar />
        <Hero startAnimation={isProfileLoaded} />
        <Services />
        <About />
        <Projects />
        <ContactSection />
        <Footer />
      </div>

      {/* Unified Theme Switch */}
      <ThemeSwitch />
    </main>
  );
}
