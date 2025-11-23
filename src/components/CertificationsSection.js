'use client';

import { memo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CERTIFICATIONS } from '../constants/userData';
import { FORM_CONFIG } from '../config';
import { themeClass as utilThemeClass } from '../utils/theme';

const MotionDiv = motion.div;

function CertificationsSection({ currentTheme }) {
    const themeClass = (type) => utilThemeClass(type, currentTheme);
    const [showAllCerts, setShowAllCerts] = useState(false);
    const [touchedCertId, setTouchedCertId] = useState(null);

    const handleCertTouchStart = (index) => {
        setTouchedCertId(index);
    };

    const handleCertTouchEnd = () => {
        setTimeout(() => {
            setTouchedCertId(null);
        }, 300);
    };

    return (
        <section id="certifications" className="pt-20 py-20 bg-white dark:bg-gray-900">
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
                    {CERTIFICATIONS.slice(0, showAllCerts ? CERTIFICATIONS.length : FORM_CONFIG.INITIAL_CERTS_DISPLAY).map((cert, index) => (
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

                {CERTIFICATIONS.length > FORM_CONFIG.INITIAL_CERTS_DISPLAY && (
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
    );
}

export default memo(CertificationsSection);
