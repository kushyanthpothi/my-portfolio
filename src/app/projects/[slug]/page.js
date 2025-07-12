import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';

// Project data store
const projectsData = {
    eventMania: {
        title: "Event Mania",
        description: "Event Mania is a one-stop platform designed to simplify event management for colleges and students. Whether you're a student looking for exciting events to join or a college representative organizing events, Event Mania bridges the gap and creates a seamless experience.",
        overview: [
            "Event Mania is a comprehensive platform that bridges the gap between students and college events, providing a centralized solution for event management. It allows students to discover and register for exciting events across multiple colleges with ease. The platform also empowers college representatives to create and manage events, making it a seamless experience for all stakeholders involved.",
            "Designed with modern UI/UX principles, Event Mania features real-time event updates, secure authentication, and robust backend support using Firebase. The platform caters to diverse user roles, including superusers who oversee all events and accounts, ensuring smooth operations and high user satisfaction."
        ],
        tools: ["React.js", "Firebase Realtime Database", "HTML5", "CSS3", "Firebase Auth"],
        projectLink: "https://github.com/kushyanthpothi/EventMania",
        image: "https://i.ibb.co/gJQKjNK/Event-Mania-Design.png",
        viewSiteLink: "https://ap-event-mania.web.app/"
    },
    youtubeDownloader: {
        title: "YouTube Video and Audio Downloader",
        description: "This Django-based project empowers you to download YouTube videos and audio in your preferred format and resolution.",
        overview: [
            "The YouTube Video and Audio Downloader is a Django-based application that simplifies downloading YouTube content in various formats and resolutions. Users can extract audio or download videos effortlessly while selecting their preferred quality. This intuitive tool caters to those seeking offline access to YouTube content.",
            "The backend leverages Django for robust functionality, complemented by `ffmpeg` for seamless audio conversion. The app's modern interface ensures a smooth user experience, making it ideal for video and audio enthusiasts. With tools like `pytube` and `yt-dlp`, the downloader guarantees reliable performance and efficiency."
        ],
        tools: ["Django", "Python", "HTML", "CSS", "ffmpeg", "pytube", "yt-dlp"],
        projectLink: "https://github.com/kushyanthpothi/ytdownloader",
        image: "https://i.ibb.co/FB9hXK8/Laptop-Design-edit.png"
    },
    proReader: {
        title: "Pro Reader",
        description: "Pro Reader is a feature-packed Android application that empowers you to handle QR codes, speech, and text with ease. Whether it's scanning, generating, converting, or extracting text, Pro Reader is your ultimate tool.",
        overview: [
            "Pro Reader is an all-in-one Android application that simplifies text-related tasks through innovative features. It supports QR code scanning and generation, enabling users to decode or share information instantly. The app also provides real-time speech-to-text conversion, ideal for note-taking and transcription.",
            "Additionally, Pro Reader offers text-to-speech functionality for a hands-free reading experience and allows users to extract text from images. Powered by Firebase and ML Kit, the app delivers a seamless and efficient experience. Its user-friendly design and multi-functional tools make it a valuable companion for productivity."
        ],
        tools: ["Java/Kotlin", "Firebase", "ML Kit", "Android"],
        projectLink: "https://github.com/kushyanthpothi/ProReader",
        image: "https://i.ibb.co/sQYYbks/Pro-Reader-Banner-web-1.png"
    },
    pinNoter: {
        title: "Pin Noter",
        description: "Pin Noter is a React-based note-taking application offering rich text formatting options like bold, underline, and lists. It supports offline caching for seamless note-taking without logging in and automatically syncs notes to the cloud upon login. Users can pin, delete, and access their notes from anywhere with ease.",
        overview: [
            "Pin Noter offers a feature-rich platform for managing notes effectively. Users can format their notes with bold, underline, strikethrough, and list options (bullet and numbered), pin important notes, and delete unwanted ones. The app is designed to enhance productivity with its user-friendly interface and efficient features.",
            "One of the key highlights is its offline mode, where notes are stored in cache memory without logging in. Upon logging into an account, the notes are automatically synced to the cloud, ensuring data safety and accessibility. With secure cloud storage, users can access their notes from anywhere, anytime."
        ],
        tools: ["React.js", "Firebase", "CSS3","React-dom"],
        projectLink: "https://github.com/kushyanthpothi/pin-noter",
        image: "https://i.ibb.co/Fk2jTJWP/screely-1752326497618.png",
        viewSiteLink: "https://pin-noter.web.app/",
    },
    employeeRecordSystem: {
        title: "Employee Record System",
        description: "A comprehensive web-based employee management system built with Django, designed to streamline employee data management for organizations of all sizes. Features dual interface system with admin and employee panels for efficient workforce management.",
        overview: [
            "The Employee Record System is a robust web-based application developed using Django, designed to streamline employee data management for organizations of all sizes. This system provides a comprehensive platform for efficient employee record keeping, including personal details, educational background, and professional experience tracking.",
            "The system features a dual interface design with separate panels for administrators and employees, ensuring role-based access control and security. Administrators can manage all employee accounts, view comprehensive profiles, and maintain system-wide oversight, while employees can update their personal information, manage their educational qualifications, and maintain their work experience records. The responsive design built with Bootstrap ensures optimal user experience across all devices."
        ],
        tools: ["Django 5.0.4", "Python 3.8+", "MySQL", "HTML5", "CSS3", "JavaScript", "Bootstrap", "SCSS", "Font Awesome", "jQuery"],
        projectLink: "https://github.com/kushyanthpothi/employeerecordsystem",
        image: "https://i.ibb.co/ffTn15M/Untitled-design-1.png"
    }
};

// Slug to key mapping
const slugToKey = {
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
        "isPartOf": {"@id": "https://kushyanth-portfolio.web.app/#website"},
        "about": {"@id": "https://kushyanth-portfolio.web.app/#person"},
        "mainEntity": {"@id": `https://kushyanth-portfolio.web.app/#${slug.replace(/-/g, '')}`}
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
        "author": {"@id": "https://kushyanth-portfolio.web.app/#person"},
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
