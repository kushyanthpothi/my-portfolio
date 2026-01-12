'use client';

import { memo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SKILL_CATEGORIES } from '../constants/userData';
import { IMAGES } from '../config';
import { themeClass as utilThemeClass } from '../utils/theme';

const MotionDiv = motion.div;

function AboutSection({ currentTheme }) {
    const themeClass = (type) => utilThemeClass(type, currentTheme);

    return (
        <section id="about" className="pt-20 py-20 bg-white dark:bg-black">
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
                                src={IMAGES.PROFILE_ABOUT}
                                alt="Profile Photo"
                                width={400}
                                height={610}
                                className="rounded-2xl shadow-lg object-cover w-[400px] h-[610px] max-w-full"
                            />
                        </div>
                        {/* Right Side: Content */}
                        <div className="w-full md:w-2/3">
                            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-4">
                                Hey, I'm <strong>Kushyanth Pothineni</strong> 👋
                            </p>
                            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-4">
                                I'm a Software Development Engineer at <strong>Ninjacart</strong>, where I focus on building backend infrastructure for Agentic AI systems and automating internal workflows at scale. My work involves crafting robust REST APIs with <strong>Spring Boot</strong>, designing scalable microservices, and integrating AI models into production environments.
                            </p>
                            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-4">
                                I'm passionate about <strong>clean architecture</strong>, <strong>test-driven development</strong>, and enhancing developer experience and system performance. At Ninjacart, I've built solutions like workflow automation with <strong>n8n</strong> and OCR-driven data processing pipelines integrated with machine learning models.
                            </p>
                            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-4">
                                Outside of work, I've shipped several full-stack projects, including:
                            </p>
                            <ul className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-4 space-y-3">
                                <li className="flex items-start">
                                    <span className="text-current mr-3 mt-1 flex-shrink-0">•</span>
                                    <div>
                                        <strong>Event Mania</strong> – An event platform connecting 1000+ students to college organizations, built with <strong>Next.js</strong>, <strong>Firebase</strong>, and <strong>Tailwind</strong>.
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-current mr-3 mt-1 flex-shrink-0">•</span>
                                    <div>
                                        <strong>Instans</strong> – An AI-powered interview preparation tool with end-to-end testing using <strong>Playwright</strong> and <strong>Google Generative AI APIs</strong>.
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-current mr-3 mt-1 flex-shrink-0">•</span>
                                    <div>
                                        <strong>Smart Inventory Tracker</strong> – A warehouse management system deployed on <strong>AWS</strong> with real-time alerts and role-based access control (RBAC).
                                    </div>
                                </li>
                            </ul>
                            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-4">
                                I'm constantly leveling up in cloud platforms (<strong>AWS</strong>, <strong>Docker</strong>), backend systems, and emerging AI tooling. If it's about automation, performance, or real-time systems—I'm all in.
                            </p>
                            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                                Let's build something cool.
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
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-lg transition-shadow duration-300 flex flex-col h-full">
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
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-lg transition-shadow duration-300 flex flex-col h-full">
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
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-lg transition-shadow duration-300 flex flex-col h-full">
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
                        {SKILL_CATEGORIES.map((category, categoryIndex) => (
                            <MotionDiv
                                key={category.category}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                                viewport={{ once: true, amount: 0.2 }}
                                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
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
                                                className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
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
    );
}

export default memo(AboutSection);
