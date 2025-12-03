'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';

// Components
import Footer from '../components/Footer';
import ThemeDrawer from '../components/ThemeDrawer';
import Fireworks from '../components/Fireworks';
import ExperienceSection from '../components/ExperienceSection';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ProjectsSection from '../components/ProjectsSection';
import CertificationsSection from '../components/CertificationsSection';
import ContactSection from '../components/ContactSection';

// Custom Hooks
import { useTypingAnimation, useScrollSpy, useTheme } from '../hooks';

// Constants
import { NAV_ITEMS } from '../constants/navigation';

// Utils
import { themeClass as utilThemeClass } from '../utils/theme';
import { scrollToSection as scrollToSectionUtil } from '../utils/scrollUtils';
import { saveScrollPosition, restoreScrollPosition } from '../utils/scrollRestore';

const MotionDiv = motion.div;

export default function Home() {
  // UI State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClickAnimating, setIsClickAnimating] = useState(false);
  const [showThemeDrawer, setShowThemeDrawer] = useState(false);

  // Custom Hooks
  const {
    helloText,
    nameText,
    roleText,
    currentRole,
    showCursor,
    isTypingHello,
    isTypingName,
    isTypingRole,
    showRole,
    showSocialIcons,
    showButtons,
    showProfilePhoto,
    showNavbar,
    skipAnimations,
  } = useTypingAnimation();

  const { activeSection, scrolled } = useScrollSpy(NAV_ITEMS);

  const {
    currentTheme,
    isDarkMode,
    themeMode,
    currentBackground,
    changeTheme,
    changeThemeMode,
    changeBackground,
  } = useTheme();

  // Disable scroll during initial animations
  useEffect(() => {
    // Check if coming from project page
    const scrollToSection = sessionStorage.getItem('scrollToSection');
    const skipAnimations = sessionStorage.getItem('skipAnimations');

    if (!showProfilePhoto && skipAnimations !== 'true') {
      // Disable scroll during animations
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      // Scroll to hero section on initial load
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    } else {
      // Re-enable scroll
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';

      // If coming from project page, scroll to specified section
      if (scrollToSection) {
        sessionStorage.removeItem('scrollToSection');
        setTimeout(() => {
          const element = document.getElementById(scrollToSection);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      } else {
        // After animations complete, restore previous scroll position if it exists
        const savedScrollPosition = sessionStorage.getItem('scrollPosition');
        if (savedScrollPosition) {
          const scrollY = parseInt(savedScrollPosition, 10);
          setTimeout(() => {
            window.scrollTo({
              top: scrollY,
              behavior: 'smooth'
            });
            // Remove the saved position after restoring
            sessionStorage.removeItem('scrollPosition');
          }, 500); // Small delay to ensure smooth transition
        }
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [showProfilePhoto]);

  // Memoized theme class function
  const themeClass = useCallback((type) => utilThemeClass(type, currentTheme), [currentTheme]);

  // Scroll to section handler
  const scrollToSection = useCallback((sectionId) => {
    scrollToSectionUtil(sectionId, () => setIsMenuOpen(false));
  }, []);

  // Scroll to contact handler
  const scrollToContact = useCallback(() => {
    scrollToSection('contact');
  }, [scrollToSection]);

  // Profile photo click animation
  const triggerClickAnimation = useCallback(() => {
    setIsClickAnimating(true);
    setTimeout(() => setIsClickAnimating(false), 2000);
  }, []);

  return (
    <>
      <Head>
        <title>Kushyanth Pothineni - Full Stack Developer</title>
        <meta name="description" content="Portfolio of Kushyanth Pothineni, a Full Stack Developer specializing in React, Next.js, Django, and Spring Boot" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
        {/* Theme Drawer */}
        <ThemeDrawer
          isOpen={showThemeDrawer}
          onClose={() => setShowThemeDrawer(false)}
          currentTheme={currentTheme}
          onThemeChange={changeTheme}
          isDarkMode={isDarkMode}
          themeMode={themeMode}
          onThemeModeChange={changeThemeMode}
          currentBackground={currentBackground}
          onBackgroundChange={changeBackground}
        />

        {/* Navbar */}
        {showNavbar && (
          <MotionDiv
            initial={{ y: -120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 1.5,
              ease: [0.16, 1, 0.3, 1],
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
          >
            <nav className={`fixed w-full z-[100] transition-all duration-300 ${scrolled && activeSection !== 'home' ? 'bg-white/30 dark:bg-black/30 backdrop-blur-md' : 'bg-transparent'}`}>
              <div className="w-full px-4 sm:px-10 lg:px-12">
                <div className="flex justify-between items-center h-20">
                  {/* Animated Logo */}
                  <div className="flex items-center overflow-hidden">
                    <MotionDiv
                      className="overflow-hidden flex items-center"
                      initial={false}
                      animate={{ width: 'auto' }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <div className="flex items-center whitespace-nowrap">
                        <span className={`text-xl font-bold tracking-tight ${themeClass('text')}`}>K</span>
                        <MotionDiv
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: scrolled ? 'auto' : 0, opacity: scrolled ? 1 : 0 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <span className={`text-xl font-bold tracking-tight ${themeClass('text')}`}>ushyanth</span>
                        </MotionDiv>
                        <span className={`text-xl font-bold tracking-tight ${themeClass('text')} ml-1`}>P</span>
                        <MotionDiv
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: scrolled ? 'auto' : 0, opacity: scrolled ? 1 : 0 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <span className={`text-xl font-bold tracking-tight ${themeClass('text')}`}>othineni</span>
                        </MotionDiv>
                      </div>
                    </MotionDiv>
                  </div>

                  <div className="flex items-center space-x-6">
                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex space-x-8 bg-black/10 dark:bg-black/10 bg-opacity-10 backdrop-blur-sm rounded-3xl p-2">
                      {NAV_ITEMS.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => scrollToSection(item.section)}
                          className="relative text-sm font-medium tracking-wider rounded-3xl px-3 py-2 transition-colors cursor-pointer"
                        >
                          {activeSection === item.section && (
                            <MotionDiv
                              layoutId="activeSection"
                              className="absolute inset-0 bg-white dark:bg-white rounded-3xl"
                              transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                          )}
                          <span className={`relative z-10 ${activeSection === item.section
                            ? 'text-gray-900 dark:text-gray-900'
                            : themeClass('text')
                            }`}>
                            {item.name}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Theme Toggle Button - Desktop */}
                    <button
                      onClick={() => setShowThemeDrawer(true)}
                      className={`hidden lg:block p-2 rounded-lg ${themeClass('bg')} bg-opacity-10 hover:bg-opacity-20 transition-all duration-300`}
                      aria-label="Open theme settings"
                    >
                      <svg
                        className={`w-5 h-5 ${themeClass('text')}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                        />
                      </svg>
                    </button>

                    {/* Theme Toggle Button - Mobile */}
                    <button
                      onClick={() => setShowThemeDrawer(true)}
                      className={`lg:hidden p-2 rounded-lg ${themeClass('bg')} bg-opacity-10 hover:bg-opacity-20 transition-all duration-300`}
                      aria-label="Open theme settings"
                    >
                      <svg
                        className={`w-5 h-5 ${themeClass('text')}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                        />
                      </svg>
                    </button>

                    {/* Mobile menu button */}
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      aria-label="Toggle menu"
                    >
                      <svg
                        className={`h-6 w-6 ${themeClass('text')}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        {isMenuOpen ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                          />
                        )}
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile menu */}
              {isMenuOpen && (
                <MotionDiv
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="lg:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="px-2 pt-2 pb-3 space-y-1">
                    {NAV_ITEMS.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => scrollToSection(item.section)}
                        className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${activeSection === item.section
                          ? `${themeClass('text')} ${themeClass('bg')} bg-opacity-10`
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </MotionDiv>
              )}
            </nav>
          </MotionDiv>
        )}


        {/* Main Content */}
        <main className="relative">
          {/* Hero Section */}
          <section id="home" className="min-h-screen flex items-center relative overflow-hidden bg-black">
            <Fireworks
              currentTheme={currentTheme}
              isDarkMode={isDarkMode}
              currentBackground={currentBackground}
            />

            <HeroSection
              currentTheme={currentTheme}
              isDarkMode={isDarkMode}
              helloText={helloText}
              nameText={nameText}
              roleText={roleText}
              currentRole={currentRole}
              showCursor={showCursor}
              isTypingHello={isTypingHello}
              isTypingName={isTypingName}
              isTypingRole={isTypingRole}
              showRole={showRole}
              showSocialIcons={showSocialIcons}
              showButtons={showButtons}
              showProfilePhoto={showProfilePhoto}
              scrollToContact={scrollToContact}
              triggerClickAnimation={triggerClickAnimation}
            />
          </section>

          {/* About Section */}
          <AboutSection currentTheme={currentTheme} />

          {/* Experience Section */}
          <ExperienceSection currentTheme={currentTheme} themeClass={themeClass} />

          {/* Projects Section */}
          <ProjectsSection currentTheme={currentTheme} />

          {/* Certifications Section */}
          <CertificationsSection currentTheme={currentTheme} />

          {/* Contact Section */}
          <ContactSection currentTheme={currentTheme} isDarkMode={isDarkMode} />
        </main>

        {/* Footer */}
        <Footer currentTheme={currentTheme} />
      </div>
    </>
  );
}
