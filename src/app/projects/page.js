'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Footer from '../../components/Footer';
import { themeClass as utilThemeClass, loadDarkMode } from '../../utils/theme';


const MotionDiv = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.div),
  { ssr: false }
);

export default function Projects() {
  const [currentTheme, setCurrentTheme] = useState('orange');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const getThemeClass = (type) => {
    return utilThemeClass(type, currentTheme);
  };

  useEffect(() => {
    // Load theme and dark mode from localStorage on component mount
    const savedTheme = localStorage.getItem('siteTheme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }

    // Load and apply dark mode
    const darkModeEnabled = loadDarkMode();
    setIsDarkMode(darkModeEnabled);

    // Force scroll to top when component mounts (for projects page)
    // Clear any existing scroll restoration first
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('scrollPosition');
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

      // Additional scroll to top after a brief delay to ensure it works
      const scrollTimer = setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }, 50);

      // Another backup scroll after DOM is fully settled
      const backupScrollTimer = setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }, 200);

      // Listen for storage changes to sync dark mode and theme across tabs
      const handleStorageChange = (e) => {
        if (e.key === 'darkMode' || e.type === 'storage') {
          const darkModeEnabled = loadDarkMode();
          setIsDarkMode(darkModeEnabled);
        }
        if (e.key === 'siteTheme' || e.type === 'storage') {
          const savedTheme = localStorage.getItem('siteTheme');
          if (savedTheme) {
            setCurrentTheme(savedTheme);
          }
        }
      };

      // Listen for custom theme change events (for same-tab updates)
      const handleThemeChange = (event) => {
        if (event.detail?.theme) {
          setCurrentTheme(event.detail.theme);
        }
        if (event.detail?.darkMode !== undefined) {
          setIsDarkMode(event.detail.darkMode);
        }
      };

      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('themeChanged', handleThemeChange);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('themeChanged', handleThemeChange);
        clearTimeout(scrollTimer);
        clearTimeout(backupScrollTimer);
      };
    }
  }, []);

  const userData = {
    projects: [
      {
        title: "instans",
        description: "Instans is an AI-powered interview preparation assistant that combines real-time screen sharing with intelligent chat capabilities. The platform leverages Google's Generative AI to provide personalized interview coaching, technical problem-solving guidance, and resume analysis.",
        techStack: ["React", "Firebase", "HTML/CSS", "Open Source", "Gemini"],
        image: "/images/projects/instans.jpg",
        slug: "instans",
        viewSiteLink: "https://instans.netlify.app/"
      },
      {
        title: "Event Mania",
        description: "Event Mania is a one-stop platform designed to simplify event management for colleges and students. Whether you're a student looking for exciting events to join or a college representative organizing events, Event Mania bridges the gap and creates a seamless experience.",
        techStack: ["React", "Firebase", "HTML/CSS", "Authentication"],
        image: "/images/projects/event-mania.png",
        slug: "event-mania",
        viewSiteLink: "https://ap-event-mania.web.app/"
      },
      {
        title: "YouTube Video and Audio Downloader",
        description: "This Django-based project empowers you to download YouTube videos and audio in your preferred format and resolution. Select quality options and extract audio with just a few clicks.",
        techStack: ["Django", "Python", "HTML/CSS", "ffmpeg", "pytube"],
        image: "/images/projects/youtube-downloader.png",
        slug: "youtube-downloader"
      },
      {
        title: "Pro Reader",
        description: "Pro Reader is a feature-packed Android application that empowers you to handle QR codes, speech, and text with ease. Whether it's scanning, generating, converting, or extracting text, Pro Reader is your ultimate tool.",
        techStack: ["Java/Kotlin", "Firebase", "ML Kit", "Android"],
        image: "/images/projects/pro-reader.png",
        slug: "pro-reader"
      },
      {
        title: "Pin Noter",
        description: "Pin Noter is a React-based note-taking application offering rich text formatting options like bold, underline, and lists. It supports offline caching for seamless note-taking without logging in and automatically syncs notes to the cloud upon login.",
        techStack: ["React.js", "Firebase", "CSS3", "React-dom"],
        image: "/images/projects/pin-noter.png",
        slug: "pin-noter",
        viewSiteLink: "https://pin-noter.netlify.app/"
      },
      {
        title: "Employee Record System",
        description: "A comprehensive web-based employee management system built with Django, designed to streamline employee data management for organizations. Features dual interface system with admin and employee panels, profile management, and role-based authentication.",
        techStack: ["Django", "Python", "MySQL", "Bootstrap", "JavaScript"],
        image: "/images/projects/employee-record-system.png",
        slug: "employee-record-system"
      }
    ]
  };

  return (
    <main className="min-h-screen pt-20 bg-white dark:bg-black">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-[100] bg-white/90 dark:bg-black/90 shadow-md backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center space-x-4">
              <Link href="/" className={`text-lg md:text-xl font-bold tracking-tight ${getThemeClass('text')}`}>
                Kushyanth Pothineni
              </Link>
            </div>
            <Link
              href="/"
              className={`inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base ${getThemeClass('bg')} bg-opacity-10 hover:bg-opacity-20 backdrop-blur-sm transition-colors ${getThemeClass('text')} rounded-md`}
            >
              <svg className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </nav>      {/* Projects Header */}
      <section className="py-8 md:py-16 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">All <span className={getThemeClass('text')}>Projects</span></h1>
            <div className={`h-1 w-20 ${getThemeClass('bg')} mx-auto mb-6`}></div>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-white">
              Explore all of my projects. Each one was built to solve real-world problems and showcase different technologies.
            </p>
          </MotionDiv>
        </div>
      </section>      {/* Projects Grid */}
      <section className="py-12 md:py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userData.projects.map((project, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true, amount: 0.2 }}
                className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48 md:h-64">
                  <Image
                    src={project.image}
                    alt={project.title}
                    layout="fill"
                    className="object-contain bg-gray-50 dark:bg-gray-900"
                  />
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{project.title}</h3>
                  <p className="text-gray-600 dark:text-white mb-4 line-clamp-3 h-[72px]">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1 ${getThemeClass('bg')} bg-opacity-10 dark:bg-opacity-20 ${getThemeClass('text')} rounded-full text-sm`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <Link
                      href={`/projects/${project.slug}`}
                      className={`inline-flex items-center px-4 py-2 bg-opacity-10 ${getThemeClass('bg')} ${getThemeClass('text')} rounded-md transition-colors duration-300 transform hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-${currentTheme}-500 focus:ring-offset-2`}
                    >
                      <span>View Details</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                    {project.viewSiteLink && (
                      <a
                        href={project.viewSiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-gray-200/50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300/50 dark:hover:bg-gray-700/40 transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:ring-offset-2"
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
        </div>
      </section>
      <Footer currentTheme={currentTheme} />
    </main>
  );
}
