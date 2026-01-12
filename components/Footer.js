'use client';

import { usePathname, useRouter } from 'next/navigation';
import styles from './Footer.module.css';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const currentYear = new Date().getFullYear();
// Helper to split text into characters
const SplitText = ({ children }) => {
    return children.split('').map((char, index) => (
        <span key={index} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
            {char}
        </span>
    ));
};

export default function Footer() {
    const container = useRef(null);
    const isInView = useInView(container, { once: true, margin: "-100px" });
    const pathname = usePathname();
    const router = useRouter();

    const phrase = "Let's Work Together";

    const scrollToContact = (e) => {
        e.preventDefault();

        // If on home page or about page, scroll to contact form
        if (pathname === '/' || pathname === '/about') {
            const contactSection = document.getElementById('contact-form');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // If on any other page, navigate to home with hash
            router.push('/#contact-form');
        }
    };

    return (
        <footer className={styles.footer} id="contact" ref={container}>
            <div className={styles.top}>
                <h2 className={styles.ctaText}>
                    {phrase.split(" ").map((word, i) => (
                        <div key={i} style={{ display: 'inline-block', marginRight: '0.25em', overflow: 'hidden', verticalAlign: 'bottom' }}>
                            <motion.span
                                initial={{ y: "100%" }}
                                animate={isInView ? { y: "0%" } : {}}
                                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.33, 1, 0.68, 1] }}
                                style={{ display: 'inline-block' }}
                            >
                                {word}
                            </motion.span>
                        </div>
                    ))}
                </h2>

                <motion.a
                    href="#contact-form"
                    className={styles.button}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    onClick={scrollToContact}
                >
                    Get in touch
                </motion.a>
            </div>

            <div className={styles.bottom}>
                <div className={styles.column}>
                    <h4>Contact info</h4>
                    <a href="mailto:pothineni.kushyanth@gmail.com">pothineni.kushyanth@gmail.com</a>
                    <a href="tel:+918125144235">+91 8125144235</a>
                </div>

                <div className={styles.column}>
                    <h4>Socials</h4>
                    <a href="https://www.instagram.com/kushyanthpothineni.21?igsh=YTh5MXZ0MnliMmVi">Instagram</a>
                    <a href="https://www.linkedin.com/in/kushyanth/">Linkedin</a>
                    <a href="https://github.com/kushyanthpothi">Github</a>
                    <a href="https://x.com/KushyanthPothi1">X</a>
                </div>

                <div className={styles.copyright}>
                    ©{currentYear} Kushyanth Pothineni
                </div>
            </div>
        </footer>
    );
}
