import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import ClientLayout from "../components/ClientLayout";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  metadataBase: new URL("https://kushyanth-portfolio.web.app"),
  title: {
    default: "Kushyanth Pothineni - Expert Software Developer | React.js Next.js Django Python",
    template: "%s | Kushyanth Pothineni - Software Developer"
  },
  description: "🚀 Kushyanth Pothineni - Expert Software Developer from Guntur, AP, India. Specializing in React.js, Next.js, Django, Python, JavaScript, AWS. 50+ projects including AI Interview Assistant, Event Management Platform. Available for hire worldwide.",
  keywords: [
    // Primary Keywords
    "Kushyanth Pothineni", "Software Developer", "Full Stack Developer", "React.js Developer", 
    "Next.js Expert", "Django Developer", "Python Developer", "JavaScript Expert",
    
    // Location Keywords
    "Software Developer Guntur", "Full Stack Developer Andhra Pradesh", "React Developer India",
    "Freelance Developer Guntur AP", "Remote Software Developer India",
    
    // Technology Keywords
    "React.js Next.js Django", "Python JavaScript TypeScript", "AWS Firebase MongoDB",
    "Mobile App Development", "AI Integration", "Machine Learning", "ServiceNow Certified",
    
    // Service Keywords
    "Available for Hire", "Freelance Software Developer", "Custom Web Development",
    "Mobile App Development Services", "API Development", "Full Stack Solutions",
    
    // Project Keywords
    "AI Interview Assistant", "Event Management Platform", "Android QR Scanner",
    "Note Taking App", "YouTube Downloader", "Employee Management System"
  ],
  authors: [{ name: "Kushyanth Pothineni", url: "https://kushyanth-portfolio.web.app" }],
  creator: "Kushyanth Pothineni",
  publisher: "Kushyanth Pothineni",
  
  // Enhanced Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Kushyanth Pothineni - Expert Software Developer | React.js Next.js Django',
    description: "Expert Software Developer from Guntur, AP. Specializing in React.js, Next.js, Django, Python. 50+ projects including AI Interview Assistant. Available for hire worldwide.",
    url: 'https://kushyanth-portfolio.web.app',
    siteName: 'Kushyanth Pothineni Portfolio',
    images: [{
      url: 'https://i.ibb.co/CpW4rW5s/picofme-2.png',
      width: 1200,
      height: 630,
      alt: 'Kushyanth Pothineni - Expert Software Developer',
    }],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    site: '@KushyanthPothi1',
    creator: '@KushyanthPothi1',
    title: 'Kushyanth Pothineni - Expert Software Developer | React.js Next.js Django',
    description: "Expert Software Developer specializing in React.js, Next.js, Django, Python. AI Interview Assistant creator. Available for hire worldwide.",
    images: ['https://i.ibb.co/CpW4rW5s/picofme-2.png']
  },
  
  // Technical SEO
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  verification: {
    google: "HOxjOBPh1Ql-_wTVd1jeYAetMmoBBv80DCVeeCxCVKE",
  },
  
  alternates: {
    canonical: "/",
    languages: { 'en-US': '/en-US', 'en': '/' },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Essential Meta Tags */}
        <meta name="author" content="Kushyanth Pothineni" />
        <meta name="geo.region" content="IN-AP" />
        <meta name="geo.placename" content="Guntur, Andhra Pradesh, India" />
        <meta name="geo.position" content="16.2973;80.4370" />
        
        {/* Performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Comprehensive Structured Data for Main Site + Project Sublinks */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://kushyanth-portfolio.web.app/#person",
                  "name": "Kushyanth Pothineni",
                  "givenName": "Kushyanth",
                  "familyName": "Pothineni",
                  "url": "https://kushyanth-portfolio.web.app",
                  "image": "https://i.ibb.co/CpW4rW5s/picofme-2.png",
                  "jobTitle": "Expert Software Developer",
                  "description": "Expert Software Developer specializing in React.js, Next.js, Django, Python, JavaScript, AI integration, and full-stack development with 50+ successful projects.",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Guntur",
                    "addressRegion": "Andhra Pradesh",
                    "addressCountry": "IN"
                  },
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 16.2973,
                    "longitude": 80.4370
                  },
                  "email": "pothineni.kushyanth@gmail.com",
                  "telephone": "+91-8125144235",
                  "sameAs": [
                    "https://github.com/kushyanthpothi/",
                    "https://www.linkedin.com/in/kushyanth-pothineni/",
                    "https://x.com/KushyanthPothi1"
                  ],
                  "knowsAbout": [
                    "React.js", "Next.js", "Django", "Python", "JavaScript", "TypeScript",
                    "AWS", "Firebase", "MongoDB", "PostgreSQL", "Android Development",
                    "AI Integration", "Machine Learning", "Full Stack Development"
                  ],
                  "hasCredential": [
                    {
                      "@type": "EducationalOccupationalCredential",
                      "name": "ServiceNow Certified System Administrator"
                    },
                    {
                      "@type": "EducationalOccupationalCredential", 
                      "name": "AWS Academy Machine Learning Foundations"
                    },
                    {
                      "@type": "EducationalOccupationalCredential",
                      "name": "Wipro Java Full Stack Certification"
                    }
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://kushyanth-portfolio.web.app/#website",
                  "url": "https://kushyanth-portfolio.web.app",
                  "name": "Kushyanth Pothineni - Expert Software Developer Portfolio",
                  "description": "Professional portfolio showcasing software development expertise, projects, and services",
                  "publisher": {"@id": "https://kushyanth-portfolio.web.app/#person"},
                  "mainEntity": {"@id": "https://kushyanth-portfolio.web.app/#person"},
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                      "@type": "EntryPoint",
                      "urlTemplate": "https://kushyanth-portfolio.web.app/?search={search_term_string}"
                    },
                    "query-input": "required name=search_term_string"
                  },
                  "hasPart": [
                    {"@id": "https://kushyanth-portfolio.web.app/projects/"},
                    {"@id": "https://kushyanth-portfolio.web.app/projects/instans/"},
                    {"@id": "https://kushyanth-portfolio.web.app/projects/event-mania/"},
                    {"@id": "https://kushyanth-portfolio.web.app/projects/pro-reader/"},
                    {"@id": "https://kushyanth-portfolio.web.app/projects/youtube-downloader/"},
                    {"@id": "https://kushyanth-portfolio.web.app/projects/pin-noter/"},
                    {"@id": "https://kushyanth-portfolio.web.app/projects/employee-record-system/"}
                  ]
                },
                {
                  "@type": "CollectionPage",
                  "@id": "https://kushyanth-portfolio.web.app/projects/",
                  "url": "https://kushyanth-portfolio.web.app/projects/",
                  "name": "Projects - Kushyanth Pothineni Software Developer",
                  "description": "Portfolio of software development projects including AI Interview Assistant, Event Management Platform, and mobile applications",
                  "isPartOf": {"@id": "https://kushyanth-portfolio.web.app/#website"},
                  "mainEntity": {"@id": "https://kushyanth-portfolio.web.app/#projectlist"}
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://kushyanth-portfolio.web.app/projects/instans/",
                  "url": "https://kushyanth-portfolio.web.app/projects/instans/",
                  "name": "Instans - AI Interview Assistant",
                  "description": "AI-powered interview preparation assistant with real-time screen sharing and intelligent chat capabilities using Google's Generative AI",
                  "applicationCategory": "EducationalApplication",
                  "operatingSystem": "Web Browser",
                  "author": {"@id": "https://kushyanth-portfolio.web.app/#person"},
                  "programmingLanguage": ["Next.js 14", "React 19", "TypeScript", "JavaScript"],
                  "featureList": ["AI Interview Coaching", "Real-time Screen Sharing", "Voice Input", "Technical Problem Solving"],
                  "isPartOf": {"@id": "https://kushyanth-portfolio.web.app/#website"}
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://kushyanth-portfolio.web.app/projects/event-mania/",
                  "url": "https://kushyanth-portfolio.web.app/projects/event-mania/",
                  "name": "Event Mania - Event Management Platform",
                  "description": "Comprehensive event management platform for colleges and students with real-time updates and multi-role support",
                  "applicationCategory": "ProductivityApplication",
                  "operatingSystem": "Web Browser",
                  "author": {"@id": "https://kushyanth-portfolio.web.app/#person"},
                  "programmingLanguage": ["React.js", "JavaScript", "Firebase"],
                  "featureList": ["Event Creation", "Student Registration", "Real-time Updates", "Multi-role Authentication"],
                  "isPartOf": {"@id": "https://kushyanth-portfolio.web.app/#website"}
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://kushyanth-portfolio.web.app/projects/pro-reader/",
                  "url": "https://kushyanth-portfolio.web.app/projects/pro-reader/",
                  "name": "Pro Reader - QR Code Scanner App",
                  "description": "Feature-rich Android application for QR code scanning, speech-to-text conversion, and text extraction with offline capabilities",
                  "applicationCategory": "MobileApplication",
                  "operatingSystem": "Android",
                  "author": {"@id": "https://kushyanth-portfolio.web.app/#person"},
                  "programmingLanguage": ["Java", "Kotlin", "Android SDK"],
                  "featureList": ["QR Code Scanning", "Speech-to-Text", "Text Extraction", "Offline Support"],
                  "isPartOf": {"@id": "https://kushyanth-portfolio.web.app/#website"}
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://kushyanth-portfolio.web.app/projects/youtube-downloader/",
                  "url": "https://kushyanth-portfolio.web.app/projects/youtube-downloader/",
                  "name": "YouTube Video & Audio Downloader",
                  "description": "Django-based application for downloading YouTube videos and audio with customizable quality options and format selection",
                  "applicationCategory": "WebApplication",
                  "operatingSystem": "Web Browser",
                  "author": {"@id": "https://kushyanth-portfolio.web.app/#person"},
                  "programmingLanguage": ["Django", "Python", "HTML5", "CSS3"],
                  "featureList": ["Video Download", "Audio Extraction", "Quality Selection", "Format Options"],
                  "isPartOf": {"@id": "https://kushyanth-portfolio.web.app/#website"}
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://kushyanth-portfolio.web.app/projects/pin-noter/",
                  "url": "https://kushyanth-portfolio.web.app/projects/pin-noter/",
                  "name": "Pin Noter - Note Taking App",
                  "description": "React-based note-taking application with rich text formatting, offline caching, and cloud synchronization capabilities",
                  "applicationCategory": "WebApplication",
                  "operatingSystem": "Web Browser",
                  "author": {"@id": "https://kushyanth-portfolio.web.app/#person"},
                  "programmingLanguage": ["React.js", "JavaScript", "Firebase"],
                  "featureList": ["Rich Text Formatting", "Offline Caching", "Cloud Synchronization", "Note Organization"],
                  "isPartOf": {"@id": "https://kushyanth-portfolio.web.app/#website"}
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://kushyanth-portfolio.web.app/projects/employee-record-system/",
                  "url": "https://kushyanth-portfolio.web.app/projects/employee-record-system/",
                  "name": "Employee Record System",
                  "description": "Comprehensive Django-based employee management system with dual interface design and role-based authentication for organizations",
                  "applicationCategory": "WebApplication",
                  "operatingSystem": "Web Browser",
                  "author": {"@id": "https://kushyanth-portfolio.web.app/#person"},
                  "programmingLanguage": ["Django", "Python", "MySQL", "Bootstrap"],
                  "featureList": ["Employee Management", "Profile Management", "Role-based Access", "Education Tracking"],
                  "isPartOf": {"@id": "https://kushyanth-portfolio.web.app/#website"}
                },
                {
                  "@type": "ItemList",
                  "@id": "https://kushyanth-portfolio.web.app/#projectlist",
                  "name": "Kushyanth Pothineni Software Projects",
                  "description": "Featured software development projects showcasing expertise in React.js, Django, Android development, and AI integration",
                  "numberOfItems": 6,
                  "itemListElement": [
                    {
                      "@type": "ListItem",
                      "position": 1,
                      "item": {"@id": "https://kushyanth-portfolio.web.app/projects/instans/"}
                    },
                    {
                      "@type": "ListItem", 
                      "position": 2,
                      "item": {"@id": "https://kushyanth-portfolio.web.app/projects/event-mania/"}
                    },
                    {
                      "@type": "ListItem",
                      "position": 3,
                      "item": {"@id": "https://kushyanth-portfolio.web.app/projects/pro-reader/"}
                    },
                    {
                      "@type": "ListItem",
                      "position": 4,
                      "item": {"@id": "https://kushyanth-portfolio.web.app/projects/youtube-downloader/"}
                    },
                    {
                      "@type": "ListItem",
                      "position": 5,
                      "item": {"@id": "https://kushyanth-portfolio.web.app/projects/pin-noter/"}
                    },
                    {
                      "@type": "ListItem",
                      "position": 6,
                      "item": {"@id": "https://kushyanth-portfolio.web.app/projects/employee-record-system/"}
                    }
                  ]
                },
                {
                  "@type": "SiteNavigationElement",
                  "@id": "https://kushyanth-portfolio.web.app/#navigation",
                  "name": "Main Navigation",
                  "url": "https://kushyanth-portfolio.web.app",
                  "hasPart": [
                    {
                      "@type": "SiteNavigationElement",
                      "name": "Projects",
                      "url": "https://kushyanth-portfolio.web.app/projects/",
                      "description": "Software development projects portfolio",
                      "hasPart": [
                        {
                          "@type": "SiteNavigationElement",
                          "name": "Instans - AI Interview Assistant",
                          "url": "https://kushyanth-portfolio.web.app/projects/instans/",
                          "description": "AI-powered interview preparation with screen sharing"
                        },
                        {
                          "@type": "SiteNavigationElement",
                          "name": "Event Mania - Event Management",
                          "url": "https://kushyanth-portfolio.web.app/projects/event-mania/",
                          "description": "College event management platform"
                        },
                        {
                          "@type": "SiteNavigationElement",
                          "name": "Pro Reader - QR Scanner",
                          "url": "https://kushyanth-portfolio.web.app/projects/pro-reader/",
                          "description": "Android QR code scanner with OCR"
                        },
                        {
                          "@type": "SiteNavigationElement",
                          "name": "YouTube Downloader",
                          "url": "https://kushyanth-portfolio.web.app/projects/youtube-downloader/",
                          "description": "Video and audio download tool"
                        },
                        {
                          "@type": "SiteNavigationElement",
                          "name": "Pin Noter - Note Taking",
                          "url": "https://kushyanth-portfolio.web.app/projects/pin-noter/",
                          "description": "Rich text note-taking application"
                        },
                        {
                          "@type": "SiteNavigationElement",
                          "name": "Employee Record System",
                          "url": "https://kushyanth-portfolio.web.app/projects/employee-record-system/",
                          "description": "HR management system"
                        }
                      ]
                    }
                  ]
                },
                {
                  "@type": "BreadcrumbList",
                  "@id": "https://kushyanth-portfolio.web.app/#breadcrumb",
                  "itemListElement": [
                    {
                      "@type": "ListItem",
                      "position": 1,
                      "name": "Kushyanth Pothineni - Software Developer",
                      "item": "https://kushyanth-portfolio.web.app"
                    },
                    {
                      "@type": "ListItem",
                      "position": 2,
                      "name": "Projects Portfolio",
                      "item": "https://kushyanth-portfolio.web.app/projects/"
                    }
                  ]
                }
              ]
            })
          }}
        />
      </head>
      <body className={`${nunitoSans.variable} font-nunito antialiased`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}