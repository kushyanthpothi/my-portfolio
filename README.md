# Kushyanth Portfolio

A modern, high-performance personal portfolio website showcasing my profile digitally — an interactive alternative to traditional resumes. 

🔗 **Live Demo:** [kushyanth-portfolio.web.app](https://kushyanth-portfolio.web.app)

---

## Overview

This portfolio is built with Next.js 16 and Firebase, featuring a glassmorphism design aesthetic with smooth animations, dynamic content management, and AI-powered features.  It serves as a digital showcase of my skills, projects, experience, and blog content.

---

## Features

### Dynamic Blog System
Real-time blog content powered by Firebase Firestore with automatic tech news curation and smart category-based filtering for easy navigation.

### Admin Dashboard
A secure `/admin` route providing complete content management for projects and blogs.  Includes AI-powered blog draft generation using Google Gemini, with protected authentication ensuring authorized access only.

### Modern UI/UX
- Glassmorphism design with blurred backdrops and subtle gradients
- Fluid animations powered by Framer Motion
- Smooth scrolling with Lenis
- Magnetic hover effects on interactive elements
- Fully responsive across all devices

### SEO Optimized
- Dynamic sitemap and robots.txt generation
- Structured data (JSON-LD) for rich search results
- Atom feed for content syndication
- Comprehensive meta tags

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Framework | Next.js 16, React 19 |
| Styling | CSS Modules, Sass |
| Animation | Framer Motion, Lenis |
| Backend | Firebase Firestore, Firebase Storage |
| AI Integration | Google Generative AI (Gemini), OpenAI, Groq |
| Email | EmailJS |
| Icons | Lucide React, React Icons |

---

## Project Structure

```
├── app/
│   ├── (home)/          # Landing page components
│   ├── about/           # About page
│   ├── admin/           # Admin dashboard (protected)
│   │   └── components/  # Dashboard, ProjectManager, BlogManager, AIAutoBlogger
│   ├── api/             # API routes
│   ├── blogs/           # Blog listing and dynamic posts
│   │   └── [slug]/      # Individual blog pages
│   └── projects/        # Project case studies
├── components/          # Reusable UI components
│   ├── Footer. js
│   ├── Loading.js
│   ├── Magnetic.js
│   ├── ErrorPage.js
│   └── StructuredData.js
├── lib/                 # Firebase config and utilities
│   ├── firebase.js
│   ├── firestoreUtils.js
│   ├── AuthContext.js
│   └── seoSchemas.js
├── public/              # Static assets
├── scripts/             # Utility scripts
└── OLD/                 # Archived v1 source code
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project with Firestore enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/kushyanthpothi/my-portfolio.git
cd my-portfolio

# Install dependencies
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory: 

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project. firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# AI Services (optional)
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key

# EmailJS (optional)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

### Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home - Hero section with introduction |
| `/about` | About - Professional background and skills |
| `/blogs` | Blog - Tech articles and news |
| `/blogs/[slug]` | Individual blog post |
| `/projects` | Projects - Portfolio showcase |
| `/admin` | Admin Dashboard (protected) |

---

## Admin Features

Access the admin panel at `/admin` with Firebase Authentication: 

- **Dashboard** — Overview of content statistics
- **Project Manager** — Add, edit, and delete projects
- **Blog Manager** — Manage blog posts with rich content
- **AI Auto Blogger** — Generate blog drafts using AI
- **Experience Manager** — Update work experience

---

## Deployment

The portfolio is configured for Firebase Hosting: 

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy
firebase deploy
```

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

## Connect

- **Portfolio:** [kushyanth-portfolio.web.app](https://kushyanth-portfolio.web.app)
- **GitHub:** [@kushyanthpothi](https://github.com/kushyanthpothi)
- **LinkedIn:** [kushyanth-pothineni](https://www.linkedin.com/in/kushyanth/)
- **Email:** pothineni.kushyanth@gmail.com

---

Built by [Kushyanth Pothineni](https://github.com/kushyanthpothi)
