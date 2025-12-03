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
    default: "Kushyanth Pothineni – Software Developer & Full Stack Engineer",
    template: "%s | Kushyanth Pothineni – Software Developer & Full Stack Engineer"
  },
  description:
    "I’m Kushyanth Pothineni, a Software Development Engineer with hands-on experience in building scalable backend systems, REST APIs, and automation pipelines. Skilled in Java, Python, Spring Boot, cloud services (AWS), and distributed systems, I specialize in optimizing performance and integrating ML solutions to solve real-world problems. You can reach me at pothineni.kushyanth@gmail.com",
  keywords: [
    "Kushyanth Pothineni", "Software Developer", "Full Stack Developer", "Backend Developer",
    "Frontend Developer", "React.js Developer", "Next.js Developer", "Django Developer",
    "Python Developer", "JavaScript Developer", "TypeScript Developer", "API Developer",
    "Cloud Developer", "Remote Software Engineer", "Freelance Software Developer",
    "Software Developer India", "Full Stack Developer India", "React Developer India",
    "Freelance Developer India", "Remote Software Developer India",
    "React.js Next.js Django", "Python JavaScript TypeScript", "Spring Boot Java Developer",
    "AWS Firebase MongoDB", "MySQL PostgreSQL Redis Kafka", "REST API Development",
    "Microservices Architecture", "Cloud Computing AWS Docker Jenkins",
    "ServiceNow Certified Developer", "AI Integration", "Machine Learning Engineer",
    "Generative AI Solutions", "Chatbot Development",
    "Custom Web Development", "Mobile App Development", "API Development Services",
    "Full Stack Web Development Services", "Enterprise Software Solutions",
    "AI Interview Assistant", "Event Management Platform", "Smart Inventory Tracker",
    "Android QR Scanner App", "Note Taking Application", "YouTube Downloader Tool",
    "Employee Management System", "OCR Document Processing",
    "AI-Powered Workflow Automation"
  ],
  authors: [{ name: "Kushyanth Pothineni", url: "https://kushyanth-portfolio.web.app" }],
  creator: "Kushyanth Pothineni",
  publisher: "Kushyanth Pothineni",

  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Kushyanth Pothineni – Software Developer & Full Stack Engineer",
    description:
      "I’m Kushyanth Pothineni, a Software Development Engineer with hands-on experience in building scalable backend systems, REST APIs, and automation pipelines. Skilled in Java, Python, Spring Boot, cloud services (AWS), and distributed systems, I specialize in optimizing performance and integrating ML solutions to solve real-world problems.",
    url: "https://kushyanth-portfolio.web.app",
    siteName: "Kushyanth Pothineni Portfolio",
    images: [
      {
        url: "https://i.ibb.co/CpW4rW5s/picofme-2.png",
        width: 1200,
        height: 630,
        alt: "Kushyanth Pothineni - Software Developer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@KushyanthPothi1",
    creator: "@KushyanthPothi1",
    title: "Kushyanth Pothineni – Software Developer & Full Stack Engineer",
    description:
      "Software Developer specializing in React.js, Next.js, Django, and Python. Creator of AI Interview Assistant and other full stack projects.",
    images: ["https://i.ibb.co/CpW4rW5s/picofme-2.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "/",
    languages: { "en-US": "/en-US", en: "/" },
  },

  // Neat project links for Google search results
  other: {
    "projects": [
      {
        name: "Instans – AI Interview Assistant",
        url: "https://kushyanth-portfolio.web.app/projects/instans/",
        description: "AI-powered interview platform built with Next.js and Google Generative AI to help candidates prepare with real-time practice."
      },
      {
        name: "Event Mania – Event Management Platform",
        url: "https://kushyanth-portfolio.web.app/projects/event-mania/",
        description: "Web app for colleges and student groups to manage events, registrations, and real-time updates."
      },
      {
        name: "Pro Reader – QR Code Scanner App",
        url: "https://kushyanth-portfolio.web.app/projects/pro-reader/",
        description: "Android application for QR code scanning, speech-to-text, and offline text extraction."
      },
      {
        name: "YouTube Downloader",
        url: "https://kushyanth-portfolio.web.app/projects/youtube-downloader/",
        description: "Django-based web tool to download YouTube videos and audio with different quality options."
      },
      {
        name: "Pin Noter – Note Taking App",
        url: "https://kushyanth-portfolio.web.app/projects/pin-noter/",
        description: "React-based note-taking app with offline caching, cloud sync, and rich text formatting."
      },
      {
        name: "Employee Record System",
        url: "https://kushyanth-portfolio.web.app/projects/employee-record-system/",
        description: "Django and MySQL based HR management system with role-based authentication and employee tracking."
      }
    ]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="author" content="Kushyanth Pothineni" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={`${nunitoSans.variable} font-nunito antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
