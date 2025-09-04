'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { themeClass, loadDarkMode } from '../../../utils/theme';
import Footer from '../../../components/Footer';

export default function ProjectClientPage({ project }) {
  const [currentTheme, setCurrentTheme] = useState('blue');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load theme and dark mode from localStorage on component mount
    const savedTheme = localStorage.getItem('siteTheme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
    
    // Load and apply dark mode
    const darkModeEnabled = loadDarkMode();
    setIsDarkMode(darkModeEnabled);
    
    // Force scroll to top when component mounts (for project pages)
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
      
      // Listen for storage changes to sync dark mode across tabs
      const handleStorageChange = (e) => {
        if (e.key === 'darkMode' || e.type === 'storage') {
          const darkModeEnabled = loadDarkMode();
          setIsDarkMode(darkModeEnabled);
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearTimeout(scrollTimer);
        clearTimeout(backupScrollTimer);
      };
    }
  }, []);

  // Additional useEffect to ensure scroll to top after project data is loaded
  useEffect(() => {
    if (project && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [project]);

  // Use theme utility function with current theme
  const getThemeClass = (type) => {
    return themeClass(type, currentTheme);
  };

  return (
    <main className="min-h-screen pt-20 bg-white dark:bg-black">
      {/* Navigation Bar */}
      <nav className="fixed w-full top-0 z-[100] bg-white/90 dark:bg-black/90 shadow-md backdrop-blur-sm">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
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
              Back
            </Link>
          </div>
        </div>
      </nav>      {/* Project Header Section */}
      <section className="py-8 md:py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-full mx-auto">
            <div className="flex flex-col md:flex-row md:items-start md:space-x-8 lg:space-x-12">
              <div className="flex-1 mt-8 md:mb-0 pr-[40px] -ml-[50px]">
                <h1 className="text-2xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">{project.title}</h1>
                {project.tagline && (
                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-medium mb-4">{project.tagline}</p>
                )}
                <div className={`h-1 w-20 mb-6 ${getThemeClass('bg')}`}></div>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href={project.projectLink} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center px-6 py-2 ${getThemeClass('bg')} bg-opacity-10 hover:bg-opacity-20 backdrop-blur-sm transition-colors ${getThemeClass('text')} rounded-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    View on GitHub
                  </a>
                  
                  {project.viewSiteLink && (
                    <a 
                      href={project.viewSiteLink} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center px-6 py-2 ${getThemeClass('bg')} bg-opacity-10 hover:bg-opacity-20 backdrop-blur-sm transition-colors ${getThemeClass('text')} rounded-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 16.057v-3.057h2.994c-.059 1.143-.212 2.24-.456 3.279-.823-.12-1.674-.188-2.538-.222zm1.957 2.162c-.499 1.33-1.159 2.497-1.957 3.456v-3.62c.666.028 1.319.081 1.957.164zm-1.957-7.219v-3.015c.868-.034 1.721-.103 2.548-.224.238 1.027.389 2.111.446 3.239h-2.994zm0-5.014v-3.661c.806.969 1.471 2.15 1.971 3.496-.642.084-1.3.137-1.971.165zm2.703-3.267c1.237.496 2.354 1.228 3.29 2.146-.642.234-1.311.442-2.019.607-.344-.992-.775-1.91-1.271-2.753zm-7.241 13.56c-.244-1.039-.398-2.136-.456-3.279h2.994v3.057c-.865.034-1.714.102-2.538.222zm2.538 1.776v3.62c-.798-.959-1.458-2.126-1.957-3.456.638-.083 1.291-.136 1.957-.164zm-2.994-7.055c.057-1.128.207-2.212.446-3.239.827.121 1.68.19 2.548.224v3.015h-2.994zm1.024-5.179c.5-1.346 1.165-2.527 1.97-3.496v3.661c-.671-.028-1.329-.081-1.97-.165zm-2.005-.35c-.708-.165-1.377-.373-2.018-.607.937-.918 2.053-1.65 3.29-2.146-.496.844-.927 1.762-1.272 2.753zm-.549 1.918c-.264 1.151-.434 2.36-.492 3.611h-3.933c.165-1.658.739-3.197 1.617-4.518.88.361 1.816.67 2.808.907zm.009 9.262c-.988.236-1.92.542-2.797.9-.89-1.328-1.471-2.879-1.637-4.551h3.934c.058 1.265.231 2.488.5 3.651zm.553 1.917c.342.976.768 1.881 1.257 2.712-1.223-.49-2.326-1.211-3.256-2.115.636-.229 1.299-.435 1.999-.597zm9.924 0c.7.163 1.362.367 1.999.597-.931.903-2.034 1.625-3.257 2.116.489-.832.915-1.737 1.258-2.713zm.553-1.917c.27-1.163.442-2.386.501-3.651h3.934c-.167 1.672-.748 3.223-1.638 4.551-.877-.358-1.81-.664-2.797-.9zm.501-5.651c-.058-1.251-.229-2.46-.492-3.611.992-.237 1.929-.546 2.809-.907.877 1.321 1.451 2.86 1.616 4.518h-3.933z"/>
                      </svg>
                      View Demo
                    </a>
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="relative w-full h-48 md:h-[400px] rounded-lg overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    priority
                    className="rounded-lg object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details Section */}
      <section className="py-8 md:py-10 bg-white dark:bg-black">
        <div className="max-w-full mx-auto px-4 sm:px-14 lg:px-16">
          {/* Project Overview */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">Project Overview</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              {project.overview.map((paragraph, index) => (
                <p key={index} className="text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Problem Statement */}
          {project.problemStatement && (
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">Problem Statement</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                {project.problemStatement.map((paragraph, index) => (
                  <p key={index} className="text-lg leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Solution / What You Built */}
          {project.solution && (
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">Solution / What You Built</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                {project.solution.map((paragraph, index) => (
                  <p key={index} className="text-lg leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Tech Stack */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">Tech Stack</h2>
            <div className="flex flex-wrap gap-3">
              {project.tools.map((tool, index) => (
                <span
                  key={index}
                  className={`px-4 py-2 ${getThemeClass('bg')} bg-opacity-10 hover:bg-opacity-20 backdrop-blur-sm transition-colors ${getThemeClass('text')} rounded-full text-sm font-medium`}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Features / Highlights */}
          {project.features && (
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">Features / Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 ${getThemeClass('bg')} rounded-full mt-2 flex-shrink-0`}></div>
                    <p className="text-gray-600 dark:text-gray-300">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Challenges & Learnings */}
          {(project.challenges || project.learnings) && (
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">Challenges & Learnings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {project.challenges && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Challenges Faced</h3>
                    <ul className="space-y-2">
                      {project.challenges.map((challenge, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <span className="text-red-500 mt-1">•</span>
                          <p className="text-gray-600 dark:text-gray-300">{challenge}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {project.learnings && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Key Learnings</h3>
                    <ul className="space-y-2">
                      {project.learnings.map((learning, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <span className="text-green-500 mt-1">•</span>
                          <p className="text-gray-600 dark:text-gray-300">{learning}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Results / Impact */}
          {(project.results || project.impact) && (
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">Results / Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {project.results && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Results Achieved</h3>
                    <ul className="space-y-2">
                      {project.results.map((result, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <span className="text-blue-500 mt-1">✓</span>
                          <p className="text-gray-600 dark:text-gray-300">{result}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {project.impact && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Project Impact</h3>
                    <ul className="space-y-2">
                      {project.impact.map((impactItem, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <span className="text-purple-500 mt-1">★</span>
                          <p className="text-gray-600 dark:text-gray-300">{impactItem}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Demo Links */}
          {project.demoLinks && project.demoLinks.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">Demo Links</h2>
              <div className="flex flex-wrap gap-4">
                {project.demoLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center px-6 py-3 ${getThemeClass('bg')} bg-opacity-10 hover:bg-opacity-20 backdrop-blur-sm transition-colors ${getThemeClass('text')} rounded-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                  >
                    <span>{link.name}</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Screenshots / GIFs */}
          {project.screenshots && project.screenshots.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">Screenshots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.screenshots.map((screenshot, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={screenshot}
                      alt={`Screenshot ${index + 1}`}
                      width={600}
                      height={400}
                      className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          {project.cta && (
            <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">{project.cta.text}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Interested in exploring this project further? Check out the live demo or view the source code.
              </p>
              <a
                href={project.cta.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center px-8 py-4 ${getThemeClass('bg')} bg-opacity-10 hover:bg-opacity-20 backdrop-blur-sm transition-colors ${getThemeClass('text')} rounded-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 text-lg font-semibold`}
              >
                <span>{project.cta.buttonText}</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </section>

      <Footer showQuickLinks={true} />
    </main>
  );
}
