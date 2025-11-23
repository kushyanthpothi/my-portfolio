'use client';

import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SOCIAL_LINKS, USER_INFO } from '../constants/userData';
import { themeClass as utilThemeClass } from '../utils/theme';
import CalendarScheduler from './CalendarScheduler';
import { useFormSubmission } from '../hooks';

const MotionDiv = motion.div;

function ContactSection({ currentTheme, isDarkMode }) {
    const themeClass = (type) => utilThemeClass(type, currentTheme);
    const [showScheduler, setShowScheduler] = useState(false);

    const {
        formData,
        isSubmitting,
        submitStatus,
        handleInputChange,
        handleSubmit,
    } = useFormSubmission();

    return (
        <section id="contact" className="pt-20 py-20 bg-white dark:bg-black">
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
                                    <p className="text-gray-600 dark:text-gray-300">{USER_INFO.email}</p>
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
                                    <p className="text-gray-600 dark:text-gray-300">{USER_INFO.phone}</p>
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
                                    <p className="text-gray-600 dark:text-gray-300">{USER_INFO.location}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex space-x-6">
                            {Object.entries(SOCIAL_LINKS).map(([platform, link]) => (
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
                        </div>
                    </MotionDiv>

                    <MotionDiv
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true, amount: 0.2 }}
                        className="relative"
                    >
                        {/* Toggle Button */}
                        <button
                            onClick={() => setShowScheduler(!showScheduler)}
                            className={`absolute -top-4 right-0 z-10 px-4 py-2 rounded-full ${themeClass('bg')} text-white hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2`}
                            title={showScheduler ? 'Switch to Contact Form' : 'Switch to Calendar'}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {showScheduler ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                )}
                            </svg>
                            <span className="text-sm font-semibold">
                                {showScheduler ? 'Contact Form' : 'Schedule Meeting'}
                            </span>
                        </button>

                        {/* Contact Form or Calendar Scheduler */}
                        <div className="relative">
                            <AnimatePresence mode="wait">
                                {showScheduler ? (
                                    <motion.div
                                        key="scheduler"
                                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                        transition={{
                                            duration: 0.4,
                                            ease: [0.4, 0, 0.2, 1]
                                        }}
                                    >
                                        <CalendarScheduler currentTheme={currentTheme} isDarkMode={isDarkMode} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="contact-form"
                                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                        transition={{
                                            duration: 0.4,
                                            ease: [0.4, 0, 0.2, 1]
                                        }}
                                    >
                                        <form onSubmit={handleSubmit} className="bg-white dark:bg-black p-4 md:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
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
                                                        className={`block w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-transparent focus:border-${currentTheme}-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-${currentTheme}-500 outline-none transition-colors duration-200`}
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
                                                        className={`block w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-transparent focus:border-${currentTheme}-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-${currentTheme}-500 outline-none transition-colors duration-200`}
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
                                                        className={`block w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-transparent focus:border-${currentTheme}-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-${currentTheme}-500 outline-none transition-colors duration-200 resize-none`}
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
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </MotionDiv>
                </div>
            </div>
        </section>
    );
}

export default memo(ContactSection);
