'use client';

import { memo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PROJECTS } from '../constants/userData';
import { themeClass as utilThemeClass } from '../utils/theme';

const MotionDiv = motion.div;

function ProjectsSection({ currentTheme }) {
    const themeClass = (type) => utilThemeClass(type, currentTheme);

    return (
        <section id="projects" className="pt-20 py-20 bg-white dark:bg-black">
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
                    {PROJECTS.slice(0, 4).map((project, index) => (
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

                {/* View More Button */}
                {PROJECTS.length > 4 && (
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
    );
}

export default memo(ProjectsSection);
