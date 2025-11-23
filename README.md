# Kushyanth Pothineni - Portfolio Website

[![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting-orange?style=for-the-badge&logo=firebase&logoColor=white)](https://firebase.google.com)

A modern, responsive portfolio website showcasing the work and skills of Kushyanth Pothineni, a passionate Full Stack Software Developer with expertise in React.js, Next.js, Django, and modern web technologies.

## 🌐 Live Demo

**[Visit Portfolio](https://kushyanth-portfolio.web.app)**

## 🚀 Features

### ✨ Core Features
- **Advanced Theme System**: 6 vibrant color themes (Blue, Red, Orange, Pink, Purple, Emerald) with Light/Dark/System mode support
- **Dynamic Backgrounds**: 6 animated background options (Beams, Dither, Silk, PixelBlast, GridScan, ColorBends) for visual variety
- **Interactive Animations**: Framer Motion and GSAP-powered smooth transitions and effects
- **Typing Animation**: Sequential typewriter effect for hero text with rotating role display
- **Birthday Celebration**: Special fireworks animation triggered on June 2nd (birthday)
- **Responsive Design**: Mobile-first approach optimized for all devices and screen sizes
- **Skip Animations**: Users can skip initial loading animations with a tap/click for faster access

### 🎨 User Interface
- **Smart Navigation**: Smooth scroll navigation with active section highlighting and scroll spy functionality
- **Hero Section**: Dynamic typing animation with profile photo reveal and social media integration
- **About Section**: Professional summary with animated call-to-action buttons
- **Experience Timeline**: Interactive work experience showcase with detailed role descriptions
- **Skills Visualization**: Technical skills displayed with animated progress bars and proficiency levels
- **Project Showcase**: Comprehensive project cards with live demos, GitHub links, and detailed project pages
- **Certifications Gallery**: Professional certifications with image previews and verification links
- **Contact Integration**: EmailJS-powered contact form with validation and status feedback
- **Calendar Scheduling**: Integrated Cal.com widget for meeting bookings and availability display

### 📱 Technical Features
- **SEO Optimization**: Comprehensive meta tags, structured data (JSON-LD), sitemap, and robots.txt
- **Performance**: Next.js App Router with static generation, optimized images, and lazy loading
- **Accessibility**: WCAG compliant with proper ARIA attributes, keyboard navigation, and screen reader support
- **PWA Ready**: Service worker, web app manifest, offline capabilities, and install prompts
- **Analytics Ready**: Built-in performance monitoring and tracking infrastructure
- **Form Handling**: Advanced form validation, submission handling, and user feedback systems
- **Scroll Management**: Intelligent scroll position restoration and smooth scrolling between sections
- **State Management**: Custom hooks for theme, animations, form submission, and scroll tracking

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 16.0.3 (App Router with Turbopack)
- **UI Library**: React 19.0.0 with hooks and memoization
- **Styling**: TailwindCSS 3.4.1 with custom theme system
- **Animations**: Framer Motion 12.16.0 for UI animations, GSAP 3.13.0 for advanced effects
- **3D Graphics**: React Three Fiber 9.2.0, React Three Drei 10.5.0, Three.js 0.167.1
- **Icons**: Font Awesome 6.4.0, custom SVG icons
- **Fonts**: Google Fonts (Nunito Sans) with font optimization

### Backend & Services
- **Hosting**: Firebase Hosting with CDN and SSL
- **Email Service**: EmailJS for contact form submissions
- **Calendar Integration**: Cal.com embed for meeting scheduling
- **Form Handling**: Custom validation with real-time feedback
- **Analytics**: Performance monitoring and user interaction tracking

### Development Tools
- **Build Tool**: Next.js with Turbopack for fast development
- **Package Manager**: npm with package-lock.json
- **CSS Framework**: TailwindCSS with PostCSS and custom configuration
- **Image Optimization**: Next.js Image component with WebP/AVIF support
- **TypeScript**: TypeScript 5.8.3 with Next.js integration
- **Linting**: ESLint 9.39.1 with Next.js configuration
- **Code Quality**: Prettier integration and code formatting

### Libraries & Utilities
- **State Management**: React hooks with custom state management
- **HTTP Client**: EmailJS for API communications
- **Date Handling**: date-fns 4.1.0 and dayjs 1.11.19
- **Face Detection**: face-api.js 0.22.2 for potential future features
- **Background Removal**: @imgly/background-removal 1.7.0
- **Material UI**: @mui/material 7.3.5 with emotion styling
- **Post-processing**: postprocessing 6.37.7 for 3D effects

## 📁 Project Structure

```
my-portfolio/
├── Certificates/               # Professional certificates
│   ├── 1735105593467_page-0001.jpg
│   ├── AWS Academy - Machine Learning Foundations_page-0001.jpg
│   ├── CERTIFICATION FOR MEAN STACK DEVELOPMENT_page-0001.jpg
│   ├── Google Digital Garage - The fundamentals of digital marketing _page-0001.jpg
│   ├── NPTEL - Introduction To Internet Of Things_page-0001.jpg
│   └── Wipro Certificate.png
├── public/                     # Static assets
│   ├── feed.xml
│   ├── file.svg
│   ├── globe.svg
│   ├── google1941f105e947ff44.html
│   ├── humans.txt
│   ├── manifest.json
│   ├── next.svg
│   ├── organization-schema.json
│   ├── robots.txt
│   ├── sitemap-projects.xml
│   ├── sitemap.xml
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── projects/
│   │       ├── page.js
│   │       └── [slug]/
│   │           ├── client-page.js
│   │           ├── not-found.js
│   │           └── page.js
│   ├── Backgrounds/            # Background components
│   │   ├── Beams/
│   │   │   └── Beams.jsx
│   │   ├── ColorBends/
│   │   │   └── ColorBends.jsx
│   │   ├── Dither/
│   │   │   └── Dither.jsx
│   │   ├── GridScan/
│   │   │   └── GridScan.jsx
│   │   ├── PixelBlast/
│   │   │   └── PixelBlast.jsx
│   │   └── Silk/
│   │       └── Silk.jsx
│   ├── blocks/                 # Block components
│   │   └── Components/
│   │       └── PixelCard/
│   │           └── PixelCard.jsx
│   ├── components/             # Reusable components
│   │   ├── AboutSection.js
│   │   ├── BirthdayAnimation.js
│   │   ├── CalendarScheduler.js
│   │   ├── CertificationsSection.js
│   │   ├── ClientLayout.js
│   │   ├── ContactSection.js
│   │   ├── DarkModeSync.js
│   │   ├── ExperienceSection.js
│   │   ├── Fireworks.js
│   │   ├── Footer.js
│   │   ├── HeroSection.js
│   │   ├── ProjectsSection.js
│   │   └── ThemeDrawer.js
│   ├── config/                 # Configuration files
│   │   └── index.js
│   ├── constants/              # Constants
│   │   ├── index.js
│   │   ├── navigation.js
│   │   └── userData.js
│   ├── data/                   # Data files
│   │   └── detailedProjectsData.js
│   ├── hooks/                  # Custom hooks
│   │   ├── index.js
│   │   ├── useFormSubmission.js
│   │   ├── useScrollSpy.js
│   │   ├── useTheme.js
│   │   └── useTypingAnimation.js
│   ├── styles/                 # Additional styles
│   │   └── globals.css
│   └── utils/                  # Utility functions
│       ├── animations.js
│       ├── scrollRestore.js
│       ├── scrollUtils.js
│       └── theme.js
├── firebase.json               # Firebase configuration
├── icon.png                    # App icon
├── jsconfig.json               # JavaScript configuration
├── jsrepo.json                 # JSRepo configuration
├── next-env.d.ts               # Next.js TypeScript declarations
├── next.config.js              # Next.js configuration
├── next.config.mjs             # Next.js configuration (ESM)
├── package.json                # Dependencies and scripts
├── postcss.config.mjs          # PostCSS configuration
├── README.md                   # Project documentation
├── tailwind.config.js          # TailwindCSS configuration
├── tailwind.config.mjs         # TailwindCSS configuration (ESM)
└── tsconfig.json               # TypeScript configuration
```

## 🎯 Sections Overview

### 🏠 Home
- **Typing Animation**: Sequential typewriter effect displaying "Hello, I'm", name, and rotating roles
- **Profile Reveal**: Animated profile photo appearance with smooth transitions
- **Social Integration**: Direct links to GitHub, LinkedIn, Twitter, and email
- **Call-to-Action**: Animated buttons for contacting and downloading resume
- **Skip Animation**: Users can tap/click anywhere to skip the initial loading sequence

### 👨‍💻 About
- **Professional Summary**: Comprehensive background and career overview
- **Core Competencies**: Technical skills and specializations
- **Career Objectives**: Passion statement and professional goals
- **Animated Elements**: Smooth scroll-triggered animations

### 💼 Experience
- **Current Role**: Software Developer at Ninjacart with detailed responsibilities
- **Previous Experience**: Full Stack Developer Intern at Blackbucks Engineers
- **Interactive Timeline**: Visual timeline with achievements and key metrics
- **Technology Stack**: Tools and technologies used in each role

### 🛠️ Skills
**Technical Skills Display**:
- **Programming Languages**: JavaScript (92%), Python (85%), Java (78%), C/C++
- **Frontend Development**: React.js (85%), Next.js (85%), Angular, HTML/CSS (95%)
- **Backend Development**: Django (85%), Node.js, REST APIs (86%)
- **Databases**: MongoDB (80%), MySQL (82%), PostgreSQL
- **Cloud & DevOps**: AWS, Firebase, Docker, Git
- **Mobile Development**: Android (Java/Kotlin)
- **Animated Progress Bars**: Visual representation of skill proficiency levels

### 🚀 Projects
**Featured Portfolio Projects**:
1. **[Instans](https://instans.netlify.app/)** - AI-powered interview preparation with real-time screen sharing and Gemini AI integration
2. **[Event Mania](https://ap-event-mania.web.app/)** - College event management platform with Firebase authentication
3. **YouTube Downloader** - Django-based media download tool with multiple format support
4. **[Pin Noter](https://pin-noter.netlify.app/)** - React note-taking app with offline synchronization
5. **Pro Reader** - Android QR code and text processing application
6. **Employee Record System** - Django-based HR management with dual user interfaces

**Project Features**:
- Individual project pages with detailed descriptions
- Live demo links and GitHub repository access
- Technology stack badges and project images
- Responsive design for all devices

### 🏆 Certifications
**Professional Certifications Gallery**:
- ServiceNow Certified System Administrator
- AWS Academy Machine Learning Foundations
- Wipro Talent Next Java Full Stack Certification
- Responsive Web Designer (freeCodeCamp)
- NPTEL Introduction to Internet of Things
- Junior Software Developer Certification
- Google Digital Marketing Fundamentals

**Certification Features**:
- High-resolution certificate images
- Direct verification links
- Professional presentation layout

### 📧 Contact
- **EmailJS Integration**: Direct contact form with validation and status feedback
- **Calendar Integration**: Cal.com embedded scheduler for meeting bookings
- **Social Media Links**: Professional profiles on GitHub, LinkedIn, and Twitter
- **Location Information**: Current location and availability status
- **Responsive Form**: Mobile-optimized contact form with real-time validation

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

### Theme System
The portfolio features an advanced theme system with multiple customization options:

#### Color Themes
**6 Built-in Color Themes**: Blue, Red, Orange, Pink, Purple, Emerald
- Located in `src/utils/theme.js`
- Each theme includes light and dark mode variants
- Customizable accent colors for buttons, links, and highlights

#### Theme Modes
**3 Theme Modes**: Light, Dark, System
- **Light Mode**: Clean, bright interface
- **Dark Mode**: Easy on the eyes with dark backgrounds
- **System Mode**: Automatically follows OS preference

#### Background Animations
**6 Animated Backgrounds**: Beams, Dither, Silk, PixelBlast, GridScan, ColorBends
- Dynamic visual effects that adapt to the selected theme
- Smooth transitions between background options
- Performance-optimized animations

### Content Customization
#### Personal Information
- **User Data**: Update `src/constants/userData.js` for personal details, social links, and contact information
- **Skills**: Modify skills array with proficiency levels (0-100)
- **Experience**: Update work experience and achievements
- **Projects**: Edit projects array with descriptions, tech stacks, and links

#### Projects Data
- **Detailed Projects**: `src/data/detailedProjectsData.js` for extended project information
- **Project Images**: Add high-quality screenshots in appropriate directories
- **Live Demos**: Include working demo links for portfolio projects

### Technical Customization
#### Styling & Design
- **Global Styles**: `src/app/globals.css` for base styling
- **Component Styles**: TailwindCSS utility classes throughout components
- **Theme Configuration**: `tailwind.config.js` for custom design tokens
- **Animation Timings**: `src/config/index.js` for animation duration controls

#### Configuration Files
- **Navigation**: `src/constants/navigation.js` for menu items and sections
- **Animation Settings**: Configure typing speeds and transition timings
- **Form Validation**: Customize contact form validation rules
- **SEO Metadata**: Update meta tags and structured data in layout files

### Advanced Features
#### Calendar Integration
- **Cal.com Setup**: Configure meeting scheduling in `src/components/CalendarScheduler.js`
- **Availability**: Set working hours and booking preferences

#### Email Integration
- **EmailJS Configuration**: Set up contact form in environment variables
- **Template Customization**: Modify email templates and sender information

#### Animation Controls
- **Typing Animation**: Customize role rotation and typing speeds
- **Scroll Effects**: Adjust scroll-triggered animations and timings
- **Theme Transitions**: Configure smooth theme switching animations

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
