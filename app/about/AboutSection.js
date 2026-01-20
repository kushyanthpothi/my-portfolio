'use client';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './AboutSection.module.css';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Instagram, Github, Linkedin, FileText } from 'lucide-react';
import ThemeSwitch from '../../components/ThemeSwitch';

// Initial empty states, data fetched from Firestore
const services = [];
const experiences = [];
const realTechStack = [];


export default function AboutSection() {
    const servicesRef = useRef(null);
    const experienceRef = useRef(null);
    const techStackRef = useRef(null);
    const [activeSection, setActiveSection] = useState('about'); // 'about', 'services', 'experience', 'tech-stack'
    const { scrollY } = useScroll();

    // State for data
    const [servicesData, setServicesData] = useState(services);
    const [experiencesData, setExperiencesData] = useState(experiences);
    const [techStackData, setTechStackData] = useState(realTechStack);

    const [resumeUrl, setResumeUrl] = useState(null);

    // Import helper functions dynamically or use them if available in scope
    // Assuming they are imported at the top. I need to add imports first.

    useEffect(() => {
        const loadData = async () => {
            // Dynamic import to avoid SSR issues if any, or just standard import
            try {
                const { fetchServices, fetchExperiences, fetchTechStack, getSettings } = await import('../../lib/firestoreUtils');

                const fetchedServices = await fetchServices();
                if (fetchedServices.length > 0) setServicesData(fetchedServices);

                const fetchedExperiences = await fetchExperiences();
                if (fetchedExperiences.length > 0) setExperiencesData(fetchedExperiences);

                const fetchedTechStack = await fetchTechStack();
                if (fetchedTechStack.length > 0) setTechStackData(fetchedTechStack);

                const profileData = await getSettings('profile');
                if (profileData && profileData.resumeUrl) setResumeUrl(profileData.resumeUrl);

            } catch (error) {
                console.error("Failed to load Firestore data:", error);
                // Fallback to initial hardcoded data is automatic since state init
            }
        };

        loadData();
    }, []);



    useMotionValueEvent(scrollY, "change", (latest) => {
        const servicesEl = servicesRef.current;
        const experienceEl = experienceRef.current;

        if (servicesEl && experienceEl) {
            const servicesTop = servicesEl.getBoundingClientRect().top;
            const experienceTop = experienceEl.getBoundingClientRect().top;
            const techStackTop = techStackRef.current ? techStackRef.current.getBoundingClientRect().top : Infinity;
            const threshold = window.innerHeight * 0.5; // Trigger point

            if (techStackTop < threshold) {
                setActiveSection('tech-stack');
            } else if (experienceTop < threshold) {
                setActiveSection('experience');
            } else if (servicesTop < threshold) {
                setActiveSection('services');
            } else {
                setActiveSection('about');
            }
        }
    });

    const [selected, setSelected] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggle = (i) => {
        setSelected(selected === i ? null : i);
    };

    const textReveal = {
        initial: { y: "100%" },
        animate: {
            y: "0%",
            transition: { duration: 1.5, ease: [0.33, 1, 0.68, 1] }
        }
    };

    return (
        <div className={styles.aboutPage}>
            <div className={styles.container}>
                <div className={styles.mainGrid}>

                    {/* Left Column: Scrollable Content */}
                    <div className={styles.leftColumn}>

                        {/* Part 1: About Me (formerly Hero) */}
                        <div className={styles.aboutContent}>
                            <div style={{ overflow: 'hidden', paddingBottom: '8px' }}>
                                <motion.h1
                                    className={styles.heroTitle}
                                    variants={textReveal}
                                    initial="initial"
                                    whileInView="animate"
                                    viewport={{ once: true }}
                                >
                                    ABOUT ME
                                </motion.h1>
                            </div>

                            <div style={{ overflow: 'hidden', paddingBottom: '8px' }}>
                                <motion.h2
                                    className={styles.name}
                                    variants={textReveal}
                                    initial="initial"
                                    whileInView="animate"
                                    viewport={{ once: true }}
                                    transition={{ ...textReveal.animate.transition, delay: 0.1 }}
                                >
                                    KUSHYANTH POTHINENI
                                </motion.h2>
                            </div>

                            <div className={styles.bioText}>
                                <p>
                                    I'm a Software Development Engineer passionate about building
                                    scalable backend systems, robust REST APIs, and automating workflows.
                                </p>
                                <p>
                                    With a strong foundation in Java, Python, and Spring Boot, I bring
                                    ideas to life through thoughtful architecture, efficient code, and
                                    cloud-native solutions.
                                </p>
                            </div>

                            {isMobile && (
                                <div className={styles.mobileProfileImageContainer}>
                                    <img
                                        src="https://i.ibb.co/G39RwbX6/Profile-Photo-small.jpg"
                                        alt="About Me"
                                        className={styles.mobileImage}
                                    />
                                </div>
                            )}

                            <div className={styles.socialsContainer}>
                                <a href="https://x.com/KushyanthPothi1" target="_blank" rel="noopener noreferrer" aria-label="X/Twitter">
                                    <XIcon className={styles.socialIcon} />
                                </a>
                                <a href="https://www.instagram.com/kushyanthpothineni.21?igsh=YTh5MXZ0MnliMmVi" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                    <Instagram className={styles.socialIcon} />
                                </a>
                                <a href="https://github.com/kushyanthpothi" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                                    <Github className={styles.socialIcon} />
                                </a>
                                <a href="https://www.linkedin.com/in/kushyanth/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                    <Linkedin className={styles.socialIcon} />
                                </a>
                                {resumeUrl && (
                                    <Link
                                        href="/resume"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Resume"
                                        title="View Resume"
                                    >
                                        <FileText className={styles.socialIcon} />
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Part 2: Services List */}
                        <div ref={servicesRef} className={styles.servicesContent}>
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

                            {isMobile && (
                                <div className={styles.mobileImageContainer}>
                                    <img
                                        src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80"
                                        alt="Services"
                                        className={styles.mobileImage}
                                    />
                                </div>
                            )}

                            <div className={styles.list}>
                                {servicesData.map((service, index) => (
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
                                ))}
                            </div>
                        </div>

                        {/* Part 3: Experience */}
                        <div ref={experienceRef} className={styles.experienceContent}>
                            <motion.h2
                                className={styles.header}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                DISCOVER MY JOURNEY
                            </motion.h2>

                            {isMobile && (
                                <div className={styles.mobileImageContainer}>
                                    <img
                                        src="https://media.istockphoto.com/id/1324905580/photo/concept-of-creativity-inspiration-ideas.jpg?s=612x612&w=0&k=20&c=i58rT6pz7CYPE9h4p7da4YuJkn3JDF6EUKIZPaa1wzA="
                                        alt="Experience"
                                        className={styles.mobileImage}
                                    />
                                </div>
                            )}

                            <ExperienceList experiences={experiencesData} />
                        </div>

                        {/* Part 4: Tech Stack */}
                        <div ref={techStackRef} className={styles.techStackContent}>
                            <motion.h2
                                className={styles.header}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                MY TECH STACK
                            </motion.h2>

                            {isMobile && (
                                <div className={styles.mobileImageContainer}>
                                    <img
                                        src="https://cdn.sanity.io/images/599r6htc/regionalized/2d98f37b14bfabde217cd89b38dd0b3481c5ef7f-1108x1108.png"
                                        alt="Tech Stack"
                                        className={styles.mobileImage}
                                    />
                                </div>
                            )}

                            <div className={styles.aboutText}>
                                <p>
                                    I build with intention. Cursor for fast, AI-integrated
                                    development. IntelliJ for robust backend engineering.
                                    Claude and n8n for automation and intelligence.
                                </p>
                            </div>

                            <div className={styles.techStackList}>
                                {techStackData.map((tool, index) => (
                                    <div key={index} className={styles.techStackItem}>
                                        <div className={styles.techLogoContainer}>
                                            <img src={tool.logo} alt={tool.name} className={styles.techLogo} />
                                        </div>
                                        <div className={styles.techInfo}>
                                            <h3 className={styles.techName}>{tool.name}</h3>
                                            <p className={styles.techDesc}>{tool.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Sticky Card with Image Swap */}
                    <div className={styles.rightColumn}>
                        <motion.div
                            className={styles.stickyCard}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                        >
                            {/* 1. Portrait Image (Default) */}
                            <motion.div
                                className={styles.imageLayer}
                                animate={{
                                    y: activeSection === 'about' ? "0%" : "-100%",
                                    opacity: activeSection === 'about' ? 1 : 0
                                }}
                                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                            >
                                <img
                                    src="https://i.ibb.co/G39RwbX6/Profile-Photo-small.jpg"
                                    alt="About Me"
                                    className={styles.cardImage}
                                />
                            </motion.div>

                            {/* 2. Services Image */}
                            <motion.div
                                className={styles.imageLayer}
                                initial={{ y: "100%", opacity: 0 }}
                                animate={{
                                    y: activeSection === 'services' ? "0%" : (activeSection === 'about' ? "100%" : "-100%"), // Below if About, Above if Experience
                                    opacity: activeSection === 'services' ? 1 : 0
                                }}
                                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80"
                                    alt="Services"
                                    className={styles.cardImage}
                                />
                            </motion.div>

                            {/* 3. Experience Image */}
                            <motion.div
                                className={styles.imageLayer}
                                initial={{ y: "100%", opacity: 0 }}
                                animate={{
                                    y: activeSection === 'experience' ? "0%" : (['about', 'services'].includes(activeSection) ? "100%" : "-100%"),
                                    opacity: activeSection === 'experience' ? 1 : 0
                                }}
                                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                            >
                                <img
                                    src="https://media.istockphoto.com/id/1324905580/photo/concept-of-creativity-inspiration-ideas.jpg?s=612x612&w=0&k=20&c=i58rT6pz7CYPE9h4p7da4YuJkn3JDF6EUKIZPaa1wzA="
                                    alt="Experience"
                                    className={styles.cardImage}
                                />
                            </motion.div>

                            {/* 4. Tech Stack Image */}
                            <motion.div
                                className={styles.imageLayer}
                                initial={{ y: "100%", opacity: 0 }}
                                animate={{
                                    y: activeSection === 'tech-stack' ? "0%" : "100%",
                                    opacity: activeSection === 'tech-stack' ? 1 : 0
                                }}
                                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                            >
                                <img
                                    src="https://cdn.sanity.io/images/599r6htc/regionalized/2d98f37b14bfabde217cd89b38dd0b3481c5ef7f-1108x1108.png"
                                    alt="Tech Stack"
                                    className={styles.cardImage}
                                />
                            </motion.div>
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Theme Switch */}
            <ThemeSwitch />
        </div >
    );
}

// Expandable Experience List Component
const ExperienceList = ({ experiences }) => {
    const [showAll, setShowAll] = useState(false);

    // Sort by order (lower numbers first) and show only first 2 if not expanded
    const sortedExperiences = experiences.sort((a, b) => (a.order || 0) - (b.order || 0));
    const displayedExperiences = showAll ? sortedExperiences : sortedExperiences.slice(0, 2);
    const hasMore = sortedExperiences.length > 2;

    return (
        <div>
            <div className={`${styles.experienceList} ${showAll ? styles.experienceListExpanded : ''}`}>
                {displayedExperiences.map((exp) => (
                    <div key={exp.id} className={styles.experienceItem}>
                        <div className={styles.expRoleWrapper}>
                            <h3 className={styles.expRole}>{exp.role}</h3>
                            <p className={styles.expCompany}>{exp.company}</p>
                        </div>
                        <div className={styles.expDetails}>
                            <span className={styles.expPeriod}>{exp.period}</span>
                            <p className={styles.expDesc}>{exp.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {hasMore && (
                <motion.button
                    className={styles.showMoreButton}
                    onClick={() => setShowAll(!showAll)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {showAll ? 'Show Less' : `Show More (${sortedExperiences.length - 2} more)`}
                </motion.button>
            )}
        </div>
    );
};

const XIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
);
