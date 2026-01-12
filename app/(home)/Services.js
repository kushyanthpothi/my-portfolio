'use client';

import { useState, useEffect } from 'react';
import styles from './Services.module.css';
import { motion, AnimatePresence } from 'framer-motion';

const services = [
    { id: '01', title: 'System & Backend Architecture', desc: 'I design and build scalable backend systems using clean architecture principles. This includes REST APIs, database design, authentication, and performance-optimized services that are reliable and easy to maintain.' },
    { id: '02', title: 'Web Application Development', desc: 'I develop end-to-end web applications with modern frontend frameworks and robust backends. From responsive UI to seamless API integration, I ensure the application is fast, secure, and production-ready.' },
    { id: '03', title: 'API & Integration Development', desc: 'I build secure and well-documented APIs and integrate third-party services, payment gateways, and internal tools. I focus on reliability, proper error handling, and scalability for real-world usage.' },
    { id: '04', title: 'Cloud & DevOps Enablement', desc: 'I help deploy and manage applications using cloud platforms and CI/CD pipelines. This includes containerization, environment setup, and monitoring to ensure smooth deployments and high availability.' },
];

export default function Services() {
    const [selected, setSelected] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggle = (i) => {
        setSelected(selected === i ? null : i);
    };

    return (
        <section className={styles.section} id="services">
            <div className={styles.container}>
                {isMobile ? (
                    <h2 className={styles.header}>What I can do for you</h2>
                ) : (
                    <motion.h2
                        className={styles.header}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        What I can do for you
                    </motion.h2>
                )}

                {/* Target container for floating profile docking */}
                <div className={styles.profileTarget}></div>

                <div className={styles.list}>
                    {services.map((service, index) => (
                        isMobile ? (
                            <div
                                key={service.id}
                                className={styles.item}
                                onClick={() => toggle(index)}
                            >
                                <div className={styles.itemHeader}>
                                    <span className={styles.itemNumber}>{service.id}</span>
                                    <h3 className={styles.itemTitle}>{service.title}</h3>
                                    <div
                                        className={styles.arrow}
                                        style={{ transform: selected === index ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Accordion Content with Animation */}
                                <AnimatePresence>
                                    {selected === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            style={{ overflow: 'hidden' }}
                                        >
                                            <p className={styles.itemDesc}>{service.desc}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <motion.div
                                key={service.id}
                                className={styles.item}
                                onClick={() => toggle(index)}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className={styles.itemHeader}>
                                    <span className={styles.itemNumber}>{service.id}</span>
                                    <h3 className={styles.itemTitle}>{service.title}</h3>
                                    <motion.div
                                        animate={{ rotate: selected === index ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={styles.arrow}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </motion.div>
                                </div>

                                {/* Accordion Content */}
                                <AnimatePresence>
                                    {selected === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                                            style={{ overflow: 'hidden' }}
                                        >
                                            <p className={styles.itemDesc}>{service.desc}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )
                    ))}
                </div>
            </div>
        </section>
    );
}
