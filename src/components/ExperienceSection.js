import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const ExperienceSection = ({ currentTheme, themeClass }) => {
  return (
    <section
      id="experience"
      className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-3 bg-red-500 rounded-full px-5 py-2 mb-6 shadow-sm">
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="text-sm font-medium text-black">
              Professional Journey
            </span>
          </div>
          <h2 className={`text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 to-${currentTheme}-600 dark:from-white dark:to-${currentTheme}-400 bg-clip-text text-transparent`}>
            My Experience
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Crafting innovative solutions with cutting-edge technologies to drive impact and growth.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className={`hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-${currentTheme}-300 to-${currentTheme}-500 dark:from-${currentTheme}-600 dark:to-${currentTheme}-800 rounded-full z-0`} />

          {/* Timeline Items */}
          <div className="space-y-12 md:space-y-20">
            {/* NinjaCart Full-time Role */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 80, damping: 15 }}
              viewport={{ once: true, amount: 0.3 }}
              className="relative flex items-center"
            >
              {/* Timeline Dot */}
              <div className={`absolute left-1/2 transform -translate-x-1/2 w-5 h-5 md:w-7 md:h-7 bg-gradient-to-br from-${currentTheme}-300 to-${currentTheme}-500 dark:from-${currentTheme}-600 dark:to-${currentTheme}-800 rounded-full border-3 border-white dark:border-gray-900 shadow-md z-10 flex items-center justify-center`}>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>

              {/* Content Card */}
              <div className="w-full md:w-5/12 md:pr-6">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100/50 dark:border-gray-700/50">
                  <div className="flex items-start space-x-4 mb-5">
                    <div className={`w-12 h-12 bg-gradient-to-br from-${currentTheme}-200 to-${currentTheme}-400 dark:from-${currentTheme}-700 dark:to-${currentTheme}-900 rounded-lg p-2 shadow-sm`}>
                      <Image
                        src="https://i.ibb.co/tMBZRQY6/images-2.png"
                        alt="NinjaCart Logo"
                        width={48}
                        height={48}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Software Development Engineer
                      </h3>
                      <p className={`${themeClass('text', currentTheme)} font-medium`}>
                        NinjaCart • Bangalore
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        June 2025 - Present
                      </p>
                    </div>
                    <span className="bg-red-500 text-black px-3 py-1 rounded-full text-xs font-medium">
                      Current
                    </span>
                  </div>
                  <ul className="space-y-2 mb-5">
                    <li

 className="flex items-center space-x-2">
                      <div className={`w-2 h-2 bg-${currentTheme}-600 rounded-full`} />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Developing AI-powered agents for supply chain optimization
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className={`w-2 h-2 bg-${currentTheme}-500 rounded-full`} />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Building scalable RESTful APIs with Spring Boot
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className={`w-2 h-2 bg-${currentTheme}-700 rounded-full`} />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Microservices architecture implementation
                      </span>
                    </li>
                  </ul>
                  <div className="flex space-x-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                      <p className={`text-lg font-semibold ${themeClass('text', currentTheme)}`}>
                        45%
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        API Response ↑
                      </p>
                    </div>
                    <div className="text-center">
                      <p className={`text-lg font-semibold ${themeClass('text', currentTheme)}`}>
                        3+
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        New Features
                      </p>
                    </div>
                    <div className="text-center">
                      <p className={`text-lg font-semibold ${themeClass('text', currentTheme)}`}>
                        20%
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Efficiency ↑
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* NinjaCart Internship */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 80, damping: 15 }}
              viewport={{ once: true, amount: 0.3 }}
              className="relative flex items-center justify-end"
            >
              {/* Timeline Dot */}
              <div className={`absolute left-1/2 transform -translate-x-1/2 w-5 h-5 md:w-7 md:h-7 bg-gradient-to-br from-${currentTheme}-300 to-${currentTheme}-500 dark:from-${currentTheme}-600 dark:to-${currentTheme}-800 rounded-full border-3 border-white dark:border-gray-900 shadow-md z-10 flex items-center justify-center`}>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>

              {/* Content Card */}
              <div className="w-full md:w-5/12 md:pl-6">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100/50 dark:border-gray-700/50">
                  <div className="flex items-start space-x-4 mb-5">
                    <div className={`w-12 h-12 bg-gradient-to-br from-${currentTheme}-200 to-${currentTheme}-400 dark:from-${currentTheme}-700 dark:to-${currentTheme}-900 rounded-lg p-2 shadow-sm`}>
                      <Image
                        src="https://i.ibb.co/tMBZRQY6/images-2.png"
                        alt="NinjaCart Logo"
                        width={48}
                        height={48}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Software Developer Intern
                      </h3>
                      <p className={`${themeClass('text', currentTheme)} font-medium`}>
                        NinjaCart • Bangalore
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        April 2025 - May 2025
                      </p>
                    </div>
                    <span className="bg-red-500 text-black px-3 py-1 rounded-full text-xs font-medium">
                      Completed
                    </span>
                  </div>
                  <ul className="space-y-2 mb-5">
                    <li className="flex items-center space-x-2">
                      <div className={`w-2 h-2 bg-${currentTheme}-600 rounded-full`} />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        RESTful API development with Spring Boot
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className={`w-2 h-2 bg-${currentTheme}-500 rounded-full`} />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Database optimization for MySQL & PostgreSQL
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className={`w-2 h-2 bg-${currentTheme}-700 rounded-full`} />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        AI integration with RAG models
                      </span>
                    </li>
                  </ul>
                  <div className="flex space-x-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                      <p className={`text-lg font-semibold ${themeClass('text', currentTheme)}`}>
                        35%
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Performance ↑
                      </p>
                    </div>
                    <div className="text-center">
                      <p className={`text-lg font-semibold ${themeClass('text', currentTheme)}`}>
                        200+
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Requests/sec
                      </p>
                    </div>
                    <div className="text-center">
                      <p className={`text-lg font-semibold ${themeClass('text', currentTheme)}`}>
                        45%
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Accuracy ↑
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Blackbucks Experience */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 80, damping: 15 }}
              viewport={{ once: true, amount: 0.3 }}
              className="relative flex items-center"
            >
              {/* Timeline Dot */}
              <div className={`absolute left-1/2 transform -translate-x-1/2 w-5 h-5 md:w-7 md:h-7 bg-gradient-to-br from-${currentTheme}-300 to-${currentTheme}-500 dark:from-${currentTheme}-600 dark:to-${currentTheme}-800 rounded-full border-3 border-white dark:border-gray-900 shadow-md z-10 flex items-center justify-center`}>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>

              {/* Content Card */}
              <div className="w-full md:w-5/12 md:pr-6">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100/50 dark:border-gray-700/50">
                  <div className="flex items-start space-x-4 mb-5">
                    <div className={`w-12 h-12 bg-gradient-to-br from-${currentTheme}-200 to-${currentTheme}-400 dark:from-${currentTheme}-700 dark:to-${currentTheme}-900 rounded-lg p-2 shadow-sm`}>
                      <Image
                        src="https://i.ibb.co/HLsn4PN8/images-3.png"
                        alt="Blackbucks Engineers Logo"
                        width={48}
                        height={48}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Full Stack Developer Intern
                      </h3>
                      <p className={`${themeClass('text', currentTheme)} font-medium`}>
                        Blackbucks Engineers • Hyderabad
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        May 2024 - July 2024
                      </p>
                    </div>
                    <span className="bg-red-500 text-black px-3 py-1 rounded-full text-xs font-medium">
                      Completed
                    </span>
                  </div>
                  <ul className="space-y-2 mb-5">
                    <li className="flex items-center space-x-2">
                      <div className={`w-2 h-2 bg-${currentTheme}-600 rounded-full`} />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Django web application enhancement
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className={`w-2 h-2 bg-${currentTheme}-500 rounded-full`} />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        RESTful API development with DRF
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className={`w-2 h-2 bg-${currentTheme}-700 rounded-full`} />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        React.js frontend interface revamp
                      </span>
                    </li>
                  </ul>
                  <div className="flex space-x-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                      <p className={`text-lg font-semibold ${themeClass('text', currentTheme)}`}>
                        40%
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Efficiency ↑
                      </p>
                    </div>
                    <div className="text-center">
                      <p className={`text-lg font-semibold ${themeClass('text', currentTheme)}`}>
                        30%
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Engagement ↑
                      </p>
                    </div>
                    <div className="text-center">
                      <p className={`text-lg font-semibold ${themeClass('text', currentTheme)}`}>
                        25%
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Faster APIs
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;