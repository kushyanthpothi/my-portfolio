import { Antonio, Inter } from "next/font/google";
import "./globals.css";
import StructuredData from "../components/StructuredData";
import { personSchema, websiteSchema, siteNavigationSchema } from "../lib/seoSchemas";

const antonio = Antonio({
  subsets: ["latin"],
  variable: "--font-antonio",
  weight: ["400", "700"], // Normal and Bold
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
});

const BASE_URL = 'https://kushyanth-portfolio.web.app';

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Kushyanth Pothineni | Software Development Engineer",
    template: "%s | Kushyanth Pothineni",
  },
  description: "Portfolio of Kushyanth Pothineni - Software Development Engineer specializing in web development, mobile applications, and creative design solutions.",
  keywords: ["Kushyanth Pothineni", "Software Developer", "Web Developer", "Portfolio", "React", "Next.js", "Full Stack Developer", "Mobile App Developer"],
  authors: [{ name: "Kushyanth Pothineni", url: BASE_URL }],
  creator: "Kushyanth Pothineni",
  publisher: "Kushyanth Pothineni",

  // Google Site Verification
  verification: {
    google: "google1941f105e947ff44",
  },

  // Canonical URL
  alternates: {
    canonical: BASE_URL,
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Kushyanth Pothineni Portfolio",
    title: "Kushyanth Pothineni | Software Development Engineer",
    description: "Portfolio of Kushyanth Pothineni - Software Development Engineer specializing in web development, mobile applications, and creative design solutions.",
    images: [
      {
        url: `${BASE_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Kushyanth Pothineni Portfolio",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Kushyanth Pothineni | Software Development Engineer",
    description: "Portfolio of Kushyanth Pothineni - Software Development Engineer specializing in web development, mobile applications, and creative design solutions.",
    images: [`${BASE_URL}/images/og-image.jpg`],
    creator: "@kushyanth",
  },

  // Robots
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
};

import SmoothScroll from "../components/SmoothScroll";
import MouseBubble from "../components/MouseBubble";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Viewport Meta Tag for Responsive Design */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />

        {/* Structured Data for SEO */}
        <StructuredData data={personSchema} />
        <StructuredData data={websiteSchema} />
        <StructuredData data={siteNavigationSchema} />
      </head>
      <body className={`${antonio.variable} ${inter.variable}`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
        <SmoothScroll />
        <MouseBubble />
        {children}
      </body>
    </html>
  );
}
