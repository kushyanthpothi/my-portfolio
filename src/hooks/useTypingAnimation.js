import { useState, useEffect, useRef, useCallback } from 'react';
import { ROLES, GREETING } from '../constants/navigation';
import { ANIMATION_TIMINGS } from '../config';

/**
 * Custom hook for typing animation effect
 * Handles the sequential typing of hello, name, and role text
 * Also manages role scrambling animation
 */
export function useTypingAnimation() {
    // Typing animation states
    const [helloText, setHelloText] = useState('');
    const [nameText, setNameText] = useState('');
    const [roleText, setRoleText] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const [isTypingHello, setIsTypingHello] = useState(true);
    const [isTypingName, setIsTypingName] = useState(false);
    const [isTypingRole, setIsTypingRole] = useState(false);
    const [showRole, setShowRole] = useState(false);
    const [showSocialIcons, setShowSocialIcons] = useState(false);
    const [showButtons, setShowButtons] = useState(false);
    const [showProfilePhoto, setShowProfilePhoto] = useState(false);
    const [showNavbar, setShowNavbar] = useState(false);

    // Role scramble states
    const [currentRole, setCurrentRole] = useState(ROLES[0]);
    const [isScrambling, setIsScrambling] = useState(false);
    const roleRef = useRef(0);
    const roleIntervalRef = useRef(null);

    // Function to skip all animations and show everything immediately
    const skipAnimations = useCallback(() => {
        // Clear all existing timeouts and intervals
        const highestTimeoutId = setTimeout(() => { }, 0);
        for (let i = 0; i <= highestTimeoutId; i++) {
            clearTimeout(i);
        }
        // Clear role scrambling interval
        if (roleIntervalRef.current) {
            clearInterval(roleIntervalRef.current);
        }

        // Set all animation states to true immediately
        setHelloText(GREETING.hello);
        setNameText(GREETING.name);
        setRoleText(GREETING.initialRole);
        setShowRole(true);
        setShowSocialIcons(true);
        setShowButtons(true);
        setShowProfilePhoto(true);
        setShowNavbar(true);
        setIsTypingHello(false);
        setIsTypingName(false);
        setIsTypingRole(false);
        setCurrentRole(GREETING.initialRole);
        setIsScrambling(false);
        setShowCursor(false);
    }, []);

    // Role scramble function
    const scrambleRole = useCallback(() => {
        setIsScrambling(true);
        const currentIdx = roleRef.current;
        const nextIdx = (currentIdx + 1) % ROLES.length;
        const nextRole = ROLES[nextIdx];

        let iterations = 0;
        const maxIterations = ANIMATION_TIMINGS.ROLE_SCRAMBLE_ITERATIONS;
        const interval = setInterval(() => {
            setCurrentRole(prevRole => {
                return prevRole
                    .split('')
                    .map((letter, idx) => {
                        if (letter === ' ' || (Math.random() > 0.5 && iterations > maxIterations / 2)) {
                            return letter;
                        }
                        return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@'[
                            Math.floor(Math.random() * 53)
                        ];
                    })
                    .join('');
            });

            iterations++;

            if (iterations >= maxIterations) {
                clearInterval(interval);
                setCurrentRole(nextRole);
                roleRef.current = nextIdx;
                setIsScrambling(false);
            }
        }, ANIMATION_TIMINGS.ROLE_SCRAMBLE_SPEED);
    }, []);

    // Typing animation effect
    useEffect(() => {
        // Check if animations should be skipped (e.g., coming from project page)
        if (typeof window !== 'undefined') {
            const shouldSkip = sessionStorage.getItem('skipAnimations');
            if (shouldSkip === 'true') {
                sessionStorage.removeItem('skipAnimations');
                skipAnimations();
                return;
            }
        }

        const { hello, name, initialRole } = GREETING;

        let helloIndex = 0;
        let nameIndex = 0;
        let roleIndex = 0;

        const typeHello = () => {
            if (helloIndex < hello.length) {
                setHelloText(hello.slice(0, helloIndex + 1));
                helloIndex++;
                setTimeout(typeHello, ANIMATION_TIMINGS.TYPING_SPEED);
            } else {
                setIsTypingHello(false);
                setIsTypingName(true);
                setTimeout(typeName, ANIMATION_TIMINGS.TYPING_DELAY_BETWEEN);
            }
        };

        const typeName = () => {
            if (nameIndex < name.length) {
                setNameText(name.slice(0, nameIndex + 1));
                nameIndex++;
                setTimeout(typeName, ANIMATION_TIMINGS.TYPING_SPEED);
            } else {
                setIsTypingName(false);
                setShowRole(true);
                setIsTypingRole(true);
                setTimeout(typeRole, ANIMATION_TIMINGS.TYPING_DELAY_BETWEEN);
            }
        };

        const typeRole = () => {
            if (roleIndex < initialRole.length) {
                setRoleText(initialRole.slice(0, roleIndex + 1));
                roleIndex++;
                setTimeout(typeRole, ANIMATION_TIMINGS.TYPING_SPEED);
            } else {
                setIsTypingRole(false);
                setShowSocialIcons(true);
                // Show buttons after social icons
                setTimeout(() => {
                    setShowButtons(true);
                }, ANIMATION_TIMINGS.SOCIAL_ICONS_DELAY);
                // Show profile photo after buttons
                setTimeout(() => {
                    setShowProfilePhoto(true);
                }, ANIMATION_TIMINGS.PROFILE_PHOTO_DELAY);
                // Show navbar much earlier - right after greeting starts
                setTimeout(() => {
                    setShowNavbar(true);
                }, ANIMATION_TIMINGS.NAVBAR_DELAY);
            }
        };

        // Start typing animation after a delay
        setTimeout(typeHello, 1000);

        // Cursor blinking
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, ANIMATION_TIMINGS.CURSOR_BLINK_SPEED);

        return () => clearInterval(cursorInterval);
    }, [skipAnimations]);

    // Start role scrambling after typing is complete
    useEffect(() => {
        if (showRole && !isTypingRole) {
            const timeoutId = setTimeout(() => {
                roleIntervalRef.current = setInterval(() => {
                    if (!isScrambling) {
                        scrambleRole();
                    }
                }, ANIMATION_TIMINGS.ROLE_SCRAMBLE_INTERVAL);
            }, 1000);

            return () => {
                clearTimeout(timeoutId);
                if (roleIntervalRef.current) {
                    clearInterval(roleIntervalRef.current);
                }
            };
        }
    }, [showRole, isTypingRole, isScrambling, scrambleRole]);

    // Add event listeners for skipping animations
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Escape') {
                skipAnimations();
            }
        };

        const handleClick = () => {
            skipAnimations();
        };

        // Add event listeners
        window.addEventListener('keydown', handleKeyPress);
        document.addEventListener('click', handleClick);

        // Cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            document.removeEventListener('click', handleClick);
        };
    }, [skipAnimations]);

    return {
        helloText,
        nameText,
        roleText,
        currentRole,
        showCursor,
        isTypingHello,
        isTypingName,
        isTypingRole,
        showRole,
        showSocialIcons,
        showButtons,
        showProfilePhoto,
        showNavbar,
        skipAnimations,
    };
}
