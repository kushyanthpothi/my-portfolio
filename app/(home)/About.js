'use client';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './About.module.css';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Instagram, Github, Linkedin } from 'lucide-react';

export default function About() {
    return (
        <section className={styles.section} id="about">
            <div className={styles.container}>
                <h2 className={styles.title}>ABOUT ME</h2>

                {/* Target container for floating profile docking */}
                <div className={styles.profileTarget}></div>

                <div className={styles.contentWrapper}>
                    <div className={styles.contentLeft}>
                        <div className={styles.bio}>
                            <Paragraph />
                        </div>

                        <div className={styles.statsContainer}>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>{
                                    (() => {
                                        const startDate = new Date('2025-06-16');
                                        const currentDate = new Date();
                                        const diffTime = Math.abs(currentDate - startDate);
                                        const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
                                        return diffYears < 1 ? "<1" : `${Math.floor(diffYears)}+`;
                                    })()
                                }</span>
                                <span className={styles.statLabel}>Years of Experience</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>10+</span>
                                <span className={styles.statLabel}>Completed Projects</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>AI</span>
                                <span className={styles.statLabel}>Agentic Systems Focus</span>
                            </div>
                        </div>

                        <div className={styles.contactContainer}>
                            <div className={styles.contactItem}>
                                <span className={styles.contactLabel}>Call Today :</span>
                                <span className={styles.contactValue}>+91 8125144235</span>
                            </div>
                            <div className={styles.contactItem}>
                                <span className={styles.contactLabel}>Email :</span>
                                <span className={styles.contactValue}>pothineni.kushyanth@gmail.com</span>
                            </div>
                        </div>

                        <div className={styles.socialsContainer}>
                            <a href="https://x.com/KushyanthPothi1" target="_blank" rel="noopener noreferrer">
                                <XIcon className={styles.icon} />
                            </a>
                            <a href="https://www.instagram.com/kushyanthpothineni.21?igsh=YTh5MXZ0MnliMmVi" target="_blank" rel="noopener noreferrer">
                                <Instagram className={styles.icon} />
                            </a>
                            <a href="https://github.com/kushyanthpothi" target="_blank" rel="noopener noreferrer">
                                <Github className={styles.icon} />
                            </a>
                            <a href="https://www.linkedin.com/in/kushyanth/" target="_blank" rel="noopener noreferrer">
                                <Linkedin className={styles.icon} />
                            </a>
                        </div>

                        <div className={styles.actionContainer}>
                            <Link href="/about">
                                <button className={styles.ctaButton}>MY STORY</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Paragraph() {
    const container = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start 0.85", "start 0.30"]
    });

    const words = [
        "I", "am", "a",
        { text: "full stack", highlight: true },
        { text: "software developer", highlight: true },
        "with", "hands-on", "experience", "in", "building", "scalable", "backend", "systems", "and", "modern", "web", "applications.",
        "I", "enjoy", "turning", "complex", "ideas", "into", "clean,", "efficient,", "and", "reliable", "solutions", "using", "Java,", "Python,", "and", "JavaScript.",
        "Currently", "based", "in", "India", "and", "focused", "on", "backend", "engineering,", "APIs,", "and", "cloud-native", "development."
    ];

    // Flatten logic slightly to handle the highlighted phrases as individual words for smoother animation if desired,
    // or keep them as blocks. To match the "word by word" feel, it's better to split highlighted phrases too if they are long.
    // However, the user asked for "paragraph text" reveal. Let's split strictly by space for the reveal effect,
    // but we need to reconstruction the highlight span.

    // Easier approach: Just write the text and custom parse it or wrapper components.
    // Let's stick to the "words" approach where we iterate and map.

    const content = [
        { text: "Hi,", highlight: false },
        { text: "I'm", highlight: false },
        { text: "Kushyanth", highlight: true },
        { text: "—", highlight: false },
        { text: "a", highlight: false },
        { text: "Software", highlight: false },
        { text: "Development", highlight: false },
        { text: "Engineer", highlight: false },
        { text: "passionate", highlight: false },
        { text: "about", highlight: false },
        { text: "building", highlight: false },
        { text: "scalable", highlight: true },
        { text: "backend", highlight: true },
        { text: "systems,", highlight: true },
        { text: "robust", highlight: false },
        { text: "REST", highlight: false },
        { text: "APIs,", highlight: false },
        { text: "and", highlight: false },
        { text: "automating", highlight: false },
        { text: "workflows.", highlight: false },
        { text: "I", highlight: false },
        { text: "specialize", highlight: false },
        { text: "in", highlight: false },
        { text: "Java,", highlight: true },
        { text: "Python,", highlight: true },
        { text: "Spring", highlight: true },
        { text: "Boot,", highlight: true },
        { text: "and", highlight: false },
        { text: "cloud", highlight: false },
        { text: "services", highlight: false },
        { text: "like", highlight: false },
        { text: "AWS.", highlight: true },
        { text: "Currently,", highlight: false },
        { text: "I'm", highlight: false },
        { text: "developing", highlight: false },
        { text: "backend", highlight: false },
        { text: "infrastructure", highlight: false },
        { text: "for", highlight: false },
        { text: "Agentic", highlight: true },
        { text: "AI", highlight: true },
        { text: "systems", highlight: true },
        { text: "at", highlight: false },
        { text: "Ninjacart.", highlight: true },
    ];

    return (
        <p ref={container} className={styles.paragraph}>
            {content.map((word, i) => {
                const start = i / content.length;
                const end = start + (1 / content.length);
                return <Word key={i} progress={scrollYProgress} range={[start, end]} highlight={word.highlight} isMobile={isMobile}>{word.text}</Word>;
            })}
        </p>
    )
}

const Word = ({ children, progress, range, highlight, isMobile }) => {
    const opacity = useTransform(progress, range, [0, 1]);
    const finalOpacity = isMobile ? 1 : opacity;
    return (
        <span className={styles.wordWrapper}>
            <span className={styles.shadow}>{children}</span>
            <motion.span style={{ opacity: finalOpacity }} className={`${highlight ? styles.highlight : ''}`}>
                {children}
            </motion.span>
        </span>
    )
}

const XIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
);
