import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import ClientLayout from "../components/ClientLayout";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  weight: ['200', '300', '400', '500', '600', '700', '800', '900', '1000'],
});

export const metadata = {
  metadataBase: new URL("https://kushyanth-portfolio.web.app"),
  title: {
    default: "Kushyanth Pothineni | Expert Software Developer & Full Stack Engineer Portfolio",
    template: "%s | Kushyanth Pothineni - Expert Software Developer & Full Stack Engineer"
  },
  description: {
    default: "🚀 Top-rated Software Developer Portfolio of Kushyanth Pothineni - Expert Full Stack Developer specializing in React.js, Next.js, Django, Python, JavaScript, and modern web technologies. Certified AWS & ServiceNow Professional with 50+ successful projects. Available for freelance work and hiring. View my cutting-edge projects and download resume.",
  },
  keywords: [
    // Primary Keywords
    "Kushyanth Pothineni",
    "Expert Software Developer",
    "Top Full Stack Developer",
    "Professional Web Developer",
    "Senior Frontend Developer",
    "Backend Development Expert",
    "React.js Specialist",
    "Next.js Expert Developer",
    "Django Professional",
    "Python Developer Expert",
    "JavaScript Professional",
    "AWS Certified Developer",
    "ServiceNow Certified Professional",
    
    // Technical Skills
    "React.js Development",
    "Next.js Applications",
    "Django Framework",
    "Python Programming",
    "JavaScript ES6+",
    "TypeScript Development",
    "Node.js Backend",
    "Firebase Integration",
    "MongoDB Database",
    "PostgreSQL Expert",
    "MySQL Administration",
    "REST API Development",
    "GraphQL Implementation",
    "Microservices Architecture",
    "Docker Containerization",
    "Kubernetes Orchestration",
    "CI/CD Pipeline",
    "Git Version Control",
    "Agile Development",
    "Test Driven Development",
    "DevOps Engineering",
    "Cloud Computing",
    "AWS Services",
    "Azure Cloud Platform",
    "Google Cloud Platform",
    
    // Mobile & UI/UX
    "Android Development",
    "Mobile App Development",
    "React Native",
    "Flutter Development",
    "UI/UX Design",
    "Responsive Web Design",
    "Material-UI",
    "Tailwind CSS",
    "Bootstrap Framework",
    "CSS3 Animation",
    "HTML5 Semantic",
    "Progressive Web Apps",
    "Single Page Applications",
    
    // Location-based Keywords
    "Software Developer Guntur",
    "Full Stack Developer Andhra Pradesh",
    "Web Developer India",
    "React Developer Guntur AP",
    "Python Developer India",
    "Freelance Developer India",
    "Remote Software Developer",
    "Indian Software Engineer",
    "Guntur Tech Professional",
    "Andhra Pradesh Developer",
    
    // Industry & Specialization
    "FinTech Developer",
    "E-commerce Developer",
    "SaaS Application Developer",
    "Healthcare Software Developer",
    "EdTech Solutions",
    "Enterprise Software",
    "Startup Technology Consultant",
    "Digital Transformation Expert",
    "API Integration Specialist",
    "Database Optimization Expert",
    
    // Project-specific
    "Event Management Platform",
    "QR Code Scanner App",
    "Note Taking Application",
    "YouTube Downloader Tool",
    "Real-time Chat Applications",
    "E-learning Platforms",
    "Inventory Management Systems",
    "Customer Relationship Management",
    
    // Career & Services
    "Software Development Services",
    "Web Application Development",
    "Custom Software Solutions",
    "Technology Consulting",
    "Code Review Services",
    "Software Architecture Design",
    "Performance Optimization",
    "Security Implementation",
    "Maintenance & Support",
    "Legacy System Migration",
    
    // Certifications & Education
    "AWS Certified",
    "ServiceNow Administrator",
    "Machine Learning Certified",
    "Java Full Stack Certified",
    "NPTEL IoT Certified",
    "Responsive Design Certified",
    "Computer Science Graduate",
    "Technical Certification Holder",
    
    // Long-tail Keywords
    "Hire Experienced Software Developer",
    "Professional Portfolio Website",
    "Custom Web Development Services",
    "Enterprise Software Solutions",
    "Scalable Web Applications",
    "Modern Frontend Development",
    "Backend API Development",
    "Database Design & Development",
    "Cloud Migration Services",
    "Software Performance Optimization",
    "Security-focused Development",
    "Agile Project Management",
    "Technical Leadership",
    "Code Quality Assurance",
    "Cross-platform Development",
    
    // Trending Technologies
    "Artificial Intelligence Integration",
    "Machine Learning Applications",
    "Internet of Things Development",
    "Blockchain Development",
    "Serverless Architecture",
    "Edge Computing",
    "Progressive Web Apps",
    "Jamstack Development",
    "Headless CMS Integration",
    "WebAssembly Applications"
  ],
  authors: [
    {
      name: "Kushyanth Pothineni",
      url: "https://kushyanth-portfolio.web.app"
    }
  ],
  creator: "Kushyanth Pothineni",
  publisher: "Kushyanth Pothineni",
  category: "Technology",
  classification: "Software Development Portfolio",
  alternates: {
    canonical: "/",
    languages: {
      'en-US': '/en-US',
      'en': '/',
    },
    types: {
      'application/rss+xml': '/feed.xml',
      'application/xml': '/sitemap.xml'
    }
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
      noimageindex: false,
      noarchive: false,
      nosnippet: false,
    },
    bingBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Kushyanth Pothineni | Expert Software Developer & Full Stack Engineer Portfolio',
    description: "🚀 Top-rated Software Developer Portfolio of Kushyanth Pothineni - Expert Full Stack Developer specializing in React.js, Next.js, Django, Python, JavaScript, and modern web technologies. Certified AWS & ServiceNow Professional with 50+ successful projects. Available for freelance work and hiring. View my cutting-edge projects and download resume.",
    url: 'https://kushyanth-portfolio.web.app',
    siteName: 'Kushyanth Pothineni - Expert Software Developer Portfolio',
    images: [
      {
        url: 'https://i.ibb.co/CpW4rW5s/picofme-2.png',
        width: 1200,
        height: 630,
        alt: 'Kushyanth Pothineni - Expert Software Developer & Full Stack Engineer',
        type: 'image/png',
      },
      {
        url: 'https://i.ibb.co/mFFtB0B/AWS-Academy-Machine-Learning-Foundations-page-0001.jpg',
        width: 800,
        height: 600,
        alt: 'AWS Academy Machine Learning Foundations Certificate - Kushyanth Pothineni',
      },
      {
        url: 'https://i.ibb.co/vPfStSV/Wipro-Certificate.png',
        width: 800,
        height: 600,
        alt: 'Wipro Talent Next Java Full Stack Certificate - Kushyanth Pothineni',
      },
      {
        url: 'https://i.ibb.co/rdvfGyY/image.png',
        width: 800,
        height: 600,
        alt: 'Responsive Web Designer Certificate - Kushyanth Pothineni',
      },
      {
        url: 'https://i.ibb.co/gjkdXfn/NPTEL-Introduction-To-Internet-Of-Things-page-0001.jpg',
        width: 800,
        height: 600,
        alt: 'NPTEL Introduction To Internet Of Things Certificate - Kushyanth Pothineni',
      },
      {
        url: 'https://i.ibb.co/6nzykQ3/1735105593467-page-0001.jpg',
        width: 800,
        height: 600,
        alt: 'Junior Software Developer Certificate - Kushyanth Pothineni',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@KushyanthPothi1',
    creator: '@KushyanthPothi1',
    title: 'Kushyanth Pothineni | Expert Software Developer & Full Stack Engineer Portfolio',
    description: "🚀 Top-rated Software Developer Portfolio of Kushyanth Pothineni - Expert Full Stack Developer specializing in React.js, Next.js, Django, Python, JavaScript, and modern web technologies. Certified AWS & ServiceNow Professional with 50+ successful projects.",
    images: [
      {
        url: 'https://i.ibb.co/CpW4rW5s/picofme-2.png',
        alt: 'Kushyanth Pothineni - Expert Software Developer & Full Stack Engineer',
        width: 1200,
        height: 630,
      }
    ]
  },
  verification: {
    google: "HOxjOBPh1Ql-_wTVd1jeYAetMmoBBv80DCVeeCxCVKE",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="author" content="Kushyanth Pothineni" />
        <meta name="geo.region" content="IN-AP" />
        <meta name="geo.placename" content="Guntur, Andhra Pradesh" />
        <meta name="geo.position" content="16.2973;80.4370" />
        <meta name="ICBM" content="16.2973, 80.4370" />
        <meta name="google-site-verification" content="HOxjOBPh1Ql-_wTVd1jeYAetMmoBBv80DCVeeCxCVKE" />
        <meta name="msvalidate.01" content="your-bing-verification-code" />
        <meta name="yandex-verification" content="your-yandex-verification-code" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Kushyanth Pothineni Portfolio" />
        <meta name="twitter:site" content="@KushyanthPothi1" />
        <meta name="twitter:creator" content="@KushyanthPothi1" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="canonical" href="https://kushyanth-portfolio.web.app" />
        <link rel="alternate" type="application/rss+xml" title="Kushyanth Pothineni Portfolio" href="https://kushyanth-portfolio.web.app/feed.xml" />
        <link rel="sitemap" type="application/xml" href="https://kushyanth-portfolio.web.app/sitemap.xml" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://kushyanth-portfolio.web.app/#website",
                  "url": "https://kushyanth-portfolio.web.app",
                  "name": "Kushyanth Pothineni Portfolio",
                  "description": "Portfolio of Kushyanth Pothineni, a Software Developer specializing in various technologies including React.js, Next.js, Django, and more.",
                  "publisher": {"@id": "https://kushyanth-portfolio.web.app/#person"},
                  "potentialAction": [
                    {
                      "@type": "SearchAction",
                      "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": "https://kushyanth-portfolio.web.app/?search={search_term_string}"
                      },
                      "query-input": "required name=search_term_string"
                    }
                  ],
                  "mainEntity": {"@id": "https://kushyanth-portfolio.web.app/#person"},
                  "hasPart": [
                    {"@id": "https://kushyanth-portfolio.web.app/#webpage"},
                    {"@id": "https://kushyanth-portfolio.web.app/projects/#projectspage"},
                    {"@id": "https://kushyanth-portfolio.web.app/#event-mania"},
                    {"@id": "https://kushyanth-portfolio.web.app/#pro-reader"},
                    {"@id": "https://kushyanth-portfolio.web.app/#pin-noter"},
                    {"@id": "https://kushyanth-portfolio.web.app/#youtube-downloader"}
                  ]
                },
                {
                  "@type": "Organization",
                  "@id": "https://kushyanth-portfolio.web.app/#organization",
                  "name": "Kushyanth Pothineni Software Development",
                  "url": "https://kushyanth-portfolio.web.app",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://i.ibb.co/CpW4rW5s/picofme-2.png",
                    "width": 800,
                    "height": 600
                  },
                  "contactPoint": [
                    {
                      "@type": "ContactPoint",
                      "telephone": "+91-8125144235",
                      "contactType": "customer service",
                      "email": "pothineni.kushyanth@gmail.com",
                      "areaServed": "IN",
                      "availableLanguage": ["English", "Telugu", "Hindi"]
                    }
                  ],
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Guntur",
                    "addressRegion": "Andhra Pradesh",
                    "addressCountry": "IN"
                  },
                  "founder": {"@id": "https://kushyanth-portfolio.web.app/#person"}
                },
                {
                  "@type": "Person",
                  "@id": "https://kushyanth-portfolio.web.app/#person",
                  "name": "Kushyanth Pothineni",
                  "alternateName": ["Kushyanth", "Kushyanth P", "K Pothineni"],
                  "url": "https://kushyanth-portfolio.web.app",
                  "image": {
                    "@type": "ImageObject",
                    "@id": "https://kushyanth-portfolio.web.app/#personImage",
                    "url": "https://i.ibb.co/CpW4rW5s/picofme-2.png",
                    "caption": "Kushyanth Pothineni - Software Developer",
                    "width": 800,
                    "height": 600
                  },
                  "jobTitle": ["Software Developer", "Full Stack Developer", "Frontend Developer", "Backend Developer"],
                  "description": "Software Developer with expertise in Full Stack, Frontend, and Backend development, specializing in building responsive, scalable, and user-friendly web and mobile applications using modern technologies like React.js, Next.js, Django, and more.",
                  "birthPlace": {
                    "@type": "Place",
                    "name": "Guntur, Andhra Pradesh, India"
                  },
                  "nationality": "Indian",
                  "email": "pothineni.kushyanth@gmail.com",
                  "telephone": "+91-8125144235",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Guntur",
                    "addressRegion": "Andhra Pradesh",
                    "addressCountry": "IN"
                  },
                  "sameAs": [
                    "https://github.com/kushyanthpothi/",
                    "https://www.linkedin.com/in/kushyanth-pothineni/",
                    "https://x.com/KushyanthPothi1",
                    "https://drive.google.com/file/d/1QdWYq6ditLGmzjzqcEITSwpAC9x-ZXUN/view?usp=sharing"
                  ],
                  "knowsAbout": [
                    "React.js", "Next.js", "Django", "Java", "Python", "JavaScript",
                    "Firebase", "MongoDB", "PostgreSQL", "MySQL", "AWS", "HTML5", "CSS3",
                    "Frontend Development", "Backend Development", "Full Stack Development", 
                    "Web Applications", "Mobile Applications", "UI/UX Development",
                    "API Development", "Database Design", "Software Architecture",
                    "Agile Development", "Git Version Control", "DevOps", "Cloud Computing",
                    "Machine Learning", "Internet of Things", "ServiceNow Administration",
                    "Responsive Web Design", "Android Development", "REST APIs"
                  ],
                  "alumniOf": [
                    {
                      "@type": "EducationalOrganization",
                      "name": "KKR & KSR Institute of Technology and Sciences",
                      "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Guntur",
                        "addressRegion": "Andhra Pradesh",
                        "addressCountry": "IN"
                      }
                    },
                    {
                      "@type": "EducationalOrganization",
                      "name": "Wipro Talent Next",
                      "description": "Java Full Stack Development Program"
                    }
                  ],
                  "worksFor": [
                    {
                      "@type": "Organization",
                      "name": "NinjaCart",
                      "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Bangalore",
                        "addressRegion": "Karnataka",
                        "addressCountry": "IN"
                      },
                      "description": "Software Developer Intern - API Development and Optimization"
                    }
                  ],
                  "hasCredential": [
                    {
                      "@type": "EducationalOccupationalCredential",
                      "@id": "https://kushyanth-portfolio.web.app/#servicenow-cert",
                      "name": "ServiceNow Certified System Administrator",
                      "description": "Professional certification in ServiceNow platform administration, workflow design, and system configuration.",
                      "url": "https://drive.google.com/file/d/1QdWYq6ditLGmzjzqcEITSwpAC9x-ZXUN/view?usp=sharing",
                      "validFrom": "2024-01-15",
                      "educationalLevel": "Professional Certificate",
                      "competencyRequired": ["ServiceNow", "System Administration", "Workflow Design"],
                      "image": {
                        "@type": "ImageObject",
                        "url": "https://i.ibb.co/5WRM8C76/Service-Now-CSA-page-0001.jpg",
                        "width": 800,
                        "height": 600,
                        "caption": "ServiceNow Certified System Administrator - Kushyanth Pothineni"
                      },
                      "recognizedBy": {
                        "@type": "Organization",
                        "name": "ServiceNow"
                      }
                    },
                    {
                      "@type": "EducationalOccupationalCredential",
                      "@id": "https://kushyanth-portfolio.web.app/#aws-cert",
                      "name": "AWS Academy Machine Learning Foundations",
                      "description": "Certification in machine learning fundamentals, deep learning, and data analysis with AWS services.",
                      "url": "https://www.credly.com/badges/446553a7-d24b-4955-889e-55eec636f750/linked_in_profile",
                      "validFrom": "2023-01-15",
                      "educationalLevel": "Professional Certificate",
                      "competencyRequired": ["Machine Learning", "AWS", "Data Analysis", "Deep Learning"],
                      "image": {
                        "@type": "ImageObject",
                        "url": "https://i.ibb.co/mFFtB0B/AWS-Academy-Machine-Learning-Foundations-page-0001.jpg",
                        "width": 800,
                        "height": 600,
                        "caption": "AWS Academy Machine Learning Foundations Certificate - Kushyanth Pothineni"
                      },
                      "recognizedBy": {
                        "@type": "Organization",
                        "name": "Amazon Web Services"
                      }
                    },
                    {
                      "@type": "EducationalOccupationalCredential",
                      "@id": "https://kushyanth-portfolio.web.app/#wipro-cert",
                      "name": "Wipro Talent Next Java Full Stack Certification",
                      "description": "Professional certification in Java Full Stack development, including Spring Boot, Hibernate, and frontend technologies.",
                      "url": "https://cert.diceid.com/cid/xNkRt2LMUe",
                      "validFrom": "2022-08-20",
                      "educationalLevel": "Professional Certificate",
                      "competencyRequired": ["Java", "Spring Boot", "Full Stack Development", "Hibernate"],
                      "image": {
                        "@type": "ImageObject",
                        "url": "https://i.ibb.co/vPfStSV/Wipro-Certificate.png",
                        "width": 800,
                        "height": 600,
                        "caption": "Wipro Talent Next Java Full Stack Certificate - Kushyanth Pothineni"
                      },
                      "recognizedBy": {
                        "@type": "Organization",
                        "name": "Wipro"
                      }
                    },
                    {
                      "@type": "EducationalOccupationalCredential",
                      "@id": "https://kushyanth-portfolio.web.app/#responsive-cert",
                      "name": "Responsive Web Designer Certification",
                      "description": "Certification in responsive web design principles, HTML5, CSS3, and modern web development techniques.",
                      "url": "https://www.freecodecamp.org/certification/Kushyanthpothi/responsive-web-design",
                      "validFrom": "2021-09-15",
                      "educationalLevel": "Professional Certificate",
                      "competencyRequired": ["Responsive Web Design", "HTML5", "CSS3", "Flexbox", "CSS Grid"],
                      "image": {
                        "@type": "ImageObject",
                        "url": "https://i.ibb.co/rdvfGyY/image.png",
                        "width": 800,
                        "height": 600,
                        "caption": "Responsive Web Designer Certificate - Kushyanth Pothineni"
                      },
                      "recognizedBy": {
                        "@type": "Organization",
                        "name": "freeCodeCamp"
                      }
                    },
                    {
                      "@type": "EducationalOccupationalCredential",
                      "@id": "https://kushyanth-portfolio.web.app/#nptel-cert",
                      "name": "NPTEL Introduction To Internet Of Things",
                      "description": "Certification in IoT fundamentals, sensors, connectivity, and IoT system design from NPTEL.",
                      "url": "https://nptel.ac.in/noc/E_Certificate/NPTEL24CS35S65630220730556258",
                      "validFrom": "2021-11-30",
                      "educationalLevel": "Professional Certificate",
                      "competencyRequired": ["Internet of Things", "Embedded Systems", "Sensors", "IoT Architecture"],
                      "image": {
                        "@type": "ImageObject",
                        "url": "https://i.ibb.co/gjkdXfn/NPTEL-Introduction-To-Internet-Of-Things-page-0001.jpg",
                        "width": 800,
                        "height": 600,
                        "caption": "NPTEL Introduction To Internet Of Things Certificate - Kushyanth Pothineni"
                      },
                      "recognizedBy": {
                        "@type": "Organization",
                        "name": "NPTEL"
                      }
                    },
                    {
                      "@type": "EducationalOccupationalCredential",
                      "@id": "https://kushyanth-portfolio.web.app/#jsd-cert",
                      "name": "Junior Software Developer",
                      "description": "Certification validating skills in software development methodologies, programming, and industry best practices.",
                      "url": "https://drive.google.com/file/d/1q3-3-lYH3mm08gcnGXN66SIFSRwyQm0u/view?usp=sharing",
                      "validFrom": "2024-12-25",
                      "educationalLevel": "Professional Certificate",
                      "competencyRequired": ["Software Development", "Programming", "Problem Solving", "SDLC"],
                      "image": {
                        "@type": "ImageObject",
                        "url": "https://i.ibb.co/6nzykQ3/1735105593467-page-0001.jpg",
                        "width": 800,
                        "height": 600,
                        "caption": "Junior Software Developer Certificate - Kushyanth Pothineni"
                      }
                    },
                    {
                      "@type": "EducationalOccupationalCredential",
                      "@id": "https://kushyanth-portfolio.web.app/#digital-marketing-cert",
                      "name": "The Fundamentals of Digital Marketing",
                      "description": "Google certification covering digital marketing fundamentals, SEO, SEM, and online marketing strategies.",
                      "url": "https://learndigital.withgoogle.com/link/1qsdpcedm9s",
                      "validFrom": "2023-06-10",
                      "educationalLevel": "Professional Certificate",
                      "competencyRequired": ["Digital Marketing", "SEO", "SEM", "Online Advertising"],
                      "image": {
                        "@type": "ImageObject",
                        "url": "https://i.ibb.co/8gqNBvR/Google-Digital-Garage-The-fundamentals-of-digital-marketing-page-0001.jpg",
                        "width": 800,
                        "height": 600,
                        "caption": "Google Digital Marketing Certificate - Kushyanth Pothineni"
                      },
                      "recognizedBy": {
                        "@type": "Organization",
                        "name": "Google"
                      }
                    }
                  ],
                  "workExample": [
                    {
                      "@type": "SoftwareSourceCode",
                      "@id": "https://kushyanth-portfolio.web.app/#instans",
                      "name": "Instans",
                      "codeRepository": "https://github.com/kushyanthpothi/instans",
                      "description": "Instans is an AI-powered interview preparation assistant that combines real-time screen sharing with intelligent chat capabilities. The platform leverages Google's Generative AI to provide personalized interview coaching, technical problem-solving guidance, and resume analysis.",
                      "programmingLanguage": ["Next.js 14", "React 19", "TypeScript", "TailwindCSS", "Google Generative AI"],
                      "image": "https://i.ibb.co/QFQjPLyn/Airbrush-image-extender-1.jpg",
                      "url": "https://kushyanth-portfolio.web.app/projects/instans",
                      "author": {"@id": "https://kushyanth-portfolio.web.app/#person"},
                      "dateCreated": "2024-11-01",
                      "dateModified": "2024-12-25",
                      "keywords": ["AI Interview Assistant", "Screen Sharing", "Next.js", "Google Generative AI", "TypeScript", "Interview Preparation"],
                      "mainEntity": {
                        "@type": "SoftwareApplication",
                        "name": "Instans",
                        "description": "Instans is a comprehensive AI-powered interview preparation platform that combines advanced AI capabilities with practical features like screen sharing for live code review and system design whiteboarding.",
                        "applicationCategory": "WebApplication",
                        "operatingSystem": "Web Browser",
                        "url": "https://instans.netlify.app/",
                        "softwareVersion": "1.0",
                        "featureList": ["AI-powered Interview Coaching", "Real-time Screen Sharing", "Voice Input", "Dark/Light Theme", "Technical Problem Solving", "Resume Analysis"],
                        "offers": {
                          "@type": "Offer",
                          "price": "0",
                          "priceCurrency": "USD"
                        }
                      }
                    },
                    {
                      "@type": "SoftwareSourceCode",
                      "@id": "https://kushyanth-portfolio.web.app/#event-mania",
                      "name": "Event Mania",
                      "codeRepository": "https://github.com/kushyanthpothi/EventMania",
                      "description": "A comprehensive event management platform for colleges and students with real-time updates and multiple user roles.",
                      "programmingLanguage": ["React.js", "Firebase", "JavaScript", "HTML5", "CSS3"],
                      "image": "https://i.ibb.co/gJQKjNK/Event-Mania-Design.png",
                      "url": "https://kushyanth-portfolio.web.app/projects/event-mania",
                      "author": {"@id": "https://kushyanth-portfolio.web.app/#person"},
                      "dateCreated": "2023-08-15",
                      "dateModified": "2024-01-20",
                      "keywords": ["Event Management", "React.js", "Firebase", "Real-time", "Authentication"],
                      "mainEntity": {
                        "@type": "SoftwareApplication",
                        "name": "Event Mania",
                        "description": "Event Mania is a one-stop platform designed to simplify event management for colleges and students with real-time updates, secure authentication, and multiple user roles.",
                        "applicationCategory": "WebApplication",
                        "operatingSystem": "Web Browser",
                        "url": "https://ap-event-mania.web.app/",
                        "softwareVersion": "1.0",
                        "featureList": ["Event Creation", "User Registration", "Real-time Updates", "Multi-role Support"],
                        "offers": {
                          "@type": "Offer",
                          "price": "0",
                          "priceCurrency": "USD"
                        }
                      }
                    },
                    {
                      "@type": "SoftwareSourceCode",
                      "@id": "https://kushyanth-portfolio.web.app/#pro-reader",
                      "name": "Pro Reader",
                      "codeRepository": "https://github.com/kushyanthpothi/ProReader",
                      "description": "Feature-rich Android application for QR code scanning, speech-to-text conversion, and text extraction with offline capabilities.",
                      "programmingLanguage": ["Java", "Kotlin", "Android SDK", "ML Kit"],
                      "image": "https://i.ibb.co/sQYYbks/Pro-Reader-Banner-web-1.png",
                      "url": "https://kushyanth-portfolio.web.app/projects/pro-reader",
                      "author": {"@id": "https://kushyanth-portfolio.web.app/#person"},
                      "dateCreated": "2023-06-10",
                      "dateModified": "2023-12-15",
                      "keywords": ["Android", "QR Code", "Speech Recognition", "Text Extraction", "ML Kit"],
                      "mainEntity": {
                        "@type": "SoftwareApplication",
                        "name": "Pro Reader",
                        "description": "Pro Reader is a feature-packed Android application that empowers users to handle QR codes, speech recognition, and text extraction with offline capabilities and ML Kit integration.",
                        "applicationCategory": "MobileApplication",
                        "operatingSystem": "Android",
                        "softwareVersion": "1.0",
                        "featureList": ["QR Code Scanning", "Speech-to-Text", "Text Extraction", "Offline Support"],
                        "offers": {
                          "@type": "Offer",
                          "price": "0",
                          "priceCurrency": "USD"
                        }
                      }
                    },
                    {
                      "@type": "SoftwareSourceCode",
                      "@id": "https://kushyanth-portfolio.web.app/#pin-noter",
                      "name": "Pin Noter",
                      "codeRepository": "https://github.com/kushyanthpothi/pin-noter",
                      "description": "React-based note-taking application with rich text formatting, offline caching, and cloud synchronization capabilities.",
                      "programmingLanguage": ["React.js", "JavaScript", "Firebase", "HTML5", "CSS3"],
                      "image": "https://i.ibb.co/zNYpwtk/Untitled-design.png",
                      "url": "https://kushyanth-portfolio.web.app/projects/pin-noter",
                      "author": {"@id": "https://kushyanth-portfolio.web.app/#person"},
                      "dateCreated": "2023-04-20",
                      "dateModified": "2024-02-10",
                      "keywords": ["Note Taking", "React.js", "Offline Support", "Cloud Sync", "Rich Text"],
                      "mainEntity": {
                        "@type": "SoftwareApplication",
                        "name": "Pin Noter",
                        "description": "Pin Noter is a React-based note-taking application offering rich text formatting, offline caching for seamless note-taking, and automatic cloud synchronization with user authentication.",
                        "applicationCategory": "WebApplication",
                        "operatingSystem": "Web Browser",
                        "url": "https://pin-noter.web.app/",
                        "softwareVersion": "1.0",
                        "featureList": ["Rich Text Formatting", "Offline Caching", "Cloud Synchronization", "Note Pinning"],
                        "offers": {
                          "@type": "Offer",
                          "price": "0",
                          "priceCurrency": "USD"
                        }
                      }
                    },
                    {
                      "@type": "SoftwareSourceCode",
                      "@id": "https://kushyanth-portfolio.web.app/#youtube-downloader",
                      "name": "YouTube Video and Audio Downloader",
                      "codeRepository": "https://github.com/kushyanthpothi/ytdownloader",
                      "description": "Django-based application for downloading YouTube videos and audio with customizable quality options and format selection.",
                      "programmingLanguage": ["Python", "Django", "HTML5", "CSS3"],
                      "image": "https://i.ibb.co/FB9hXK8/Laptop-Design-edit.png",
                      "url": "https://kushyanth-portfolio.web.app/projects/youtube-downloader",
                      "author": {"@id": "https://kushyanth-portfolio.web.app/#person"},
                      "dateCreated": "2023-02-15",
                      "dateModified": "2023-10-20",
                      "keywords": ["YouTube Downloader", "Django", "Video Download", "Audio Extraction", "Python"],
                      "mainEntity": {
                        "@type": "SoftwareApplication",
                        "name": "YouTube Video and Audio Downloader",
                        "description": "A Django-based application that enables downloading YouTube videos and audio in various formats and resolutions with quality options and audio extraction capabilities.",
                        "applicationCategory": "WebApplication",
                        "operatingSystem": "Web Browser",
                        "softwareVersion": "1.0",
                        "featureList": ["Video Download", "Audio Extraction", "Quality Selection", "Format Options"],
                        "offers": {
                          "@type": "Offer",
                          "price": "0",
                          "priceCurrency": "USD"
                        }
                      }
                    },
                    {
                      "@type": "SoftwareSourceCode",
                      "@id": "https://kushyanth-portfolio.web.app/#employee-record-system",
                      "name": "Employee Record System",
                      "codeRepository": "https://github.com/kushyanthpothi/employeerecordsystem",
                      "description": "A comprehensive web-based employee management system built with Django, designed to streamline employee data management for organizations with dual interface system and role-based authentication.",
                      "programmingLanguage": ["Django", "Python", "MySQL", "Bootstrap", "JavaScript"],
                      "image": "https://i.ibb.co/ffTn15M/Untitled-design-1.png",
                      "url": "https://kushyanth-portfolio.web.app/projects/employee-record-system",
                      "author": {"@id": "https://kushyanth-portfolio.web.app/#person"},
                      "dateCreated": "2023-12-01",
                      "dateModified": "2024-02-15",
                      "keywords": ["Employee Management", "Django", "MySQL", "Bootstrap", "Role-based Authentication"],
                      "mainEntity": {
                        "@type": "SoftwareApplication",
                        "name": "Employee Record System",
                        "description": "A comprehensive Django-based employee management system with dual interface design, featuring admin and employee panels, profile management, education tracking, and role-based authentication.",
                        "applicationCategory": "WebApplication",
                        "operatingSystem": "Web Browser",
                        "softwareVersion": "1.0",
                        "featureList": ["Employee Management", "Profile Management", "Education Tracking", "Role-based Access", "Responsive Design"],
                        "offers": {
                          "@type": "Offer",
                          "price": "0",
                          "priceCurrency": "USD"
                        }
                      }
                    }
                  ]
                },
                {
                  "@type": "ItemList",
                  "@id": "https://kushyanth-portfolio.web.app/#projectlist",
                  "name": "Kushyanth Pothineni's Projects",
                  "description": "A collection of software projects developed by Kushyanth Pothineni",
                  "numberOfItems": 6,
                  "itemListElement": [
                    {
                      "@type": "ListItem",
                      "position": 1,
                      "item": {"@id": "https://kushyanth-portfolio.web.app/#instans"}
                    },
                    {
                      "@type": "ListItem",
                      "position": 2,
                      "item": {"@id": "https://kushyanth-portfolio.web.app/#event-mania"}
                    },
                    {
                      "@type": "ListItem",
                      "position": 3,
                      "item": {"@id": "https://kushyanth-portfolio.web.app/#pro-reader"}
                    },
                    {
                      "@type": "ListItem",
                      "position": 4,
                      "item": {"@id": "https://kushyanth-portfolio.web.app/#pin-noter"}
                    },
                    {
                      "@type": "ListItem",
                      "position": 5,
                      "item": {"@id": "https://kushyanth-portfolio.web.app/#youtube-downloader"}
                    },
                    {
                      "@type": "ListItem",
                      "position": 6,
                      "item": {"@id": "https://kushyanth-portfolio.web.app/#employee-record-system"}
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
                      "name": "Home",
                      "item": "https://kushyanth-portfolio.web.app"
                    },
                    {
                      "@type": "ListItem",
                      "position": 2,
                      "name": "About",
                      "item": "https://kushyanth-portfolio.web.app#about"
                    },
                    {
                      "@type": "ListItem",
                      "position": 3,
                      "name": "Experience",
                      "item": "https://kushyanth-portfolio.web.app#experience"
                    },
                    {
                      "@type": "ListItem",
                      "position": 4,
                      "name": "Skills",
                      "item": "https://kushyanth-portfolio.web.app#skills"
                    },
                    {
                      "@type": "ListItem",
                      "position": 5,
                      "name": "Projects",
                      "item": "https://kushyanth-portfolio.web.app#projects"
                    },
                    {
                      "@type": "ListItem",
                      "position": 6,
                      "name": "Instans Project",
                      "item": "https://kushyanth-portfolio.web.app/projects/instans"
                    },
                    {
                      "@type": "ListItem",
                      "position": 7,
                      "name": "Event Mania Project",
                      "item": "https://kushyanth-portfolio.web.app/projects/event-mania"
                    },
                    {
                      "@type": "ListItem",
                      "position": 8,
                      "name": "Pro Reader Project",
                      "item": "https://kushyanth-portfolio.web.app/projects/pro-reader"
                    },
                    {
                      "@type": "ListItem",
                      "position": 9,
                      "name": "Pin Noter Project",
                      "item": "https://kushyanth-portfolio.web.app/projects/pin-noter"
                    },
                    {
                      "@type": "ListItem",
                      "position": 10,
                      "name": "YouTube Downloader Project",
                      "item": "https://kushyanth-portfolio.web.app/projects/youtube-downloader"
                    },
                    {
                      "@type": "ListItem",
                      "position": 11,
                      "name": "Employee Record System Project",
                      "item": "https://kushyanth-portfolio.web.app/projects/employee-record-system"
                    },
                    {
                      "@type": "ListItem",
                      "position": 12,
                      "name": "Certifications",
                      "item": "https://kushyanth-portfolio.web.app#certifications"
                    },
                    {
                      "@type": "ListItem",
                      "position": 13,
                      "name": "Contact",
                      "item": "https://kushyanth-portfolio.web.app#contact"
                    }
                  ]
                },
                {
                  "@type": "WebPage",
                  "@id": "https://kushyanth-portfolio.web.app/#webpage",
                  "url": "https://kushyanth-portfolio.web.app",
                  "name": "Kushyanth Pothineni | Software Developer Portfolio",
                  "description": "Portfolio of Kushyanth Pothineni, a Software Developer with expertise in Full Stack, Frontend, and Backend development using React.js, Next.js, Django, and more technologies.",
                  "isPartOf": {"@id": "https://kushyanth-portfolio.web.app/#website"},
                  "about": {"@id": "https://kushyanth-portfolio.web.app/#person"},
                  "breadcrumb": {"@id": "https://kushyanth-portfolio.web.app/#breadcrumb"},
                  "mainEntity": {"@id": "https://kushyanth-portfolio.web.app/#person"},
                  "speakable": {
                    "@type": "SpeakableSpecification",
                    "cssSelector": ["h1", "h2", ".main-content"]
                  }
                },
                {
                  "@type": "WebPage",
                  "@id": "https://kushyanth-portfolio.web.app/projects/#projectspage",
                  "url": "https://kushyanth-portfolio.web.app/projects",
                  "name": "Projects | Kushyanth Pothineni - Software Developer",
                  "description": "Explore the portfolio of projects developed by Kushyanth Pothineni, including Event Mania, Pro Reader, Pin Noter, and YouTube Downloader.",
                  "isPartOf": {"@id": "https://kushyanth-portfolio.web.app/#website"},
                  "about": {"@id": "https://kushyanth-portfolio.web.app/#person"},
                  "breadcrumb": {"@id": "https://kushyanth-portfolio.web.app/#breadcrumb"},
                  "mainEntity": {"@id": "https://kushyanth-portfolio.web.app/#projectlist"}
                },
                {
                  "@type": "WebPage",
                  "@id": "https://kushyanth-portfolio.web.app/projects/instans/#instanspage",
                  "url": "https://kushyanth-portfolio.web.app/projects/instans",
                  "name": "Instans Project | Kushyanth Pothineni - Software Developer",
                  "description": "Instans - An AI-powered interview preparation assistant that combines real-time screen sharing with intelligent chat capabilities using Google's Generative AI.",
                  "isPartOf": {"@id": "https://kushyanth-portfolio.web.app/#website"},
                  "about": {"@id": "https://kushyanth-portfolio.web.app/#person"},
                  "breadcrumb": {"@id": "https://kushyanth-portfolio.web.app/#breadcrumb"},
                  "mainEntity": {"@id": "https://kushyanth-portfolio.web.app/#instans"}
                },
                {
                  "@type": "WebPage",
                  "@id": "https://kushyanth-portfolio.web.app/projects/event-mania/#eventmaniapage",
                  "url": "https://kushyanth-portfolio.web.app/projects/event-mania",
                  "name": "Event Mania Project | Kushyanth Pothineni - Software Developer",
                  "description": "Event Mania - A comprehensive event management platform for colleges and students with real-time updates and multiple user roles.",
                  "isPartOf": {"@id": "https://kushyanth-portfolio.web.app/#website"},
                  "about": {"@id": "https://kushyanth-portfolio.web.app/#person"},
                  "breadcrumb": {"@id": "https://kushyanth-portfolio.web.app/#breadcrumb"},
                  "mainEntity": {"@id": "https://kushyanth-portfolio.web.app/#event-mania"}
                },
                {
                  "@type": "WebPage",
                  "@id": "https://kushyanth-portfolio.web.app/projects/pro-reader/#proreaderpage",
                  "url": "https://kushyanth-portfolio.web.app/projects/pro-reader",
                  "name": "Pro Reader Project | Kushyanth Pothineni - Software Developer",
                  "description": "Pro Reader - Feature-rich Android application for QR code scanning, speech-to-text conversion, and text extraction with offline capabilities.",
                  "isPartOf": {"@id": "https://kushyanth-portfolio.web.app/#website"},
                  "about": {"@id": "https://kushyanth-portfolio.web.app/#person"},
                  "breadcrumb": {"@id": "https://kushyanth-portfolio.web.app/#breadcrumb"},
                  "mainEntity": {"@id": "https://kushyanth-portfolio.web.app/#pro-reader"}
                },
                {
                  "@type": "WebPage",
                  "@id": "https://kushyanth-portfolio.web.app/projects/pin-noter/#pinnoterpage",
                  "url": "https://kushyanth-portfolio.web.app/projects/pin-noter",
                  "name": "Pin Noter Project | Kushyanth Pothineni - Software Developer",
                  "description": "Pin Noter - React-based note-taking application with rich text formatting, offline caching, and cloud synchronization capabilities.",
                  "isPartOf": {"@id": "https://kushyanth-portfolio.web.app/#website"},
                  "about": {"@id": "https://kushyanth-portfolio.web.app/#person"},
                  "breadcrumb": {"@id": "https://kushyanth-portfolio.web.app/#breadcrumb"},
                  "mainEntity": {"@id": "https://kushyanth-portfolio.web.app/#pin-noter"}
                },
                {
                  "@type": "WebPage",
                  "@id": "https://kushyanth-portfolio.web.app/projects/youtube-downloader/#youtubedownloaderpage",
                  "url": "https://kushyanth-portfolio.web.app/projects/youtube-downloader",
                  "name": "YouTube Downloader Project | Kushyanth Pothineni - Software Developer",
                  "description": "YouTube Video and Audio Downloader - Django-based application for downloading YouTube videos and audio with customizable quality options.",
                  "isPartOf": {"@id": "https://kushyanth-portfolio.web.app/#website"},
                  "about": {"@id": "https://kushyanth-portfolio.web.app/#person"},
                  "breadcrumb": {"@id": "https://kushyanth-portfolio.web.app/#breadcrumb"},
                  "mainEntity": {"@id": "https://kushyanth-portfolio.web.app/#youtube-downloader"}
                },
                {
                  "@type": "WebPage",
                  "@id": "https://kushyanth-portfolio.web.app/projects/employee-record-system/#employeerecordsystempage",
                  "url": "https://kushyanth-portfolio.web.app/projects/employee-record-system",
                  "name": "Employee Record System Project | Kushyanth Pothineni - Software Developer",
                  "description": "Employee Record System - A comprehensive Django-based employee management system with dual interface design and role-based authentication.",
                  "isPartOf": {"@id": "https://kushyanth-portfolio.web.app/#website"},
                  "about": {"@id": "https://kushyanth-portfolio.web.app/#person"},
                  "breadcrumb": {"@id": "https://kushyanth-portfolio.web.app/#breadcrumb"},
                  "mainEntity": {"@id": "https://kushyanth-portfolio.web.app/#employee-record-system"}
                },
                {
                  "@type": "FAQPage",
                  "@id": "https://kushyanth-portfolio.web.app/#faq",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "What technologies does Kushyanth Pothineni specialize in?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Kushyanth specializes in React.js, Next.js, Django, Python, JavaScript, Java, Firebase, MongoDB, and various other modern web development technologies."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "What type of projects has Kushyanth Pothineni built?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Kushyanth has built various projects including Event Mania (event management platform), Pro Reader (Android QR code app), Pin Noter (note-taking app), and YouTube Downloader (media download tool)."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "What certifications does Kushyanth Pothineni have?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Kushyanth holds certifications including ServiceNow Certified System Administrator, AWS Academy Machine Learning Foundations, Wipro Talent Next Java Full Stack, and several others."
                      }
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
                      "name": "Home",
                      "url": "https://kushyanth-portfolio.web.app"
                    },
                    {
                      "@type": "SiteNavigationElement",
                      "name": "About",
                      "url": "https://kushyanth-portfolio.web.app#about"
                    },
                    {
                      "@type": "SiteNavigationElement",
                      "name": "Experience",
                      "url": "https://kushyanth-portfolio.web.app#experience"
                    },
                    {
                      "@type": "SiteNavigationElement",
                      "name": "Skills",
                      "url": "https://kushyanth-portfolio.web.app#skills"
                    },
                    {
                      "@type": "SiteNavigationElement",
                      "name": "Projects",
                      "url": "https://kushyanth-portfolio.web.app/projects",
                      "hasPart": [
                        {
                          "@type": "SiteNavigationElement",
                          "name": "Instans",
                          "url": "https://kushyanth-portfolio.web.app/projects/instans"
                        },
                        {
                          "@type": "SiteNavigationElement",
                          "name": "Event Mania",
                          "url": "https://kushyanth-portfolio.web.app/projects/event-mania"
                        },
                        {
                          "@type": "SiteNavigationElement",
                          "name": "Pro Reader",
                          "url": "https://kushyanth-portfolio.web.app/projects/pro-reader"
                        },
                        {
                          "@type": "SiteNavigationElement",
                          "name": "Pin Noter",
                          "url": "https://kushyanth-portfolio.web.app/projects/pin-noter"
                        },
                        {
                          "@type": "SiteNavigationElement",
                          "name": "YouTube Downloader",
                          "url": "https://kushyanth-portfolio.web.app/projects/youtube-downloader"
                        },
                        {
                          "@type": "SiteNavigationElement",
                          "name": "Employee Record System",
                          "url": "https://kushyanth-portfolio.web.app/projects/employee-record-system"
                        }
                      ]
                    },
                    {
                      "@type": "SiteNavigationElement",
                      "name": "Certifications",
                      "url": "https://kushyanth-portfolio.web.app#certifications"
                    },
                    {
                      "@type": "SiteNavigationElement",
                      "name": "Contact",
                      "url": "https://kushyanth-portfolio.web.app#contact"
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
