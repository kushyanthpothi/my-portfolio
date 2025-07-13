'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Footer from '../components/Footer';
import ThemeDrawer from '../components/ThemeDrawer';
import Fireworks from '../components/Fireworks';
import ExperienceSection from '../components/ExperienceSection';
import { themeColors, themeClass as utilThemeClass, loadDarkMode, loadThemeMode, setThemeMode, getEffectiveDarkMode, setupSystemThemeListener, THEME_MODES } from '../utils/theme';

import emailjs from '@emailjs/browser';
import Head from 'next/head';

const MotionDiv = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.div),
  { ssr: false }
);

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClickAnimating, setIsClickAnimating] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [touchedCertId, setTouchedCertId] = useState(null);
  const [showAllCerts, setShowAllCerts] = useState(false);

  const [currentTheme, setCurrentTheme] = useState('blue');
  const [showThemeOptions, setShowThemeOptions] = useState(false);
  const [showThemeDrawer, setShowThemeDrawer] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [themeMode, setThemeModeState] = useState(THEME_MODES.SYSTEM);
  

  // Define navItems early to avoid initialization order issues
  const navItems = [
    { name: 'HOME', section: 'home' },
    { name: 'ABOUT', section: 'about' },
    { name: 'EXPERIENCE', section: 'experience' },
    { name: 'PROJECTS', section: 'projects' },
    { name: 'CERTIFICATIONS', section: 'certifications' },
    { name: 'CONTACT', section: 'contact' },
  ];

  const themeColors = {
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-600 hover:text-blue-600 dark:hover:text-blue-400 bg-blue-100 hover:bg-blue-200 dark:bg-blue-800',
    red: 'text-red-600 dark:text-red-400 bg-red-600 hover:text-red-600 dark:hover:text-red-400 bg-red-100 hover:bg-red-200 dark:bg-red-800',
    orange: 'text-orange-600 dark:text-orange-400 bg-orange-600 hover:text-orange-600 dark:hover:text-orange-400 bg-orange-100 hover:bg-orange-200 dark:bg-orange-800',
    pink: 'text-pink-600 dark:text-pink-400 bg-pink-600 hover:text-pink-600 dark:hover:text-pink-400 bg-pink-100 hover:bg-pink-200 dark:bg-pink-800',
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-600 hover:text-purple-600 dark:hover:text-purple-400 bg-purple-100 hover:bg-purple-200 dark:bg-purple-800',
    emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-600 hover:text-emerald-600 dark:hover:text-emerald-400 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-800',
    // amber: 'text-amber-600 dark:text-amber-400 bg-amber-600 hover:text-amber-600 dark:hover:text-amber-400 bg-amber-100 hover:bg-amber-200 dark:bg-amber-800'
  };

  const themeClass = (type) => {
    switch (type) {
      case 'text':
        return `text-${currentTheme}-600 dark:text-${currentTheme}-400`;
      case 'bg':
        return `bg-${currentTheme}-600`;
      case 'bgLight':
        return `bg-${currentTheme}-100 bg-opacity-70 hover:bg-${currentTheme}-200`;
      case 'bgStatic':
        return `bg-${currentTheme}-100 bg-opacity-70`;
      case 'borderLight':
        return `border-${currentTheme}-500`;
      default:
        return '';
    }
  };

  useEffect(() => {
    // Load theme and theme mode from localStorage on component mount
    const savedTheme = localStorage.getItem('siteTheme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }

    // Load theme mode and apply dark mode using utility functions
    const savedThemeMode = loadThemeMode();
    setThemeModeState(savedThemeMode);

    const darkModeEnabled = loadDarkMode();
    setIsDarkMode(darkModeEnabled);

    // Setup system theme listener
    const cleanup = setupSystemThemeListener((isDark, mode) => {
      setIsDarkMode(isDark);
      setThemeModeState(mode);
    });

    return () => {
      cleanup();
    };
  }, []);

  const changeTheme = (color) => {
    setCurrentTheme(color);
    localStorage.setItem('siteTheme', color);
  };

  const changeThemeMode = (mode) => {
    const isDark = setThemeMode(mode);
    setThemeModeState(mode);
    setIsDarkMode(isDark);

    // Force a re-render to ensure all components update
    setTimeout(() => {
      window.dispatchEvent(new Event('storage'));
    }, 0);
  };

  // Legacy function for backward compatibility
  const changeDarkMode = (darkMode) => {
    const mode = darkMode ? THEME_MODES.DARK : THEME_MODES.LIGHT;
    changeThemeMode(mode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await emailjs.send(
        'service_ab1oioq',
        'template_xwyd7xc',
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        'oYcBPdEZe66HUibML'
      );

      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Email error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.section));
      const scrollPosition = window.scrollY + 100; // Offset for navbar height

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && scrollPosition >= section.offsetTop) {
          setActiveSection(navItems[i].section);
          break;
        }
      }

      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navItems]);

  const triggerAnimation = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      // Only prevent horizontal scrolling
      document.body.style.overflowX = 'hidden';
      setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
    }
  };

  const triggerClickAnimation = () => {
    // If animation is already running, return early
    if (isClickAnimating) return;

    setIsClickAnimating(true);
    setTimeout(() => {
      setIsClickAnimating(false);
    }, 2000); // Match this with the animation duration in CSS
  };

  const titles = [
    "Full Stack Developer",
    "Software Developer",
    "AI Developer"
  ];

  const [currentTitle, setCurrentTitle] = useState(titles[0]);
  const [isShuffling, setIsShuffling] = useState(false);
  const titleRef = useRef(0);

  useEffect(() => {
    // Initial animation when component mounts
    triggerAnimation();

    const titleInterval = setInterval(() => {
      if (!isShuffling) {
        shuffleTitle();
      }
    }, 3000); // Changed from 5000 to 3000 for 3-second interval

    return () => clearInterval(titleInterval);
  }, [isShuffling]);

  const shuffleTitle = () => {
    setIsShuffling(true);
    const currentIdx = titleRef.current;
    const nextIdx = (currentIdx + 1) % titles.length;
    const nextTitle = titles[nextIdx];

    let iterations = 0;
    const maxIterations = 10;
    const interval = setInterval(() => {
      setCurrentTitle(prevTitle => {
        return prevTitle
          .split('')
          .map((letter, idx) => {
            if (letter === ' ' || (Math.random() > 0.5 && iterations > maxIterations / 2)) {
              return letter;
            }
            return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'[
              Math.floor(Math.random() * 52)
            ];
          })
          .join('');
      });

      iterations++;

      if (iterations >= maxIterations) {
        clearInterval(interval);
        setCurrentTitle(nextTitle);
        titleRef.current = nextIdx;
        setIsShuffling(false);
      }
    }, 50);
  };

  const userData = {
    name: "Kushyanth Pothineni",
    title: currentTitle, // This will now be dynamic
    about: "I am a passionate Full Stack Developer with hands-on experience in building modern, scalable web applications using technologies like React.js, Next.js, Django, and Spring Boot. My expertise spans frontend and backend development, database management, and API optimization. I have a proven track record of delivering impactful solutions, such as AI-powered supply chain optimization at NinjaCart and inventory tracking systems with real-time alerts. With a Bachelor of Technology in Computer Science from KKR & KSR Institute of Technology and Sciences, I am committed to leveraging my technical skills and certifications in MEAN Stack, Java Full Stack, and ServiceNow to create innovative, user-focused solutions.",
    skills: [
      { name: "Django", level: 85 },
      { name: "JavaScript", level: 92 },
      { name: "HTML/CSS", level: 95 },
      { name: "MongoDB", level: 80 },
      { name: "SQL", level: 82 },
      { name: "Java", level: 78 },
      { name: "API Design", level: 86 },
      { name: "Next.js", level: 85 }
    ],
    projects: [
      {
        title: "Event Mania",
        description: "Event Mania is a one-stop platform designed to simplify event management for colleges and students. Whether you're a student looking for exciting events to join or a college representative organizing events, Event Mania bridges the gap and creates a seamless experience.",
        techStack: ["React", "Firebase", "HTML/CSS", "Authentication"],
        image: "https://i.ibb.co/gJQKjNK/Event-Mania-Design.png",
        slug: "event-mania",
        viewSiteLink: "https://ap-event-mania.web.app/"
      },
      {
        title: "YouTube Video and Audio Downloader",
        description: "This Django-based project empowers you to download YouTube videos and audio in your preferred format and resolution. Select quality options and extract audio with just a few clicks.",
        techStack: ["Django", "Python", "HTML/CSS", "ffmpeg", "pytube"],
        image: "https://i.ibb.co/FB9hXK8/Laptop-Design-edit.png",
        slug: "youtube-downloader"
      },
      {
        title: "Pro Reader",
        description: "Pro Reader is a feature-packed Android application that empowers you to handle QR codes, speech, and text with ease. Whether it's scanning, generating, converting, or extracting text, Pro Reader is your ultimate tool.",
        techStack: ["Java/Kotlin", "Firebase", "ML Kit", "Android"],
        image: "https://i.ibb.co/sQYYbks/Pro-Reader-Banner-web-1.png",
        slug: "pro-reader"
      },
      {
        title: "Pin Noter",
        description: "Pin Noter is a React-based note-taking application offering rich text formatting options like bold, underline, and lists. It supports offline caching for seamless note-taking without logging in and automatically syncs notes to the cloud upon login.",
        techStack: ["React.js", "Firebase", "CSS3", "React-dom"],
        image: "https://i.ibb.co/Fk2jTJWP/screely-1752326497618.png",
        slug: "pin-noter",
        viewSiteLink: "https://pin-noter.web.app/"
      },
      {
        title: "Employee Record System",
        description: "A comprehensive web-based employee management system built with Django, designed to streamline employee data management for organizations. Features dual interface system with admin and employee panels, profile management, and role-based authentication.",
        techStack: ["Django", "Python", "MySQL", "Bootstrap", "JavaScript"],
        image: "https://i.ibb.co/ffTn15M/Untitled-design-1.png",
        slug: "employee-record-system"
      }
    ],
    certifications: [
      {
        name: "ServiceNow Certified System Administrator",
        image: "https://i.ibb.co/5WRM8C76/Service-Now-CSA-page-0001.jpg",
        link: "https://drive.google.com/file/d/1QdWYq6ditLGmzjzqcEITSwpAC9x-ZXUN/view?usp=sharing"
      },
      {
        name: "AWS Academy Machine Learning Foundations",
        image: "https://i.ibb.co/mFFtB0B/AWS-Academy-Machine-Learning-Foundations-page-0001.jpg",
        link: "https://www.credly.com/badges/446553a7-d24b-4955-889e-55eec636f750/linked_in_profile"
      },
      {
        name: "Wipro Talent Next Java Full Stack Certification",
        image: "https://i.ibb.co/vPfStSV/Wipro-Certificate.png",
        link: "https://cert.diceid.com/cid/xNkRt2LMUe"
      },
      {
        name: "Responsive Web Designer Certification",
        image: "https://i.ibb.co/rdvfGyY/image.png",
        link: "https://www.freecodecamp.org/certification/Kushyanthpothi/responsive-web-design"
      },
      {
        name: "Introduction to Internet of Things",
        image: "https://i.ibb.co/gjkdXfn/NPTEL-Introduction-To-Internet-Of-Things-page-0001.jpg",
        link: "https://nptel.ac.in/noc/E_Certificate/NPTEL24CS35S65630220730556258"
      },
      {
        name: "Junior Software Developer",
        image: "https://i.ibb.co/6nzykQ3/1735105593467-page-0001.jpg",
        link: "https://drive.google.com/file/d/1q3-3-lYH3mm08gcnGXN66SIFSRwyQm0u/view?usp=sharing"
      },
      {
        name: "The Fundamentals of Digital Marketing",
        image: "https://i.ibb.co/8gqNBvR/Google-Digital-Garage-The-fundamentals-of-digital-marketing-page-0001.jpg",
        link: "https://learndigital.withgoogle.com/link/1qsdpcedm9s"
      }
    ],
    socialLinks: {
      github: "https://github.com/kushyanthpothi/",
      linkedin: "https://www.linkedin.com/in/kushyanth-pothineni/",
      twitter: "https://x.com/KushyanthPothi1"
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Adjust this value based on your navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    // Close mobile menu if open
    setIsMenuOpen(false);
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const offset = 80; // Adjust this value based on your navbar height
      const elementPosition = contactSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleCertTouchStart = (index) => {
    setTouchedCertId(index);
  };

  const handleCertTouchEnd = () => {
    setTouchedCertId(null);
  };

  // Helper function to clear theme storage for testing
  const clearThemeStorage = () => {
    localStorage.removeItem('darkMode');
    localStorage.removeItem('siteTheme');
    window.location.reload();
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://kushyanthpothineni.vercel.app" />

        {/* Structured Data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Kushyanth Pothineni",
              "url": "https://kushyanthpothineni.vercel.app",
              "image": "https://i.ibb.co/CpW4rW5s/picofme-2.png",
              "jobTitle": "Full Stack Developer",
              "description": "Full Stack Developer specializing in React.js, Next.js, and Django",
              "knowsAbout": ["React.js", "Next.js", "Django", "JavaScript", "Python", "Web Development"],
              "alumniOf": {
                "@type": "Organization",
                "name": "Wipro Talent Next"
              },
              "sameAs": [
                "https://github.com/kushyanthpothi/",
                "https://www.linkedin.com/in/kushyanth-pothineni/",
                "https://x.com/KushyanthPothi1"
              ]
            })
          }}
        />
      </Head>

      <main className="relative w-full min-h-screen overflow-x-hidden">
        <div key={`theme-${isDarkMode}`} className={`w-full min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
          {/* Navigation */}
          <nav className={`fixed w-full z-[100] transition-all duration-300 ${scrolled && activeSection !== 'home' ? 'bg-white/30 dark:bg-gray-800/30 backdrop-blur-md' : 'bg-transparent'}`}>
            <div className="w-full px-4 sm:px-10 lg:px-12">
              <div className="flex justify-between items-center h-20">
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
                </div>                  <div className="flex items-center space-x-6">
                  {/* Desktop Navigation */}
                  <div className="hidden md:flex space-x-8 bg-black/10 dark:bg-black/10 bg-opacity-10 backdrop-blur-sm rounded-3xl p-2">
                    {navItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => scrollToSection(item.section)}
                        className={`text-sm font-medium tracking-wider rounded-3xl px-3 py-2 transition-colors cursor-pointer ${activeSection === item.section ? 'bg-white dark:bg-white text-gray-900 dark:text-gray-900' : `bg-transparent ${themeClass('text')}`
                          }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>

                  {/* Theme Settings Button */}
                  <div className="relative">
                    <button
                      className={`p-2 rounded-full ${themeClass('bg')} bg-opacity-10 hover:bg-opacity-20 backdrop-blur-sm transition-colors ${themeClass('text')}`}
                      onClick={() => setShowThemeDrawer(true)}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* Mobile Navigation Button */}
                  <button
                    className={`md:hidden p-1.5 rounded-md ${themeClass('bg')} bg-opacity-10 hover:bg-opacity-20 backdrop-blur-sm transition-colors ${themeClass('text')}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <MotionDiv
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="md:hidden bg-white/30 dark:bg-gray-800/30 backdrop-blur-md shadow-lg"
              >
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => scrollToSection(item.section)}
                      className={`block w-full px-3 py-2 text-center rounded-md transition-colors cursor-pointer ${activeSection === item.section ? 'bg-white dark:bg-white text-gray-900 dark:text-gray-900' : `bg-transparent ${themeClass('text')}`
                        } hover:bg-${currentTheme}-200/20 dark:hover:bg-${currentTheme}-800/20`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </MotionDiv>
            )}
          </nav>

          {/* Hero Section */}
          <section id="home" className="min-h-screen flex items-center relative overflow-hidden">
            {/* Theme-colored moving gradient balls */}
            <div
              className="hero-gradient-ball-1"
              style={{
                background: `radial-gradient(circle, ${currentTheme === 'blue' ? 'rgb(37, 99, 235)' :
                  currentTheme === 'red' ? 'rgb(220, 38, 38)' :
                    currentTheme === 'orange' ? 'rgb(234, 88, 12)' :
                      currentTheme === 'pink' ? 'rgb(219, 39, 119)' :
                        currentTheme === 'purple' ? 'rgb(147, 51, 234)' :
                          currentTheme === 'emerald' ? 'rgb(5, 150, 105)' :
                            'rgb(37, 99, 235)'
                  } 15%, transparent 70%)`
              }}
            />

            <div
              className="hero-gradient-ball-2"
              style={{
                background: `radial-gradient(circle, ${currentTheme === 'blue' ? 'rgba(59, 130, 246, 0.8)' :
                  currentTheme === 'red' ? 'rgba(239, 68, 68, 0.8)' :
                    currentTheme === 'orange' ? 'rgba(249, 115, 22, 0.8)' :
                      currentTheme === 'pink' ? 'rgba(236, 72, 153, 0.8)' :
                        currentTheme === 'purple' ? 'rgba(168, 85, 247, 0.8)' :
                          currentTheme === 'emerald' ? 'rgba(16, 185, 129, 0.8)' :
                            'rgba(59, 130, 246, 0.8)'
                  } 15%, transparent 70%)`
              }}
            />

            {/* Fireworks Animation */}
            <Fireworks currentTheme={currentTheme} isDarkMode={isDarkMode} />

            {/* Hero content container with backdrop blur */}
            <div className="w-full px-4 sm:px-10 lg:px-12 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center md:text-left order-2 md:order-1"
                >
                  <h2 className={`text-lg font-medium ${themeClass('text')} mb-2`}>Hello, I'm</h2>
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white">
                    {userData.name}
                  </h1>
                  <p className="text-xl md:text-2xl font-light text-white mb-8">
                    {userData.title}
                  </p>
                  <div className="flex justify-center md:justify-start space-x-4 mb-8">
                    {Object.entries(userData.socialLinks).map(([platform, link]) => (
                      <a
                        key={platform}
                        href={link}
                        className={`transition-colors ${themeClass('text')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={platform}
                      >
                        {platform === 'twitter' ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        ) : (
                          <i className={`fab fa-${platform} text-2xl`}></i>
                        )}
                      </a>
                    ))}

                    {/* ServiceNow Badge */}
                    <div className="group relative inline-block">
                      <a
                        href="https://drive.google.com/file/d/1QdWYq6ditLGmzjzqcEITSwpAC9x-ZXUN/view?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-block ${themeClass('text')}`}
                      >
                        <svg
                          viewBox="0 0 1570 1403"
                          width="34"
                          height="54"
                          className="w-7 h-6"
                          fill="currentColor"
                        >
                          <path
                            d="M0.999998,835.000000 C1.000000,803.645752 1.000000,772.291565 1.431128,740.438232 C2.241194,738.812256 2.875731,737.703857 2.959070,736.555420 C3.699081,726.358643 3.854409,716.093994 5.119089,705.966370 C7.408650,687.631409 9.954945,669.309387 13.121598,651.108582 C16.025726,634.416687 19.056086,617.663696 23.520016,601.345032 C30.730247,574.986938 38.141685,548.596741 47.362968,522.900085 C56.706970,496.861450 67.966728,471.478821 79.142624,446.141968 
	C85.004089,432.853485 92.081314,420.047455 99.328697,407.436890 
	C109.653969,389.470825 119.797340,371.302673 131.550919,354.278931 
	C147.333649,331.419312 164.185196,309.260620 181.337723,287.397125 
	C192.304001,273.418945 203.930344,259.799866 216.526794,247.295120 
	C237.463699,226.510605 258.947845,206.215988 281.104614,186.742569 
	C296.693909,173.041214 313.645752,160.865204 330.230499,148.327286 
	C355.682404,129.085876 382.919617,112.523430 410.845978,97.245079 
	C430.194641,86.659523 450.173859,77.052124 470.473480,68.424355 
	C494.569611,58.182991 519.039734,48.651260 543.854431,40.321434 
	C566.196716,32.821548 589.005310,26.378614 612.007812,21.267860 
	C636.833130,15.752095 662.052185,11.846758 687.233276,8.150272 
	C704.441284,5.624204 721.881470,4.687767 739.205933,2.923956 
	C740.192322,2.823533 741.071106,1.665693 742.000000,0.999992 
	C772.354248,1.000000 802.708435,1.000000 833.349487,1.408784 
	C838.417358,2.540688 843.181458,3.413590 847.982727,3.959267 
	C863.306213,5.700810 878.683655,7.022166 893.963928,9.074373 
	C908.364380,11.008427 922.863831,12.835763 936.973206,16.174643 
	C965.306824,22.879633 993.668884,29.702284 1021.538513,38.076038 
	C1065.458984,51.272427 1107.725220,68.876595 1148.098877,90.699554 
	C1168.770142,101.872856 1189.291260,113.427673 1209.167969,125.941170 
	C1233.800171,141.448410 1257.573364,158.295822 1279.756592,177.246338 
	C1293.766479,189.214645 1308.356201,200.589432 1321.571655,213.381577 
	C1339.454346,230.691360 1356.630615,248.774277 1373.420288,267.155548 
	C1385.703735,280.603607 1397.405151,294.665802 1408.402832,309.183929 
	C1420.617554,325.308716 1432.357544,341.870056 1443.177124,358.955078 
	C1456.268677,379.627808 1468.664307,400.782318 1480.434937,422.236389 
	C1488.758667,437.407959 1495.992676,453.228333 1502.899536,469.112823 
	C1511.080200,487.927338 1518.974365,506.909454 1525.947510,526.196777 
	C1539.705200,564.249573 1550.274414,603.224304 1557.049683,643.157837 
	C1560.219482,661.841248 1563.468140,680.530579 1565.844727,699.322998 
	C1567.599243,713.196960 1567.963623,727.245117 1569.079712,741.205078 
	C1569.157837,742.181641 1570.334229,743.070435 1571.000000,744.000000 
	C1571.000000,773.687561 1571.000000,803.375122 1570.588135,833.352844 
	C1569.784424,835.156494 1569.150146,836.652466 1569.039307,838.186218 
	C1568.291138,848.544739 1568.114624,858.966736 1566.873413,869.262146 
	C1564.956421,885.162598 1562.722656,901.047180 1559.915283,916.812378 
	C1556.431396,936.376526 1553.198853,956.070984 1548.097656,975.240845 
	C1540.907715,1002.260010 1533.077026,1029.196167 1523.707520,1055.522583 
	C1514.818726,1080.498291 1504.011230,1104.827759 1493.236572,1129.081177 
	C1487.142700,1142.798096 1479.743164,1155.974731 1472.339966,1169.060059 
	C1463.345825,1184.957642 1454.144653,1200.769531 1444.285767,1216.139038 
	C1428.301758,1241.057251 1411.113403,1265.156738 1391.809570,1287.654419 
	C1380.012695,1301.403320 1367.979370,1314.950928 1355.946289,1328.494873 
	C1352.695801,1332.153198 1349.107422,1335.518188 1345.591064,1338.932373 
	C1335.637695,1348.596313 1326.114136,1358.772217 1315.565674,1367.739990 
	C1292.155640,1387.641968 1264.810059,1398.783203 1234.251343,1402.081909 
	C1233.441406,1402.169312 1232.747925,1403.336426 1232.000000,1404.000000 
	C1221.979126,1404.000000 1211.958130,1404.000000 1201.662109,1403.600098 
	C1200.542114,1402.803589 1199.717285,1402.113403 1198.849243,1402.053711 
	C1181.486694,1400.862061 1165.397095,1395.234375 1149.634521,1388.284668 
	C1132.991211,1380.946655 1119.299561,1369.107178 1104.360840,1359.155029 
	C1077.832520,1341.481567 1050.624146,1324.840942 1021.296326,1312.232910 
	C999.929993,1303.047485 978.104309,1294.843750 956.173523,1287.077515 
	C919.849670,1274.214600 882.032471,1267.730957 843.927002,1263.174438 
	C827.406372,1261.198975 810.682556,1260.746826 794.031677,1260.110962 
	C785.955017,1259.802612 777.826477,1260.545044 769.734009,1261.024658 
	C754.426941,1261.932007 739.085999,1262.568726 723.839661,1264.113403 
	C709.529907,1265.563232 695.212585,1267.462769 681.096497,1270.189209 
	C654.227661,1275.378784 627.583923,1281.695190 601.990356,1291.593994 
	C582.243958,1299.231323 562.477783,1306.908813 543.190491,1315.610352 
	C529.217468,1321.914429 515.623230,1329.288940 502.560425,1337.324585 
	C483.525513,1349.034424 464.868774,1361.405640 446.510681,1374.156982 
	C424.465179,1389.469482 400.566895,1399.386963 373.765656,1402.074829 
	C372.789215,1402.172729 371.919495,1403.334229 371.000000,1404.000000 
	C359.645782,1404.000000 348.291534,1404.000000 336.694153,1403.623291 
	C335.610382,1402.834717 334.811066,1402.238159 333.922821,1402.039673 
	C324.707886,1399.979858 315.219727,1398.766968 306.303558,1395.818726 
	C282.817169,1388.052979 261.989838,1375.399170 244.561752,1357.860474 
	C226.927322,1340.114136 209.444656,1322.136108 193.072098,1303.240234 
	C177.428818,1285.186157 162.997086,1266.049072 148.576462,1246.976807 
	C126.858688,1218.253662 108.659988,1187.274780 91.877716,1155.474854 
	C76.924820,1127.141113 63.092056,1098.251099 52.568455,1067.945190 
	C44.029728,1043.355225 35.237053,1018.786682 28.288481,993.728516 
	C19.529846,962.142700 12.577224,930.052551 8.987444,897.373718 
	C6.836420,877.792358 5.014823,858.174866 2.929849,838.585876 
	C2.796843,837.336304 1.666419,836.192810 0.999998,835.000000 M858.624939,404.984100 C854.434448,404.299500 850.265625,403.409363 846.049744,402.966522 C829.556824,401.234314 813.079041,399.105988 796.536621,398.185455 
	C785.155273,397.552063 773.651123,398.299927 762.248108,399.093842 C748.488586,400.051758 734.576233,400.680481 721.095093,403.317780 C702.601135,406.935852 684.303772,411.801605 666.185486,417.042755 C637.057861,425.468506 609.887146,438.593506 583.943176,454.111633 C561.253052,467.683502 540.007385,483.328491 520.865662,501.670807 C515.401855,506.906464 509.957001,512.184387 504.829468,517.743652 C495.482178,527.877869 485.721710,537.730347 477.326019,548.619812 C464.475708,565.287048 452.969330,582.897583 442.699341,601.374390 C430.743042,622.885132 421.053467,645.336182 413.378601,668.582703 C405.965637,691.036072 400.251434,714.025024 397.978333,737.684509 C396.515717,752.908020 394.882629,768.136108 394.153717,783.401672 C393.673218,793.464966 394.355316,803.620300 395.069672,813.695251 C396.115753,828.448425 396.681702,843.337646 399.230743,857.856750 C402.518951,876.586243 406.654907,895.275757 412.042450,913.504761 C422.752319,949.742310 439.717896,983.149780 460.916687,1014.405334 C473.693909,1033.244263 487.997650,1050.831421 504.288727,1066.755493 C509.618469,1071.965210 514.888306,1077.283936 520.626587,1082.018188 C533.392090,1092.549927 546.071594,1103.246582 559.453308,1112.956543 C578.814819,1127.005493 599.817566,1138.350342 621.743774,1147.964722 C644.476318,1157.932861 667.971191,1165.416138 692.122131,1171.207275 C720.272095,1177.957275 748.876953,1179.894409 777.607971,1180.905762 C785.688416,1181.190186 793.818420,1179.905396 801.909302,1180.083618 C825.246948,1180.597412 848.164856,1177.518921 870.980164,1173.037231 C893.096252,1168.692871 914.857727,1162.858398 935.474548,1153.890381 C954.745911,1145.507690 973.570740,1135.945679 992.010864,1125.841919 C1017.159302,1112.062256 1039.762085,1094.497925 1059.957642,1074.229492 C1074.326050,1059.809082 1087.858154,1044.435547 1100.628174,1028.573120 C1115.815063,1009.708435 1128.262329,988.860962 1138.816162,967.073975 C1150.768311,942.400574 1160.020752,916.669861 1166.576660,889.974182 C1171.819336,868.626465 1175.277466,846.996216 1176.829346,825.133179 C1177.750244,812.160706 1176.880859,799.068298 1177.030029,786.032227 C1177.260742,765.864990 1175.901245,745.782043 1171.862061,726.063477 C1167.750244,705.991211 1163.469727,685.843323 1157.389404,666.311890 C1149.380371,640.584656 1138.023804,616.131775 1124.399048,592.780518 C1110.821777,569.510498 1095.197632,547.706909 1077.087524,527.824524 C1067.103149,516.863098 1056.425537,506.376343 1045.065674,496.863281 C1029.898804,484.162048 1014.507690,471.444244 997.849609,460.884033 C979.283142,449.113953 959.661072,438.714569 939.638428,429.609924 C914.107361,418.000549 887.190125,410.014862 858.624939,404.984100z"
                          />
                        </svg>
                      </a>
                      <span className="absolute left-1/2 -translate-x-1/2 -bottom-12 bg-gray-900 text-white text-xs px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap transform scale-0 group-hover:scale-100 z-10 pointer-events-none">
                        ServiceNow Certified Administrator
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center md:justify-start space-y-4 md:space-y-0 md:space-x-4 flex-col md:flex-row">
                    <a
                      onClick={scrollToContact}
                      className={`inline-block px-8 py-3 ${themeClass('bg')} bg-opacity-10 hover:bg-opacity-20 backdrop-blur-sm ${themeClass('text')} font-medium rounded-md transition-all duration-300 transform hover:scale-105 cursor-pointer`}
                    >
                      Get In Touch
                    </a>
                    <a
                      href="https://tinyurl.com/kushyanthresume"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-block px-8 py-3 ${themeClass('bg')} bg-opacity-10 hover:bg-opacity-20 backdrop-blur-sm ${themeClass('text')} font-medium rounded-md transition-all duration-300 transform hover:scale-105 cursor-pointer`}
                    >
                      View My Resume
                    </a>
                  </div>
                </MotionDiv>

                <MotionDiv
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex justify-center order-1 md:order-2"
                >
                  <div
                    className="relative w-48 h-48 md:w-80 md:h-80 cursor-pointer md:cursor-pointer"
                    onClick={triggerClickAnimation}
                  >
                    {/* Profile image */}
                    <div className="relative w-full h-full rounded-full overflow-hidden border-8 border-white dark:border-gray-800 shadow-2xl z-10">
                      <Image
                        src="https://i.ibb.co/CpW4rW5s/picofme-2.png"
                        alt="Kushyanth Pothineni"
                        layout="fill"
                        objectFit="cover"
                        priority
                      />
                    </div>
                  </div>
                </MotionDiv>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="pt-20 py-20 bg-white dark:bg-gray-800">
            <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12">
              {/* About Me Section with Photo and Content */}
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.2 }}
                className="mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white text-center md:text-left">About <span className={themeClass('text')}>Me</span></h2>
                <div className={`h-1 w-20 ${themeClass('bg')} mb-6 mx-auto md:mx-0`}></div>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  {/* Left Side: Photo */}
                  <div className="w-full md:w-1/3 flex justify-center md:justify-start">
                    <Image
                      src="https://i.ibb.co/Q34XQpTb/Snapchat-299913884.jpg"
                      alt="Profile Photo"
                      width={400}
                      height={610}
                      className="rounded-2xl shadow-lg object-cover w-[400px] h-[610px] max-w-full"
                    />
                  </div>
                  {/* Right Side: Content */}
                  <div className="w-full md:w-2/3">
                    <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-4">
                      Hey, I’m <strong>Kushyanth</strong> 👋
                    </p>
                    <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-4">
                      I’m a Software Development Engineer at <strong>Ninjacart</strong>, where I focus on building backend infrastructure for Agentic AI systems and automating internal workflows at scale. My work involves crafting robust REST APIs with <strong>Spring Boot</strong>, designing scalable microservices, and integrating AI models into production environments.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-4">
                      I’m passionate about <strong>clean architecture</strong>, <strong>test-driven development</strong>, and enhancing developer experience and system performance. At Ninjacart, I’ve built solutions like workflow automation with <strong>n8n</strong> and OCR-driven data processing pipelines integrated with machine learning models.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-4">
                      Outside of work, I’ve shipped several full-stack projects, including:
                    </p>
                    <ul className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-4 list-disc list-inside">
                      <li>
                        <strong>Event Mania</strong> – An event platform connecting 1000+ students to college organizations, built with <strong>Next.js</strong>, <strong>Firebase</strong>, and <strong>Tailwind</strong>.
                      </li>
                      <li>
                        <strong>Instans</strong> – An AI-powered interview preparation tool with end-to-end testing using <strong>Playwright</strong> and <strong>Google Generative AI APIs</strong>.
                      </li>
                      <li>
                        <strong>Smart Inventory Tracker</strong> – A warehouse management system deployed on <strong>AWS</strong> with real-time alerts and role-based access control (RBAC).
                      </li>
                    </ul>
                    <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-4">
                      I’m constantly leveling up in cloud platforms (<strong>AWS</strong>, <strong>Docker</strong>), backend systems, and emerging AI tooling. If it’s about automation, performance, or real-time systems—I’m all in.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                      Let’s build something cool.
                    </p>
                  </div>

                </div>
              </MotionDiv>

              {/* Education Section */}
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.2 }}
                className="mb-16"
              >
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white text-center md:text-left">My <span className={themeClass('text')}>Education</span></h3>
                <div className={`h-1 w-20 ${themeClass('bg')} mb-6 mx-auto md:mx-0`}></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 shadow-lg transition-shadow duration-300 flex flex-col h-full">
                    <div className="mb-4">
                      <i className={`fas fa-university text-3xl ${themeClass('text')}`}></i>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Bachelor of Technology</h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">KKR & KSR Institute of Technology and Sciences</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Computer Science</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
                      <span className={`px-3 py-1 ${themeClass('bg')} text-white text-sm font-semibold rounded-full`}>
                        GPA: 8.04
                      </span>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">2021 - 2025</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 shadow-lg transition-shadow duration-300 flex flex-col h-full">
                    <div className="mb-4">
                      <i className={`fas fa-school text-3xl ${themeClass('text')}`}></i>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Higher Secondary</h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">Narayana Junior College</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">State Board of Intermediate Education</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
                      <span className={`px-3 py-1 ${themeClass('bg')} text-white text-sm font-semibold rounded-full`}>
                        GPA: 8.45
                      </span>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">2019 - 2021</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 shadow-lg transition-shadow duration-300 flex flex-col h-full">
                    <div className="mb-4">
                      <i className={`fas fa-graduation-cap text-3xl ${themeClass('text')}`}></i>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Secondary School</h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">Viveka High School</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">SSC</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
                      <span className={`px-3 py-1 ${themeClass('bg')} text-white text-sm font-semibold rounded-full`}>
                        GPA: 9.5
                      </span>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">2018 - 2019</p>
                    </div>
                  </div>
                </div>
              </MotionDiv>

              {/* Skills Section */}
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white text-center md:text-left">Technical <span className={themeClass('text')}>Expertise</span></h3>
                <div className={`h-1 w-20 ${themeClass('bg')} mb-6 mx-auto md:mx-0`}></div>
                <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-8 text-center md:text-left">
                  A comprehensive showcase of my technical skills and proficiencies across various domains.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      category: "Programming Languages",
                      icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      ),
                      skills: [
                        { name: 'JavaScript', wiki: 'https://en.wikipedia.org/wiki/JavaScript', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
                        { name: 'Python', wiki: 'https://en.wikipedia.org/wiki/Python_(programming_language)', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
                        { name: 'Java', wiki: 'https://en.wikipedia.org/wiki/Java_(programming_language)', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
                        { name: 'C/C++', wiki: 'https://en.wikipedia.org/wiki/C%2B%2B', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' }
                      ]
                    },
                    {
                      category: "Frontend Development",
                      icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                      ),
                      skills: [
                        { name: 'React.js', wiki: 'https://en.wikipedia.org/wiki/React_(JavaScript_library)', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
                        { name: 'Next.js', wiki: 'https://en.wikipedia.org/wiki/Next.js', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
                        { name: 'Angular', wiki: 'https://en.wikipedia.org/wiki/Angular_(web_framework)', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg' },
                        { name: 'HTML/CSS', wiki: 'https://en.wikipedia.org/wiki/HTML', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' }
                      ]
                    },
                    {
                      category: "Backend Development",
                      icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                        </svg>
                      ),
                      skills: [
                        { name: 'Django', wiki: 'https://en.wikipedia.org/wiki/Django_(web_framework)', image: 'https://www.svgrepo.com/show/353657/django-icon.svg' },
                        { name: 'Node.js', wiki: 'https://en.wikipedia.org/wiki/Node.js', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
                        { name: 'REST APIs', wiki: 'https://en.wikipedia.org/wiki/Representational_state_transfer', image: 'https://www.svgrepo.com/show/375531/api.svg' },
                        { name: 'Firebase', wiki: 'https://en.wikipedia.org/wiki/Firebase', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' }
                      ]
                    },
                    {
                      category: "Database Systems",
                      icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                        </svg>
                      ),
                      skills: [
                        { name: 'MongoDB', wiki: 'https://en.wikipedia.org/wiki/MongoDB', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
                        { name: 'PostgreSQL', wiki: 'https://en.wikipedia.org/wiki/PostgreSQL', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
                        { name: 'MySQL', wiki: 'https://en.wikipedia.org/wiki/MySQL', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
                        { name: 'Firebase', wiki: 'https://en.wikipedia.org/wiki/Firebase', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' }
                      ]
                    },
                    {
                      category: "Development Tools",
                      icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ),
                      skills: [
                        { name: 'Git', wiki: 'https://en.wikipedia.org/wiki/Git', image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
                        { name: 'MCP', wiki: 'https://www.anthropic.com/news/model-context-protocol', image: 'https://avatars.githubusercontent.com/u/182288589?s=200&v=4' },
                        { name: 'SDLC', wiki: 'https://en.wikipedia.org/wiki/Software_development_life_cycle', image: 'https://cdn2.iconfinder.com/data/icons/programming-76/512/SDLC-software-development-life_cycle-512.png' },
                        { name: 'API Integration', wiki: 'https://en.wikipedia.org/wiki/API', image: 'https://www.svgrepo.com/show/375531/api.svg' }
                      ]
                    }
                  ].map((category, categoryIndex) => (
                    <MotionDiv
                      key={category.category}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                      viewport={{ once: true, amount: 0.2 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center mb-6">
                        <div className={`p-3 rounded-lg ${themeClass('bg')} bg-opacity-10 mr-4 text-gray-900 dark:text-white`}>
                          {category.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{category.category}</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {category.skills.map((skill, skillIndex) => (
                          <MotionDiv
                            key={skill.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: (categoryIndex * 4 + skillIndex) * 0.1 }}
                            viewport={{ once: true, amount: 0.2 }}
                            className="relative group"
                          >
                            <a
                              href={skill.wiki}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                            >
                              <div className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
                                <Image
                                  src={skill.image}
                                  alt={skill.name}
                                  width={32}
                                  height={32}
                                  className={`${skill.name === 'Next.js' ? 'dark:invert' : ''}`}
                                />
                              </div>
                              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">{skill.name}</span>
                            </a>
                          </MotionDiv>
                        ))}
                      </div>
                    </MotionDiv>
                  ))}
                </div>
              </MotionDiv>
            </div>
          </section>

          {/* Experience Section */}
          <ExperienceSection currentTheme={currentTheme} themeClass={themeClass} />


          {/* Projects Section */}
          <section id="projects" className="pt-20 py-20 bg-white dark:bg-gray-800">
            <div className="w-full px-4 sm:px-10 lg:px-12">
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.2 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">My <span className={themeClass('text')}>Projects</span></h2>
                <div className={`h-1 w-20 ${themeClass('bg')} mx-auto mb-6`}></div>
                <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                  Here are some of my recent projects. Each one was built to solve real-world problems.
                </p>
              </MotionDiv>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userData.projects.slice(0, 4).map((project, index) => (
                  <MotionDiv
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="relative h-48 md:h-64">
                      <Image
                        src={project.image}
                        alt={project.title}
                        layout="fill"
                        className="object-contain bg-gray-50 dark:bg-gray-700"
                      />
                    </div>
                    <div className="p-4 md:p-6">
                      <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{project.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 h-[72px]">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.techStack.map((tech, i) => (
                          <span
                            key={i}
                            className={`px-3 py-1 ${themeClass('bg')} bg-opacity-10 dark:bg-opacity-20 ${themeClass('text')} rounded-full text-sm`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-4">
                        <a
                          href={`/projects/${project.slug}`}
                          className={`inline-flex items-center px-4 py-2 bg-opacity-10 ${themeClass('bg')} ${themeClass('text')} rounded-md transition-colors duration-300 transform hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-${currentTheme}-500 focus:ring-offset-2`}
                        >
                          <span>View Details</span>
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                        {project.viewSiteLink && (
                          <a
                            href={project.viewSiteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-gray-200/50 dark:bg-gray-600/30 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300/50 dark:hover:bg-gray-500/40 transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:ring-offset-2"
                          >
                            <span>Live Demo</span>
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </MotionDiv>
                ))}
              </div>

              {/* View More Button */}
              {userData.projects.length > 4 && (
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="text-center mt-12"
                >
                  <a
                    href="/projects"
                    className={`inline-flex items-center px-8 py-3 ${themeClass('bg')} bg-opacity-10 hover:bg-opacity-20 backdrop-blur-sm transition-all duration-300 ${themeClass('text')} rounded-md font-semibold transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                  >
                    <span>View All Projects</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </MotionDiv>
              )}
            </div>
          </section>

          {/* Certifications Section */}
          <section id="certifications" className="pt-20 py-20 bg-white dark:bg-gray-800">
            <div className="w-full px-4 sm:px-10 lg:px-12">
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.2 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">My <span className={themeClass('text')}>Certifications</span></h2>
                <div className={`h-1 w-20 ${themeClass('bg')} mx-auto mb-6`}></div>
                <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                  Professional certifications that validate my expertise and commitment to quality.
                </p>
              </MotionDiv>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userData.certifications.slice(0, showAllCerts ? userData.certifications.length : 6).map((cert, index) => (
                  <MotionDiv
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    className={`certificate-card shadow-lg ${touchedCertId === index ? 'touched' : ''}`}
                    onTouchStart={() => handleCertTouchStart(index)}
                    onTouchEnd={handleCertTouchEnd}
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={cert.image}
                        alt={cert.name}
                        fill
                        className="object-cover"
                      />
                      <div className="certificate-overlay">
                        <h3 className="text-white text-xl font-bold text-center px-4 mb-4">{cert.name}</h3>
                        <a
                          href={cert.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center px-6 py-2 bg-opacity-10 ${themeClass('bg')} hover:bg-opacity-20 ${themeClass('text')} font-medium rounded-md transition-all duration-300 backdrop-blur-sm`}
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 15a7 7 0 100-14 7 7 0 000 14z" />
                            <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
                            <circle cx="12" cy="8" r="3" />
                          </svg>
                          View Certificate
                        </a>
                      </div>
                    </div>
                  </MotionDiv>
                ))}
              </div>

              {userData.certifications.length > 6 && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setShowAllCerts(!showAllCerts)}
                    className={`inline-flex items-center px-6 py-2 bg-opacity-10 ${themeClass('bg')} hover:bg-opacity-20 ${themeClass('text')} font-medium rounded-md transition-all duration-300 backdrop-blur-sm`}
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      {showAllCerts ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      )}
                    </svg>
                    {showAllCerts ? 'View Less' : 'View More'}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="pt-20 py-20 bg-white dark:bg-gray-800">
            <div className="w-full px-4 sm:px-10 lg:px-12">
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.2 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Get In <span className={themeClass('text')}>Touch</span></h2>
                <div className={`h-1 w-20 ${themeClass('bg')} mx-auto mb-6`}></div>
                <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                  Have a project in mind? Let's discuss how we can work together.
                </p>
              </MotionDiv>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                <MotionDiv
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Contact Information</h3>
                  <p className="mb-6 text-gray-600 dark:text-gray-300">Feel free to reach out to me using any of the following methods.</p>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg className={`w-6 h-6 ${themeClass('text')}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Email</p>
                        <p className="text-gray-600 dark:text-gray-300">pothineni.kushyanth@gmail.com</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg className={`w-6 h-6 ${themeClass('text')}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Phone</p>
                        <p className="text-gray-600 dark:text-gray-300">8125144235</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg className={`w-6 h-6 ${themeClass('text')}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Location</p>
                        <p className="text-gray-600 dark:text-gray-300">Guntur, Andra Pradesh</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex space-x-6">
                    {Object.entries(userData.socialLinks).map(([platform, link]) => (
                      <a
                        key={platform}
                        href={link}
                        className={`transition-colors ${themeClass('text')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className={`fab fa-${platform} text-2xl`}></i>
                      </a>
                    ))}
                  </div>
                </MotionDiv>

                <MotionDiv
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 md:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                    <div className="space-y-4 md:space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className={`block w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-transparent focus:border-${currentTheme}-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-${currentTheme}-500 outline-none transition-colors duration-200`}
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className={`block w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-transparent focus:border-${currentTheme}-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-${currentTheme}-500 outline-none transition-colors duration-200`}
                          placeholder="you@example.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Your Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows="4"
                          className={`block w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-transparent focus:border-${currentTheme}-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-${currentTheme}-500 outline-none transition-colors duration-200 resize-none`}
                          placeholder="Your message here..."
                        ></textarea>
                      </div>

                      {submitStatus === 'success' && (
                        <div className="p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md">
                          Message sent successfully!
                        </div>
                      )}

                      {submitStatus === 'error' && (
                        <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md">
                          Failed to send message. Please try again.
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full ${themeClass('bg')} text-white py-3 px-6 rounded-lg font-semibold hover:${themeClass('bg')} dark:hover:${themeClass('bg')} focus:outline-none focus:ring-2 focus:ring-${currentTheme}-500 focus:ring-offset-2 transition-colors duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                          {!isSubmitting && (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          )}
                        </div>
                      </button>
                    </div>
                  </form>
                </MotionDiv>
              </div>
            </div>
          </section>

          {/* Footer */}
          <Footer />

          {/* Theme Drawer */}
          <ThemeDrawer
            isOpen={showThemeDrawer}
            onClose={() => setShowThemeDrawer(false)}
            currentTheme={currentTheme}
            onThemeChange={changeTheme}
            themeMode={themeMode}
            onThemeModeChange={changeThemeMode}
          />

          {/* Clean closing tags */}
        </div>
      </main>
    </>
  );
}
