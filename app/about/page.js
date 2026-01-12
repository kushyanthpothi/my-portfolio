import Navbar from "../../components/Navbar";
import AboutSection from "./AboutSection";
import ContactSection from "../../components/ContactSection";
import Footer from "../../components/Footer";
import StructuredData from "../../components/StructuredData";
import { generateBreadcrumbSchema } from "../../lib/seoSchemas";

const BASE_URL = 'https://kushyanth-portfolio.web.app';

export const metadata = {
    title: "About",
    description: "Learn about Kushyanth Pothineni - Software Development Engineer with expertise in web development, mobile applications, and creative design. Discover my journey, skills, and experience.",
    alternates: {
        canonical: `${BASE_URL}/about`,
    },
    openGraph: {
        title: "About | Kushyanth Pothineni",
        description: "Learn about Kushyanth Pothineni - Software Development Engineer with expertise in web development, mobile applications, and creative design.",
        url: `${BASE_URL}/about`,
        type: "profile",
    },
    twitter: {
        title: "About | Kushyanth Pothineni",
        description: "Learn about Kushyanth Pothineni - Software Development Engineer with expertise in web development, mobile applications, and creative design.",
    },
};

const breadcrumbData = generateBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "About", url: `${BASE_URL}/about` },
]);

export default function AboutPage() {
    return (
        <main>
            <StructuredData data={breadcrumbData} />
            <Navbar />
            <AboutSection />
            <div style={{ marginBottom: '100px' }}>
                <ContactSection />
            </div>
            <Footer />
        </main>
    );
}
