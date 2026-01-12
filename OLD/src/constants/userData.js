/**
 * User data constants for portfolio
 * Centralized location for all user information
 */

export const USER_INFO = {
    name: "Kushyanth Pothineni",
    title: "Full Stack Developer",
    email: "pothineni.kushyanth@gmail.com",
    phone: "8125144235",
    location: "Guntur, Andra Pradesh",
};

export const SOCIAL_LINKS = {
    github: "https://github.com/kushyanthpothi/",
    linkedin: "https://www.linkedin.com/in/kushyanth-pothineni/",
    twitter: "https://x.com/KushyanthPothi1",
};

export const ABOUT_TEXT = "I am a passionate Full Stack Developer with hands-on experience in building modern, scalable web applications using technologies like React.js, Next.js, Django, and Spring Boot. My expertise spans frontend and backend development, database management, and API optimization. I have a proven track record of delivering impactful solutions, such as AI-powered supply chain optimization at NinjaCart and inventory tracking systems with real-time alerts. With a Bachelor of Technology in Computer Science from KKR & KSR Institute of Technology and Sciences, I am committed to leveraging my technical skills and certifications in MEAN Stack, Java Full Stack, and ServiceNow to create innovative, user-focused solutions.";

export const SKILLS = [
    { name: "Django", level: 85 },
    { name: "JavaScript", level: 92 },
    { name: "HTML/CSS", level: 95 },
    { name: "MongoDB", level: 80 },
    { name: "SQL", level: 82 },
    { name: "Java", level: 78 },
    { name: "API Design", level: 86 },
    { name: "Next.js", level: 85 }
];

export const PROJECTS = [
    {
        title: "instans",
        description: "Instans is an AI-powered interview preparation assistant that combines real-time screen sharing with intelligent chat capabilities. The platform leverages Google's Generative AI to provide personalized interview coaching, technical problem-solving guidance, and resume analysis.",
        techStack: ["React", "Firebase", "HTML/CSS", "Open Source", "Gemini"],
        image: "/images/projects/instans.jpg",
        slug: "instans",
        viewSiteLink: "https://instans.netlify.app/"
    },
    {
        title: "Event Mania",
        description: "Event Mania is a one-stop platform designed to simplify event management for colleges and students. Whether you're a student looking for exciting events to join or a college representative organizing events, Event Mania bridges the gap and creates a seamless experience.",
        techStack: ["React", "Firebase", "HTML/CSS", "Authentication"],
        image: "/images/projects/event-mania.png",
        slug: "event-mania",
        viewSiteLink: "https://ap-event-mania.web.app/"
    },
    {
        title: "YouTube Video and Audio Downloader",
        description: "This Django-based project empowers you to download YouTube videos and audio in your preferred format and resolution. Select quality options and extract audio with just a few clicks.",
        techStack: ["Django", "Python", "HTML/CSS", "ffmpeg", "pytube"],
        image: "/images/projects/youtube-downloader.png",
        slug: "youtube-downloader"
    },
    {
        title: "Pro Reader",
        description: "Pro Reader is a feature-packed Android application that empowers you to handle QR codes, speech, and text with ease. Whether it's scanning, generating, converting, or extracting text, Pro Reader is your ultimate tool.",
        techStack: ["Java/Kotlin", "Firebase", "ML Kit", "Android"],
        image: "/images/projects/pro-reader.png",
        slug: "pro-reader"
    },
    {
        title: "Pin Noter",
        description: "Pin Noter is a React-based note-taking application offering rich text formatting options like bold, underline, and lists. It supports offline caching for seamless note-taking without logging in and automatically syncs notes to the cloud upon login.",
        techStack: ["React.js", "Firebase", "CSS3", "React-dom"],
        image: "/images/projects/pin-noter.png",
        slug: "pin-noter",
        viewSiteLink: "https://pin-noter.netlify.app/"
    },
    {
        title: "Employee Record System",
        description: "A comprehensive web-based employee management system built with Django, designed to streamline employee data management for organizations. Features dual interface system with admin and employee panels, profile management, and role-based authentication.",
        techStack: ["Django", "Python", "MySQL", "Bootstrap", "JavaScript"],
        image: "/images/projects/employee-record-system.png",
        slug: "employee-record-system"
    }
];

export const CERTIFICATIONS = [
    {
        name: "ServiceNow Certified System Administrator",
        image: "/images/certificates/servicenow-csa.jpg",
        link: "https://drive.google.com/file/d/1QdWYq6ditLGmzjzqcEITSwpAC9x-ZXUN/view?usp=sharing"
    },
    {
        name: "AWS Academy Machine Learning Foundations",
        image: "/images/certificates/aws-ml.jpg",
        link: "https://www.credly.com/badges/446553a7-d24b-4955-889e-55eec636f750/linked_in_profile"
    },
    {
        name: "Wipro Talent Next Java Full Stack Certification",
        image: "/images/certificates/wipro-java.png",
        link: "https://cert.diceid.com/cid/xNkRt2LMUe"
    },
    {
        name: "Responsive Web Designer Certification",
        image: "/images/certificates/fcc-responsive.png",
        link: "https://www.freecodecamp.org/certification/Kushyanthpothi/responsive-web-design"
    },
    {
        name: "Introduction to Internet of Things",
        image: "/images/certificates/nptel-iot.jpg",
        link: "https://nptel.ac.in/noc/E_Certificate/NPTEL24CS35S65630220730556258"
    },
    {
        name: "Junior Software Developer",
        image: "/images/certificates/junior-dev.jpg",
        link: "https://drive.google.com/file/d/1q3-3-lYH3mm08gcnGXN66SIFSRwyQm0u/view?usp=sharing"
    },
    {
        name: "The Fundamentals of Digital Marketing",
        image: "/images/certificates/digital-marketing.jpg",
        link: "https://learndigital.withgoogle.com/link/1qsdpcedm9s"
    }
];

export const SKILL_CATEGORIES = [
    {
        category: "Programming Languages",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
        ),
        skills: [
            { name: 'JavaScript', wiki: 'https://en.wikipedia.org/wiki/JavaScript', image: '/images/skills/javascript.svg' },
            { name: 'Python', wiki: 'https://en.wikipedia.org/wiki/Python_(programming_language)', image: '/images/skills/python.svg' },
            { name: 'Java', wiki: 'https://en.wikipedia.org/wiki/Java_(programming_language)', image: '/images/skills/java.svg' },
            { name: 'C/C++', wiki: 'https://en.wikipedia.org/wiki/C%2B%2B', image: '/images/skills/cpp.svg' }
        ]
    },
    {
        category: "Frontend Development",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
        ),
        skills: [
            { name: 'React.js', wiki: 'https://en.wikipedia.org/wiki/React_(JavaScript_library)', image: '/images/skills/react.svg' },
            { name: 'Next.js', wiki: 'https://en.wikipedia.org/wiki/Next.js', image: '/images/skills/nextjs.svg' },
            { name: 'Angular', wiki: 'https://en.wikipedia.org/wiki/Angular_(web_framework)', image: '/images/skills/angular.svg' },
            { name: 'HTML/CSS', wiki: 'https://en.wikipedia.org/wiki/HTML', image: '/images/skills/html.svg' }
        ]
    },
    {
        category: "Backend Development",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
            </svg>
        ),
        skills: [
            { name: 'Django', wiki: 'https://en.wikipedia.org/wiki/Django_(web_framework)', image: '/images/skills/django.svg' },
            { name: 'Node.js', wiki: 'https://en.wikipedia.org/wiki/Node.js', image: '/images/skills/nodejs.svg' },
            { name: 'REST APIs', wiki: 'https://en.wikipedia.org/wiki/Representational_state_transfer', image: '/images/skills/api.svg' },
            { name: 'Firebase', wiki: 'https://en.wikipedia.org/wiki/Firebase', image: '/images/skills/firebase.svg' }
        ]
    },
    {
        category: "Database Systems",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
        ),
        skills: [
            { name: 'MongoDB', wiki: 'https://en.wikipedia.org/wiki/MongoDB', image: '/images/skills/mongodb.svg' },
            { name: 'PostgreSQL', wiki: 'https://en.wikipedia.org/wiki/PostgreSQL', image: '/images/skills/postgresql.svg' },
            { name: 'MySQL', wiki: 'https://en.wikipedia.org/wiki/MySQL', image: '/images/skills/mysql.svg' },
            { name: 'Firebase', wiki: 'https://en.wikipedia.org/wiki/Firebase', image: '/images/skills/firebase.svg' }
        ]
    },
    {
        category: "Development Tools",
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        skills: [
            { name: 'Git', wiki: 'https://en.wikipedia.org/wiki/Git', image: '/images/skills/git.svg' },
            { name: 'MCP', wiki: 'https://www.anthropic.com/news/model-context-protocol', image: '/images/skills/mcp.png' },
            { name: 'SDLC', wiki: 'https://en.wikipedia.org/wiki/Software_development_life_cycle', image: '/images/skills/sdlc.png' },
            { name: 'API Integration', wiki: 'https://en.wikipedia.org/wiki/API', image: '/images/skills/api.svg' }
        ]
    }
];
