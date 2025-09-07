import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';

// Project data store
const projectsData = {

  instans: {
    title: "Instans",
    tagline: "AI-powered interview preparation with real-time screen sharing",
    description: "Instans is an AI-powered interview preparation assistant that combines real-time screen sharing with intelligent chat capabilities. The platform leverages Google's Generative AI to provide personalized interview coaching, technical problem-solving guidance, and resume analysis.",
    overview: [
      "Instans is a comprehensive AI-powered interview preparation platform designed to help job seekers excel in their interviews through personalized coaching and real-time feedback. The platform combines advanced AI capabilities with practical features like screen sharing for live code review and system design whiteboarding, creating an immersive interview simulation experience.",
      "Built with modern technologies including Next.js 14 and React 19, Instans offers a sophisticated user experience with dark/light theme support, voice input capabilities, and responsive design. The platform integrates Google's Generative AI for intelligent question generation and feedback, while supporting multiple interaction modes including voice and text-based communication for comprehensive interview preparation."
    ],
    problemStatement: [
      "Traditional interview preparation methods are often generic and don't provide personalized feedback. Many candidates struggle with technical interviews due to lack of real-time guidance and difficulty in explaining their thought process during problem-solving.",
      "Existing platforms lack the combination of AI-powered coaching with real-time collaborative features like screen sharing, making it difficult for candidates to get comprehensive interview practice that mirrors real-world scenarios."
    ],
    solution: [
      "Instans bridges this gap by providing an AI-powered platform that offers personalized interview coaching with real-time screen sharing capabilities. The platform uses Google's Generative AI to generate contextual interview questions and provide intelligent feedback.",
      "The application features a dual-panel interface where users can share their screen for live code review while receiving AI-powered suggestions and feedback through a chat interface. Voice input capabilities allow for natural conversation flow during mock interviews."
    ],
    tools: [
      "Next.js 14",
      "React 19",
      "TypeScript",
      "TailwindCSS",
      "Google Generative AI",
      "Google Cloud Speech",
      "Vosk Browser",
      "Framer Motion",
      "React Markdown",
      "Prism React Renderer"
    ],
    features: [
      "Real-time screen sharing for code review",
      "AI-powered interview question generation",
      "Voice and text input capabilities",
      "Dark/light theme support",
      "System design whiteboarding",
      "Resume analysis and feedback",
      "Interactive coding environment",
      "Progress tracking and analytics"
    ],
    challenges: [
      "Integrating multiple AI services (Google Generative AI, speech recognition)",
      "Implementing real-time screen sharing with low latency",
      "Creating a responsive dual-panel interface",
      "Handling voice input processing and transcription",
      "Optimizing performance for real-time interactions"
    ],
    learnings: [
      "Advanced state management for real-time applications",
      "Integration patterns for multiple AI services",
      "Performance optimization for real-time features",
      "User experience design for collaborative tools",
      "Error handling in distributed systems"
    ],
    results: [
      "Successfully created a comprehensive interview preparation platform",
      "Integrated multiple AI services for enhanced user experience",
      "Achieved low-latency real-time screen sharing",
      "Built a scalable and maintainable codebase",
      "Received positive feedback from beta users"
    ],
    impact: [
      "Helped numerous developers improve their interview performance",
      "Reduced interview preparation time through personalized coaching",
      "Provided accessible AI-powered tools for career development",
      "Created a platform that adapts to individual learning styles"
    ],
    projectLink: "https://github.com/kushyanthpothi/instans",
    image: "https://i.ibb.co/JRtFvVD2/Airbrush-image-extender-1.jpg",
    viewSiteLink: "https://instans.netlify.app/",
    screenshots: [
      "https://i.ibb.co/JRtFvVD2/Airbrush-image-extender-1.jpg"
    ],
    demoLinks: [
      { name: "Live Demo", url: "https://instans.netlify.app/" },
      { name: "GitHub Repository", url: "https://github.com/kushyanthpothi/instans" }
    ],
    cta: {
      text: "Try Instans Today",
      link: "https://instans.netlify.app/",
      buttonText: "Start Interview Prep"
    }
  },
  eventMania: {
    title: "Event Mania",
    tagline: "Connecting students with college events seamlessly",
    description: "Event Mania is a one-stop platform designed to simplify event management for colleges and students. Whether you're a student looking for exciting events to join or a college representative organizing events, Event Mania bridges the gap and creates a seamless experience.",
    overview: [
      "Event Mania is a comprehensive platform that bridges the gap between students and college events, providing a centralized solution for event management. It allows students to discover and register for exciting events across multiple colleges with ease. The platform also empowers college representatives to create and manage events, making it a seamless experience for all stakeholders involved.",
      "Designed with modern UI/UX principles, Event Mania features real-time event updates, secure authentication, and robust backend support using Firebase. The platform caters to diverse user roles, including superusers who oversee all events and accounts, ensuring smooth operations and high user satisfaction."
    ],
    problemStatement: [
      "Students often struggle to discover events happening across different colleges due to fragmented information sources. College representatives face challenges in managing event registrations and communicating with participants effectively.",
      "Traditional event management systems lack real-time updates and comprehensive user role management, making it difficult to coordinate between students, organizers, and administrators."
    ],
    solution: [
      "Event Mania provides a unified platform where students can browse, register, and track events from multiple colleges. College representatives can create events, manage registrations, and communicate with participants through a centralized dashboard.",
      "The platform features role-based access control with separate interfaces for students, organizers, and superusers, ensuring each user type has appropriate permissions and functionality tailored to their needs."
    ],
    tools: ["React.js", "Firebase Realtime Database", "HTML5", "CSS3", "Firebase Auth"],
    features: [
      "Event discovery and registration system",
      "Role-based user management (Student, Organizer, Superuser)",
      "Real-time event updates and notifications",
      "Secure Firebase authentication",
      "Event creation and management dashboard",
      "Participant management and communication",
      "Responsive design for all devices",
      "Real-time database synchronization"
    ],
    challenges: [
      "Implementing complex role-based access control",
      "Managing real-time data synchronization across users",
      "Creating intuitive interfaces for different user roles",
      "Ensuring data security and privacy",
      "Handling concurrent event registrations"
    ],
    learnings: [
      "Advanced Firebase security rules implementation",
      "Real-time database architecture design",
      "User experience design for multi-role systems",
      "State management in collaborative applications",
      "Authentication flow optimization"
    ],
    results: [
      "Successfully deployed a functional event management platform",
      "Achieved smooth real-time data synchronization",
      "Implemented comprehensive user role management",
      "Created intuitive interfaces for all user types",
      "Established secure authentication system"
    ],
    impact: [
      "Simplified event discovery for students across colleges",
      "Streamlined event management for college representatives",
      "Improved communication between organizers and participants",
      "Enhanced overall event participation rates",
      "Created a scalable platform for future expansion"
    ],
    projectLink: "https://github.com/kushyanthpothi/EventMania",
    image: "https://i.ibb.co/gJQKjNK/Event-Mania-Design.png",
    viewSiteLink: "https://ap-event-mania.web.app/",
    screenshots: [
      "https://i.ibb.co/gJQKjNK/Event-Mania-Design.png"
    ],
    demoLinks: [
      { name: "Live Demo", url: "https://ap-event-mania.web.app/" },
      { name: "GitHub Repository", url: "https://github.com/kushyanthpothi/EventMania" }
    ],
    cta: {
      text: "Explore Event Mania",
      link: "https://ap-event-mania.web.app/",
      buttonText: "Discover Events"
    }
  },
  youtubeDownloader: {
    title: "YouTube Video and Audio Downloader",
    tagline: "Download YouTube content in multiple formats and resolutions",
    description: "This Django-based project empowers you to download YouTube videos and audio in your preferred format and resolution. Select quality options and extract audio with just a few clicks.",
    overview: [
      "The YouTube Video and Audio Downloader is a Django-based application that simplifies downloading YouTube content in various formats and resolutions. Users can extract audio or download videos effortlessly while selecting their preferred quality. This intuitive tool caters to those seeking offline access to YouTube content.",
      "The backend leverages Django for robust functionality, complemented by `ffmpeg` for seamless audio conversion. The app's modern interface ensures a smooth user experience, making it ideal for video and audio enthusiasts. With tools like `pytube` and `yt-dlp`, the downloader guarantees reliable performance and efficiency."
    ],
    problemStatement: [
      "Users often need offline access to YouTube content for various purposes including education, entertainment, and research. Existing download methods are either unreliable, require complex setup, or don't provide format flexibility.",
      "Many users struggle with converting video content to audio format for portable listening, and current solutions often lack user-friendly interfaces or reliable performance."
    ],
    solution: [
      "Built a comprehensive Django web application that provides a simple, reliable interface for downloading YouTube videos and extracting audio. The application supports multiple video formats (MP4, WebM) and audio formats (MP3, AAC) with quality selection options.",
      "Integrated powerful backend libraries like pytube and yt-dlp for robust video downloading, combined with ffmpeg for high-quality audio conversion. The application features a clean, responsive web interface that works across all devices."
    ],
    tools: ["Django", "Python", "HTML", "CSS", "ffmpeg", "pytube", "yt-dlp"],
    features: [
      "Multiple video format support (MP4, WebM, etc.)",
      "Audio extraction in various formats (MP3, AAC)",
      "Quality selection for videos and audio",
      "Fast download processing",
      "Responsive web interface",
      "Error handling and user feedback",
      "Progress tracking during downloads",
      "Batch download capabilities"
    ],
    challenges: [
      "Handling YouTube's changing API and policies",
      "Ensuring reliable video processing and conversion",
      "Managing large file downloads and storage",
      "Implementing proper error handling for failed downloads",
      "Optimizing performance for concurrent users"
    ],
    learnings: [
      "Advanced Django backend development",
      "Integration with external APIs and libraries",
      "File processing and conversion techniques",
      "Error handling in web applications",
      "Performance optimization for media processing",
      "Web security best practices"
    ],
    results: [
      "Successfully deployed a functional YouTube downloader",
      "Achieved reliable video and audio processing",
      "Created user-friendly interface for content downloads",
      "Implemented robust error handling system",
      "Established efficient media conversion pipeline"
    ],
    impact: [
      "Provided users with reliable offline content access",
      "Simplified the process of format conversion",
      "Enabled educational content availability offline",
      "Created a tool for content creators and researchers",
      "Demonstrated practical Django application development"
    ],
    projectLink: "https://github.com/kushyanthpothi/ytdownloader",
    image: "https://i.ibb.co/FB9hXK8/Laptop-Design-edit.png",
    screenshots: [
      "https://i.ibb.co/FB9hXK8/Laptop-Design-edit.png"
    ],
    demoLinks: [
      { name: "GitHub Repository", url: "https://github.com/kushyanthpothi/ytdownloader" }
    ],
    cta: {
      text: "Download YouTube Content",
      link: "https://github.com/kushyanthpothi/ytdownloader",
      buttonText: "View on GitHub"
    }
  },
  proReader: {
    title: "Pro Reader",
    tagline: "Your ultimate Android tool for QR codes, speech, and text processing",
    description: "Pro Reader is a feature-packed Android application that empowers you to handle QR codes, speech, and text with ease. Whether it's scanning, generating, converting, or extracting text, Pro Reader is your ultimate tool.",
    overview: [
      "Pro Reader is an all-in-one Android application that simplifies text-related tasks through innovative features. It supports QR code scanning and generation, enabling users to decode or share information instantly. The app also provides real-time speech-to-text conversion, ideal for note-taking and transcription.",
      "Additionally, Pro Reader offers text-to-speech functionality for a hands-free reading experience and allows users to extract text from images. Powered by Firebase and ML Kit, the app delivers a seamless and efficient experience. Its user-friendly design and multi-functional tools make it a valuable companion for productivity."
    ],
    problemStatement: [
      "Mobile users often need to perform multiple text-related tasks like QR code scanning, speech-to-text conversion, and text extraction from images. Existing apps typically focus on single functionality, requiring users to switch between multiple applications.",
      "Many productivity tasks on mobile devices are cumbersome due to lack of integrated tools that work seamlessly together, especially for users who need quick access to various text processing features."
    ],
    solution: [
      "Developed a comprehensive Android application that combines multiple text processing features into a single, user-friendly interface. The app integrates QR code scanning/generation, speech-to-text conversion, text-to-speech functionality, and OCR (Optical Character Recognition) for text extraction from images.",
      "Leveraged Google's ML Kit for advanced machine learning capabilities and Firebase for backend services, ensuring reliable performance and offline functionality where possible."
    ],
    tools: ["Java/Kotlin", "Firebase", "ML Kit", "Android"],
    features: [
      "QR code scanning and generation",
      "Real-time speech-to-text conversion",
      "Text-to-speech functionality",
      "OCR text extraction from images",
      "Offline processing capabilities",
      "Share functionality for processed content",
      "History tracking for scanned/generated codes",
      "Dark mode support",
      "Material Design UI components"
    ],
    challenges: [
      "Integrating multiple ML Kit APIs efficiently",
      "Optimizing performance for real-time processing",
      "Managing offline functionality limitations",
      "Ensuring accurate OCR results across different image qualities",
      "Handling various device camera capabilities"
    ],
    learnings: [
      "Advanced Android development with Kotlin",
      "Integration with Google ML Kit APIs",
      "Firebase backend service implementation",
      "Performance optimization for mobile applications",
      "Material Design principles and implementation",
      "Offline-first application architecture"
    ],
    results: [
      "Successfully launched a feature-rich Android application",
      "Achieved high accuracy in text processing tasks",
      "Implemented comprehensive offline functionality",
      "Created intuitive user interface for complex features",
      "Established robust error handling and user feedback"
    ],
    impact: [
      "Provided users with a comprehensive text processing toolkit",
      "Simplified multi-step text-related workflows",
      "Enhanced productivity for mobile users",
      "Demonstrated integration of multiple AI/ML services",
      "Created a foundation for future mobile productivity apps"
    ],
    projectLink: "https://github.com/kushyanthpothi/ProReader",
    image: "https://i.ibb.co/sQYYbks/Pro-Reader-Banner-web-1.png",
    screenshots: [
      "https://i.ibb.co/sQYYbks/Pro-Reader-Banner-web-1.png"
    ],
    demoLinks: [
      { name: "GitHub Repository", url: "https://github.com/kushyanthpothi/ProReader" }
    ],
    cta: {
      text: "Download Pro Reader",
      link: "https://github.com/kushyanthpothi/ProReader",
      buttonText: "View on GitHub"
    }
  },
  pinNoter: {
    title: "Pin Noter",
    tagline: "Smart note-taking with rich formatting and cloud sync",
    description: "Pin Noter is a React-based note-taking application offering rich text formatting options like bold, underline, and lists. It supports offline caching for seamless note-taking without logging in and automatically syncs notes to the cloud upon login. Users can pin, delete, and access their notes from anywhere with ease.",
    overview: [
      "Pin Noter offers a feature-rich platform for managing notes effectively. Users can format their notes with bold, underline, strikethrough, and list options (bullet and numbered), pin important notes, and delete unwanted ones. The app is designed to enhance productivity with its user-friendly interface and efficient features.",
      "One of the key highlights is its offline mode, where notes are stored in cache memory without logging in. Upon logging into an account, the notes are automatically synced to the cloud, ensuring data safety and accessibility. With secure cloud storage, users can access their notes from anywhere, anytime."
    ],
    problemStatement: [
      "Many note-taking applications lack rich text formatting capabilities or have poor user interfaces. Users often struggle with accessing their notes across devices due to lack of proper synchronization.",
      "Existing solutions either require constant internet connectivity or don't provide seamless offline-to-online synchronization, making it difficult for users to work efficiently in various environments."
    ],
    solution: [
      "Created a comprehensive note-taking application with rich text formatting capabilities including bold, underline, strikethrough, and various list types. The application features an intuitive drag-and-drop interface for organizing notes and a pinning system for important content.",
      "Implemented a hybrid offline-online architecture where notes are cached locally for offline access and automatically synchronized with Firebase when connectivity is restored. The application provides a seamless user experience across all devices and platforms."
    ],
    tools: ["React.js", "Firebase", "CSS3", "React-dom"],
    features: [
      "Rich text formatting (bold, underline, strikethrough)",
      "Bullet and numbered list support",
      "Note pinning and organization",
      "Offline caching and sync",
      "Cloud storage with Firebase",
      "Cross-device synchronization",
      "Search and filter functionality",
      "Dark mode support",
      "Responsive design for all devices"
    ],
    challenges: [
      "Implementing rich text editing without external libraries",
      "Managing offline-to-online data synchronization",
      "Ensuring data consistency across devices",
      "Optimizing performance for large note collections",
      "Handling authentication and security"
    ],
    learnings: [
      "Advanced React state management",
      "Firebase real-time database integration",
      "Offline-first application development",
      "Rich text editing implementation",
      "Cross-platform data synchronization",
      "User authentication and security",
      "Performance optimization techniques"
    ],
    results: [
      "Successfully deployed a fully functional note-taking app",
      "Achieved seamless offline-online synchronization",
      "Implemented comprehensive rich text editing",
      "Created intuitive user interface and experience",
      "Established robust data persistence system"
    ],
    impact: [
      "Enhanced productivity for note-taking users",
      "Provided reliable offline access to notes",
      "Improved cross-device note accessibility",
      "Created a foundation for productivity applications",
      "Demonstrated modern web application development"
    ],
    projectLink: "https://github.com/kushyanthpothi/pin-noter",
    image: "https://i.ibb.co/Fk2jTJWP/screely-1752326497618.png",
    viewSiteLink: "https://pin-noter.netlify.app/",
    screenshots: [
      "https://i.ibb.co/Fk2jTJWP/screely-1752326497618.png"
    ],
    demoLinks: [
      { name: "Live Demo", url: "https://pin-noter.netlify.app/" },
      { name: "GitHub Repository", url: "https://github.com/kushyanthpothi/pin-noter" }
    ],
    cta: {
      text: "Start Taking Notes",
      link: "https://pin-noter.netlify.app/",
      buttonText: "Try Pin Noter"
    }
  },
  employeeRecordSystem: {
    title: "Employee Record System",
    tagline: "Comprehensive employee management with dual interface design",
    description: "A comprehensive web-based employee management system built with Django, designed to streamline employee data management for organizations. Features dual interface system with admin and employee panels, profile management, and role-based authentication.",
    overview: [
      "The Employee Record System is a robust web-based application developed using Django, designed to streamline employee data management for organizations of all sizes. This system provides a comprehensive platform for efficient employee record keeping, including personal details, educational background, and professional experience tracking.",
      "The system features a dual interface design with separate panels for administrators and employees, ensuring role-based access control and security. Administrators can manage all employee accounts, view comprehensive profiles, and maintain system-wide oversight, while employees can update their personal information, manage their educational qualifications, and maintain their work experience records. The responsive design built with Bootstrap ensures optimal user experience across all devices."
    ],
    problemStatement: [
      "Organizations often struggle with managing employee data efficiently due to fragmented systems and lack of centralized access. Traditional employee management systems lack proper role-based access control and comprehensive profile management.",
      "Many existing solutions don't provide adequate separation between administrative and employee functionalities, leading to security concerns and inefficient workflows for different user types."
    ],
    solution: [
      "Developed a comprehensive Django-based employee management system with dual interface architecture. The system features separate dashboards for administrators and employees, ensuring appropriate access levels and functionality for each user role.",
      "Implemented robust user authentication and authorization system with role-based permissions. The application includes comprehensive profile management, educational background tracking, work experience logging, and administrative oversight capabilities."
    ],
    tools: ["Django 5.0.4", "Python 3.8+", "MySQL", "HTML5", "CSS3", "JavaScript", "Bootstrap", "SCSS", "Font Awesome", "jQuery"],
    features: [
      "Dual interface system (Admin & Employee panels)",
      "Role-based authentication and authorization",
      "Comprehensive employee profile management",
      "Educational background tracking",
      "Work experience logging and management",
      "Administrative dashboard with system oversight",
      "Employee self-service portal",
      "Responsive design with Bootstrap",
      "Secure data management with MySQL",
      "User-friendly interface with modern UI"
    ],
    challenges: [
      "Implementing complex role-based access control",
      "Designing dual interface architecture",
      "Managing complex database relationships",
      "Ensuring data security and privacy",
      "Creating intuitive admin and employee interfaces",
      "Handling user authentication and session management"
    ],
    learnings: [
      "Advanced Django framework development",
      "Complex database design and relationships",
      "Role-based access control implementation",
      "User authentication and authorization patterns",
      "Dual interface application architecture",
      "Security best practices in web applications",
      "Bootstrap responsive design implementation",
      "MySQL database optimization"
    ],
    results: [
      "Successfully deployed a comprehensive employee management system",
      "Achieved secure role-based access control",
      "Created intuitive dual interface design",
      "Implemented robust data management capabilities",
      "Established efficient user workflows",
      "Delivered scalable and maintainable codebase"
    ],
    impact: [
      "Streamlined employee data management for organizations",
      "Improved administrative efficiency and oversight",
      "Enhanced employee self-service capabilities",
      "Reduced manual paperwork and data entry",
      "Created a foundation for HR management systems",
      "Demonstrated enterprise-level Django application development"
    ],
    projectLink: "https://github.com/kushyanthpothi/employeerecordsystem",
    image: "https://i.ibb.co/ffTn15M/Untitled-design-1.png",
    screenshots: [
      "https://i.ibb.co/ffTn15M/Untitled-design-1.png"
    ],
    demoLinks: [
      { name: "GitHub Repository", url: "https://github.com/kushyanthpothi/employeerecordsystem" }
    ],
    cta: {
      text: "Explore Employee Management",
      link: "https://github.com/kushyanthpothi/employeerecordsystem",
      buttonText: "View on GitHub"
    }
  }
};

// Slug to key mapping
const slugToKey = {
  'instans': 'instans',
  'event-mania': 'eventMania',
  'youtube-downloader': 'youtubeDownloader',
  'pro-reader': 'proReader',
  'pin-noter': 'pinNoter',
  'employee-record-system': 'employeeRecordSystem'
};

// Helper function to convert slug to camelCase 
function convertSlug(slug) {
  return slugToKey[slug];
}

// Project-specific metadata
const projectMetadata = {
  'instans': {
    title: 'Instans - AI powered screen share & chat assistant',
    description: 'Instans is an AI-powered screen sharing and chat assistant built with React and Firebase. It offers real-time screen sharing, chat, and collaboration features, with a focus on user engagement and convenience.',
  },
  'event-mania': {
    title: 'Event Mania - Event Management Platform | Kushyanth Pothineni',
    description: 'Event Mania is a comprehensive event management platform that connects students with college events. Built with React and Firebase, it streamlines event discovery, registration, and management.',
  },
  'youtube-downloader': {
    title: 'YouTube Video & Audio Downloader - Django Application | Kushyanth Pothineni',
    description: 'A powerful Django-based YouTube downloader that supports multiple formats and resolutions. Download videos in MP4 or extract audio in MP3 format with quality selection.',
  },
  'pro-reader': {
    title: 'Pro Reader - Android QR & Text Tool | Kushyanth Pothineni',
    description: 'Pro Reader is a versatile Android application for QR code scanning, speech-to-text conversion, and text extraction. Features offline support and ML Kit integration.',
  },
  'pin-noter': {
    title: 'Pin Noter - React Note Taking App | Kushyanth Pothineni',
    description: 'Pin Noter is a feature-rich note-taking application with rich text formatting, offline support, and cloud sync. Built with React and Firebase for seamless note management.',
  },
  'employee-record-system': {
    title: 'Employee Record System - Django Web Application | Kushyanth Pothineni',
    description: 'A comprehensive Django-based employee management system with dual interface design, featuring admin and employee panels, profile management, education tracking, and role-based authentication.',
  }
};

// Generate metadata for each project page
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const metadata = projectMetadata[slug];

  if (!metadata) {
    return {
      title: 'Project Not Found | Kushyanth Pothineni',
      description: 'The requested project could not be found.'
    };
  }

  const key = slugToKey[slug];
  const project = projectsData[key];

  return {
    metadataBase: new URL('https://kushyanth-portfolio.web.app'),
    title: metadata.title,
    description: metadata.description,
    keywords: [project.title, ...project.tools, 'Project', 'Portfolio', 'Kushyanth Pothineni'],
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: 'article',
      url: `https://kushyanth-portfolio.web.app/projects/${slug}`,
      images: [
        {
          url: project.image,
          width: 800,
          height: 600,
          alt: project.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      images: [project.image],
      creator: '@KushyanthPothi1'
    }
  };
}

// Generate static paths for all projects
export function generateStaticParams() {
  return [
    { slug: 'instans' },
    { slug: 'event-mania' },
    { slug: 'youtube-downloader' },
    { slug: 'pro-reader' },
    { slug: 'pin-noter' },
    { slug: 'employee-record-system' }
  ];
}

// Generate structured data for individual project pages
function generateProjectStructuredData(project, slug) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://kushyanth-portfolio.web.app/projects/${slug}/#projectpage`,
        "url": `https://kushyanth-portfolio.web.app/projects/${slug}`,
        "name": `${project.title} | Kushyanth Pothineni - Software Developer`,
        "description": project.description,
        "isPartOf": { "@id": "https://kushyanth-portfolio.web.app/#website" },
        "about": { "@id": "https://kushyanth-portfolio.web.app/#person" },
        "mainEntity": { "@id": `https://kushyanth-portfolio.web.app/#${slug.replace(/-/g, '')}` }
      },
      {
        "@type": "SoftwareSourceCode",
        "@id": `https://kushyanth-portfolio.web.app/#${slug.replace(/-/g, '')}`,
        "name": project.title,
        "codeRepository": project.projectLink,
        "description": project.description,
        "programmingLanguage": project.tools,
        "image": project.image,
        "url": `https://kushyanth-portfolio.web.app/projects/${slug}`,
        "author": { "@id": "https://kushyanth-portfolio.web.app/#person" },
        "dateCreated": "2023-01-01",
        "dateModified": "2024-12-25",
        "keywords": project.tools.concat([project.title, "Portfolio Project"]),
        "mainEntity": project.viewSiteLink ? {
          "@type": "SoftwareApplication",
          "name": project.title,
          "description": project.description,
          "applicationCategory": "WebApplication",
          "operatingSystem": "Web Browser",
          "url": project.viewSiteLink,
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        } : undefined
      }
    ]
  };
}

// Server component for project page
export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const key = slugToKey[slug];
  const project = projectsData[key];

  if (!project) {
    notFound();
  }

  // Import and use the client component
  const ProjectClientPage = dynamic(() => import('./client-page'), {
    ssr: true
  });

  return <ProjectClientPage project={project} />;
}
