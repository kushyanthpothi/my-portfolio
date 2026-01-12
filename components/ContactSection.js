'use client';

import React, { useState, useRef } from 'react';
import styles from './ContactSection.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';

// Initialize EmailJS
emailjs.init('FR_bQvDLbvWZSxFRO');

export default function ContactSection() {
    const form = useRef();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        service: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        emailjs.sendForm(
            'service_ab1oioq',
            'template_xwyd7xc',
            form.current,
            { publicKey: 'FR_bQvDLbvWZSxFRO' }
        )
            .then((result) => {
                console.log('SUCCESS!', result.status, result.text);
                setStatus('success');
                setFormData({
                    name: '',
                    email: '',
                    service: '',
                    message: ''
                });
                setTimeout(() => setStatus('idle'), 5000);
            }, (error) => {
                console.error('FAILED...', error);
                setStatus('error');
                setErrorMessage(error.text || error.message || 'Failed to send. Please try again.');
            });
    };

    return (
        <section className={styles.contactSection} id="contact-form">
            <div className={styles.container}>
                {/* Left Column: Fixed Card Style */}
                <motion.div
                    className={styles.cardContainer}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <img
                        src="https://i.ibb.co/d0PPzCfB/Gemini-memoji-1-1.png"
                        alt="Contact"
                        className={styles.cardImage}
                    />
                    <div className={styles.hiBubble}>
                        Hi
                    </div>
                </motion.div>

                {/* Right Column: Form */}
                <div className={styles.contentContainer}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className={styles.header}>Let's Work Together</h2>
                        <p className={styles.subtext}>
                            Let's build something impactful together—whether it's your brand, your website, or your next big idea.
                        </p>
                    </motion.div>

                    <motion.form
                        ref={form}
                        className={styles.form}
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className={styles.row}>
                            <div className={`${styles.inputGroup} ${styles.halfWidth}`}>
                                <label className={styles.label}>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Smith"
                                    className={styles.input}
                                    required
                                />
                            </div>
                            <div className={`${styles.inputGroup} ${styles.halfWidth}`}>
                                <label className={styles.label}>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="johnsmith@gmail.com"
                                    className={styles.input}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Service Needed ?</label>
                            <select
                                name="service"
                                value={formData.service}
                                onChange={handleChange}
                                className={styles.select}
                                required
                            >
                                <option value="" disabled>Select...</option>
                                <option value="Web Development">Web Development</option>
                                <option value="UI/UX Design">UI/UX Design</option>
                                <option value="Backend System">Backend System</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>What Can I Help You...</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Hello, I'd like to enquire about..."
                                className={styles.textarea}
                                required
                            />
                        </div>

                        <div className={styles.submitWrapper}>
                            <button
                                type="submit"
                                className={`${styles.submitButton} ${status === 'success' ? styles.success : ''} ${status === 'error' ? styles.error : ''}`}
                                disabled={status === 'loading' || status === 'success'}
                                style={{ opacity: status === 'loading' ? 0.7 : 1 }}
                            >
                                {status === 'loading' && 'Sending...'}
                                {status === 'success' && 'Message Sent'}
                                {status === 'error' && 'Failed'}
                                {status === 'idle' && 'Submit'}
                            </button>
                        </div>
                    </motion.form>
                </div>
            </div>
        </section>
    );
}
