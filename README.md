# Kushyanth Pothineni - Portfolio Website

[![Next.js](https://img.shields.io/badge/Next.js-15.3.0-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting-orange?style=for-the-badge&logo=firebase&logoColor=white)](https://firebase.google.com)

A modern, responsive portfolio website showcasing the work and skills of Kushyanth Pothineni, a passionate Full Stack Software Developer with expertise in React.js, Next.js, Django, and modern web technologies.

## 🌐 Live Demo

**[Visit Portfolio](https://kushyanth-portfolio.web.app)**

## 🚀 Features

### ✨ Core Features
- **Modern Design**: Clean, professional UI with smooth animations
- **Dark/Light Mode**: Toggle between themes with system preference detection
- **Theme Customization**: 6 color themes (Blue, Red, Orange, Pink, Purple, Emerald)
- **Responsive Design**: Optimized for all devices (mobile, tablet, desktop)
- **Interactive Elements**: Framer Motion animations and GSAP effects
- **Dynamic Content**: Live typing animations and smooth scrolling

### 🎨 User Interface
- **Navigation**: Smooth scroll navigation with active section highlighting
- **Hero Section**: Dynamic title switching with typewriter effect
- **About Section**: Professional summary with call-to-action buttons
- **Experience Timeline**: Interactive work experience showcase
- **Skills Display**: Categorized technical skills with progress indicators
- **Project Showcase**: Detailed project cards with live demos and GitHub links
- **Certifications Gallery**: Professional certifications with verification links
- **Contact Form**: EmailJS integration for direct communication

### 📱 Technical Features
- **SEO Optimized**: Comprehensive meta tags and structured data
- **Performance**: Static site generation with optimal loading speeds
- **Accessibility**: WCAG compliant with proper ARIA attributes
- **PWA Ready**: Service worker and offline capabilities
- **Analytics**: Built-in performance monitoring

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15.3.0 (App Router)
- **UI Library**: React 19.0.0
- **Styling**: TailwindCSS 3.4.1
- **Animations**: Framer Motion 12.16.0, GSAP 3.13.0
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Nunito Sans)

### Backend & Services
- **Hosting**: Firebase Hosting
- **Email Service**: EmailJS
- **Form Handling**: Contact form with validation
- **Analytics**: Custom performance tracking

### Development Tools
- **Build Tool**: Next.js with Turbopack
- **Package Manager**: npm
- **CSS Framework**: TailwindCSS with custom configurations
- **Image Optimization**: Next.js Image component with external domains

## 📁 Project Structure

```
kushyanthpothi-main/
├── public/                      # Static assets
│   ├── feed.xml                # RSS feed
│   ├── sitemap.xml             # SEO sitemap
│   ├── robots.txt              # Search engine directives
│   └── organization-schema.json # Structured data
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.js           # Root layout with metadata
│   │   ├── page.js             # Home page component
│   │   ├── globals.css         # Global styles
│   │   └── projects/           # Projects section
│   │       ├── page.js         # Projects listing
│   │       └── [slug]/         # Dynamic project pages
│   ├── components/             # Reusable components
│   │   ├── ClientLayout.js     # Client-side layout wrapper
│   │   ├── Footer.js           # Footer component
│   │   ├── ThemeDrawer.js      # Theme selector
│   │   └── ResponsiveContainer.js
│   ├── styles/                 # Additional styles
│   └── utils/                  # Utility functions
│       └── theme.js            # Theme management
├── Certificates/               # Professional certificates
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # TailwindCSS configuration
├── package.json                # Dependencies and scripts
└── README.md                   # Project documentation
```

## 🎯 Sections Overview

### 🏠 Home
- Dynamic hero section with animated title switching
- Professional introduction with social links
- Call-to-action buttons for contact and resume

### 👨‍💻 About
- Professional summary and background
- Core competencies and specializations
- Career objectives and passion statement

### 💼 Experience
- **Ninjacart (Current)**: Software Developer role
- **Blackbucks Engineers**: Full Stack Developer Intern
- Interactive timeline with achievements and metrics

### 🛠️ Skills
Organized into categories:
- **Programming Languages**: JavaScript, Python, Java, C/C++
- **Frontend Development**: React.js, Next.js, Angular, HTML/CSS
- **Backend Development**: Django, Node.js, REST APIs
- **Databases**: MongoDB, MySQL, PostgreSQL
- **Cloud & DevOps**: AWS, Firebase, Docker, Git
- **Mobile Development**: Android (Java/Kotlin)

### 🚀 Projects
#### Featured Projects:
1. **[Event Mania](https://ap-event-mania.web.app/)** - Event management platform for colleges
2. **YouTube Downloader** - Django-based media download tool
3. **Pro Reader** - Android QR code and text processing app
4. **[Pin Noter](https://pin-noter.netlify.app/)** - React note-taking app with offline sync
5. **Employee Record System** - Django-based HR management system
6. **[Instans](https://instans.netlify.app/)** - An AI powered Interview Assistance 

### 🏆 Certifications
- ServiceNow Certified System Administrator
- AWS Academy Machine Learning Foundations
- Wipro Talent Next Java Full Stack Certification
- Responsive Web Designer (freeCodeCamp)
- NPTEL Introduction to Internet of Things
- Junior Software Developer
- Google Digital Marketing Fundamentals

### 📧 Contact
- Integrated contact form with EmailJS
- Professional social media links
- Location and availability information

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/kushyanthpothi/my-portfolio.git
cd my-portfolio
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env.local` file for environment variables:
```env
# EmailJS Configuration (optional)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

4. **Run development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:3000`

### Available Scripts

```bash
# Development with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Export static files
npm run export
```

## 🎨 Customization

### Theme Colors
The website supports 6 theme colors. Modify `src/utils/theme.js`:

```javascript
export const themeColors = {
  blue: 'text-blue-600 dark:text-blue-400...',
  red: 'text-red-600 dark:text-red-400...',
  // Add more themes
};
```

### Content Updates
- **Personal Info**: Update `src/app/page.js` userData object
- **Projects**: Modify projects array in the same file
- **Metadata**: Update SEO information in `src/app/layout.js`

### Styling
- **Global Styles**: `src/app/globals.css`
- **Component Styles**: TailwindCSS classes
- **Theme Configuration**: `tailwind.config.js`

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Loading Speed**: < 2 seconds on 3G
- **Bundle Size**: Optimized with Next.js automatic code splitting
- **Image Optimization**: WebP format with lazy loading

## 🔍 SEO Features

- **Meta Tags**: Comprehensive OpenGraph and Twitter Card support
- **Structured Data**: JSON-LD schema for better search visibility
- **Sitemap**: Auto-generated XML sitemap
- **RSS Feed**: Content syndication feed
- **Robots.txt**: Search engine optimization directives

## 🌐 Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Mobile Features

- **Touch Gestures**: Optimized touch interactions
- **Responsive Images**: Multiple breakpoints and formats
- **Mobile Navigation**: Hamburger menu with smooth animations
- **Performance**: Optimized for mobile networks

## 🤝 Contributing

While this is a personal portfolio, suggestions and feedback are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -am 'Add some improvement'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 About the Developer

**Kushyanth Pothineni** is a passionate Software Developer currently working at Ninjacart, with expertise in:

- **Full Stack Development**: React.js, Next.js, Django
- **Mobile Development**: Android (Java/Kotlin)
- **Cloud Technologies**: AWS, Firebase
- **Database Management**: MongoDB, MySQL
- **DevOps**: Docker, Git, CI/CD

### 🔗 Connect with Me

- **Portfolio**: [kushyanth-portfolio.web.app](https://kushyanth-portfolio.web.app)
- **LinkedIn**: [kushyanth-pothineni](https://www.linkedin.com/in/kushyanth-pothineni/)
- **GitHub**: [kushyanthpothi](https://github.com/kushyanthpothi/)
- **Twitter**: [@KushyanthPothi1](https://x.com/KushyanthPothi1)
- **Email**: pothineni.kushyanth@gmail.com
- **Resume**: [View Resume](https://tinyurl.com/kushyanthresume)

---

⭐ **If you found this portfolio helpful, please consider giving it a star!**

## 🎯 Future Enhancements

- [ ] Blog section integration
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] 3D animations and interactions
- [ ] Voice navigation features
- [ ] AI-powered chatbot
- [ ] Progressive Web App enhancements

---

*Built with ❤️ using Next.js and deployed on Firebase*
