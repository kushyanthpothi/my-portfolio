# ⚡️ Kushyanth Portfolio v2.0.1

![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-2.0.1-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)
![Firebase](https://img.shields.io/badge/Firebase-Supported-orange?style=for-the-badge&logo=firebase)

> A modern, high-performance personal portfolio website showcasing my profile digitally — an interactive alternative to traditional resumes. 

🌐 **Live Demo:** [https://kushyanth-portfolio.web.app](https://kushyanth-portfolio.web.app)

---

## 📋 Overview

This portfolio is built with **Next.js 16.1.1** and **React 19.2.3**, powered by Firebase for backend services. It features a premium glassmorphism design aesthetic with smooth animations, dynamic content management, AI-powered blog generation, and comprehensive SEO optimization. It serves as a digital showcase of my skills, projects, experience, and blog content.

---

## ✨ Key Features

### 🎯 Core Capabilities

- **🚀 Modern Tech Stack**: Built with Next.js 16.1.1, React 19.2.3, and Firebase ecosystem
- **📝 Dynamic Blog System**: Real-time content powered by Firestore with rich text support and category-based filtering
- **🤖 AI-Powered Content**: Automated blog generation using Google Gemini AI with multi-provider support (OpenAI, Groq)
- **🛠️ Admin Dashboard**: Secure CMS at `/admin` for managing projects, blogs, and experiences with protected authentication
- **🎨 Glassmorphism Design**: Premium UI with blurred backdrops, smooth gradients, and modern aesthetics
- **🌓 Theme Switching**: Dark/Light mode with persistent localStorage and flash prevention
- **⚡ Performance Optimized**: SEO-ready with structured data (JSON-LD), sitemap, robots.txt, and Open Graph tags
- **📱 Fully Responsive**: Optimized for mobile, tablet, and desktop with fluid breakpoints
- **🎬 Smooth Animations**: Framer Motion page transitions + Lenis smooth scrolling
- **📧 Contact Integration**: EmailJS-powered contact form with validation
- **🎯 Analytics Tracking**: Custom visitor analytics stored in Firestore

### 🎨 UI/UX Highlights

- Glassmorphism design with blurred backdrops and subtle gradients
- Fluid animations powered by Framer Motion
- Lenis smooth scrolling for premium feel
- Magnetic hover effects on interactive elements
- Custom mouse cursor trail effect
- Floating profile intro animation
- Fully responsive across all devices

### 🔍 SEO Features

- Dynamic sitemap and robots.txt generation
- Structured data (JSON-LD) for Person, Website, and Navigation schemas
- Atom RSS feed for content syndication
- Comprehensive Open Graph and Twitter Card metadata
- Google Search Console verification
- Image optimization with Next.js Image component

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 16.1.1 with App Router
- **UI Library**: React 19.2.3
- **Styling**: CSS Modules, Tailwind CSS 4.1.18, SASS 1.97.1
- **Animations**: Framer Motion 12.23.27, Lenis 1.3.17 (smooth scroll), Lottie animations
- **Icons**: Lucide React 0.562.0, React Icons 5.5.0
- **Fonts**: Antonio (headers), Inter (body text)

### Backend & Database
- **Firebase Firestore**: Dynamic content storage for projects, blogs, experiences
- **Firebase Authentication**: Secure admin access with email/password
- **Firebase Storage**: Media and image hosting
- **Firebase Admin SDK 13.6.0**: Server-side operations

### AI & Integrations
- **Google Gemini AI** (@google/generative-ai 0.24.1): Primary blog content generation
- **OpenAI API 4.77.0**: Alternative AI provider
- **Groq SDK 0.37.0**: Additional AI support
- **EmailJS 4.4.1**: Contact form email delivery

### SEO & Performance
- Structured Data (JSON-LD schemas)
- Auto-generated XML sitemap
- Robots.txt configuration
- Open Graph & Twitter Cards
- Google Search Console verified
- Custom visitor analytics
- Next.js React Compiler optimizations

---

## 📂 Project Structure

```
portfolio-new/
├── app/                          # Next.js App Router
│   ├── (home)/                   # Landing page sections
│   │   ├── Hero.js              # Hero section with animated intro
│   │   ├── About.js             # About/bio section with timeline
│   │   ├── Services.js          # Services and skills showcase
│   │   └── Projects.js          # Featured projects preview
│   ├── admin/                    # Admin dashboard (protected)
│   │   ├── components/
│   │   │   ├── Dashboard.js     # Analytics & visitor stats
│   │   │   ├── ProjectManager.js    # CRUD for projects
│   │   │   ├── BlogManager.js       # CRUD for blogs
│   │   │   ├── ExperienceManager.js # CRUD for experiences
│   │   │   ├── AIAutoBlogger.js     # AI blog generation
│   │   │   └── AdminSidebar.js      # Dashboard navigation
│   │   ├── page.js              # Admin login & layout
│   │   ├── layout.js            # Admin-specific layout
│   │   └── admin.module.css     # Admin styling
│   ├── about/                    # Dedicated about page
│   │   ├── page.js              # About page route
│   │   └── AboutSection.js      # About content component
│   ├── api/                      # API routes
│   │   └── generate-blog/
│   │       └── route.js         # AI blog generation endpoint
│   ├── blogs/                    # Blog system
│   │   ├── page.js              # Blog listing page
│   │   ├── BlogsClient.js       # Client-side blog logic
│   │   └── [slug]/              # Dynamic blog posts
│   │       ├── page.js          # Blog post page
│   │       └── BlogPostClient.js
│   ├── projects/                 # Project showcase
│   │   ├── page.js              # Projects listing
│   │   ├── ProjectsClient.js    # Client-side project logic
│   │   └── [slug]/              # Dynamic project details
│   │       ├── page.js          # Project detail page
│   │       └── ProjectClient.js
│   ├── layout.js                # Root layout with SEO metadata
│   ├── page.js                  # Homepage
│   ├── globals.css              # Global styles & theme variables
│   ├── loading.js               # Loading state component
│   ├── not-found.js             # 404 page
│   ├── sitemap.js               # Dynamic sitemap generation
│   ├── robots.js                # Robots.txt generation
│   └── atom.xml/                # RSS feed route
│       └── route.js
├── components/                   # Reusable UI components
│   ├── Navbar.js                # Navigation bar with theme toggle
│   ├── Footer.js                # Footer with social links
│   ├── FloatingProfile.js       # Animated profile intro
│   ├── ContactSection.js        # Contact form with EmailJS
│   ├── ThemeSwitch.js           # Dark/light mode toggle
│   ├── SmoothScroll.js          # Lenis smooth scroll integration
│   ├── MouseBubble.js           # Custom cursor trail effect
│   ├── ProjectCard.js           # Reusable project card
│   ├── Magnetic.js              # Magnetic hover effect
│   ├── Loading.js               # Loading spinner
│   ├── ErrorPage.js             # Error boundary component
│   ├── ThemeInitializer.js      # Theme setup on load
│   └── StructuredData.js        # SEO structured data component
├── lib/                          # Utilities & configuration
│   ├── firebase.js              # Firebase initialization
│   ├── firestoreUtils.js        # Firestore helper functions
│   ├── AuthContext.js           # Firebase auth context provider
│   └── seoSchemas.js            # SEO JSON-LD schemas
├── public/                       # Static assets
│   ├── images/                  # Portfolio images (~7MB)
│   ├── animations/              # Lottie animation files
│   └── *.svg                    # Icon assets
├── scripts/                      # Utility scripts
├── OLD/                          # Previous version (v1.0.0) archive
├── .env.local                    # Environment variables (gitignored)
├── package.json                  # Dependencies & scripts
├── next.config.mjs               # Next.js configuration
├── firebase.json                 # Firebase hosting config
├── firestore.rules               # Firestore security rules
└── storage.rules                 # Firebase storage rules
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm installed
- **Firebase project** created with Firestore enabled
- Firebase credentials ready
- (Optional) AI API keys for blog generation

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
   
   Create a `.env.local` file in the root directory with the following variables:

   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # AI Services (Optional - for AI blog generation)
   GOOGLE_AI_API_KEY=your_gemini_key
   OPENAI_API_KEY=your_openai_key
   GROQ_API_KEY=your_groq_key

   # EmailJS Configuration (for contact form)
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the site.

5. **Build for production**
   ```bash
   npm run build
   npm run start
   ```

### Available Scripts

```bash
npm run dev      # Start development server on localhost:3000
npm run build    # Build optimized production bundle
npm run start    # Start production server
npm run lint     # Run ESLint for code quality checks
```

---

## 📄 Pages & Routes

| Route | Description | Type |
|-------|-------------|------|
| `/` | Homepage with hero, services, about, projects, contact | Public |
| `/about` | Detailed about page with professional background | Public |
| `/blogs` | Blog listing with filtering and search | Public |
| `/blogs/[slug]` | Individual blog post pages | Public (Dynamic) |
| `/projects` | Full projects showcase | Public |
| `/projects/[slug]` | Individual project case studies | Public (Dynamic) |
| `/admin` | Admin dashboard for content management | Protected |
| `/api/generate-blog` | AI blog generation API endpoint | API Route |

---

## 🔐 Admin Dashboard

### Accessing the Dashboard

1. Navigate to `/admin` in your browser
2. Login with Firebase Authentication credentials
3. Access five main management sections

### Admin Features

Access the admin panel at `/admin` with Firebase Authentication:

- **📊 Dashboard** — Overview of content statistics, visitor analytics, and recent activity
- **📁 Project Manager** — Add, edit, and delete projects with image uploads and tech stack management
- **📝 Blog Manager** — Manage blog posts with rich content editor, categories, and tags
- **🤖 AI Auto Blogger** — Generate blog drafts using Google Gemini AI with customizable prompts
- **💼 Experience Manager** — Update work experience and education timeline

### Security

- 🔒 Secure authentication with Firebase Auth (email/password)
- 📊 Real-time analytics dashboard with visitor tracking
- 🎨 Rich text editor for blog content
- 🖼️ Image upload to Firebase Storage with optimization
- ✅ Live preview before publishing
- 🚫 Protected routes - unauthorized access redirected to login

---

## 📊 Firebase Setup

### Required Firestore Collections

Create these collections in your Firebase Firestore:

1. **projects**
   ```javascript
   {
     title: string,           // Project name
     description: string,     // Full description
     excerpt: string,         // Short preview
     techStack: array,        // Technologies used
     images: array,           // Image URLs from Storage
     slug: string,            // URL-friendly identifier
     featured: boolean,       // Show on homepage
     liveUrl: string,         // Live demo URL
     githubUrl: string,       // GitHub repository
     createdAt: timestamp
   }
   ```

2. **blogs**
   ```javascript
   {
     title: string,           // Blog post title
     content: string,         // Full markdown/HTML content
     excerpt: string,         // Preview text
     category: string,        // Category (tech, tutorial, etc.)
     tags: array,             // Topic tags
     slug: string,            // URL-friendly identifier
     coverImage: string,      // Header image URL
     publishedAt: timestamp,
     author: string,          // Author name
     readTime: number         // Estimated read time in minutes
   }
   ```

3. **experiences**
   ```javascript
   {
     title: string,           // Position/Degree title
     company: string,         // Company/School name
     location: string,        // City, Country
     startDate: string,       // MM/YYYY format
     endDate: string,         // MM/YYYY or "Present"
     description: string,     // Detailed description
     type: string,            // "work" or "education"
     technologies: array,     // Skills/tech used
     order: number            // Display order
   }
   ```

4. **visitors** (auto-created by analytics)
   ```javascript
   {
     timestamp: timestamp,
     userAgent: string,
     path: string,
     referrer: string
   }
   ```

### Firestore Security Rules

Update your `firestore.rules` file:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access for all collections
    match /{document=**} {
      allow read: if true;
    }
    
    // Only authenticated users can write
    match /{document=**} {
      allow write: if request.auth != null;
    }
    
    // Visitors collection can be written by anyone (for analytics)
    match /visitors/{doc} {
      allow create: if true;
    }
  }
}
```

### Firebase Storage Rules

Update your `storage.rules` file:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🚀 Deployment

### Firebase Hosting (Recommended)

The portfolio is optimized for Firebase Hosting:

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase (if not already done)**
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Set `out` as your public directory
   - Configure as a single-page app: Yes
   - Don't overwrite existing files

4. **Build and deploy**
   ```bash
   npm run build
   firebase deploy
   ```

Your site will be live at `https://your-project.web.app`

### Vercel Deployment

Alternatively, deploy to Vercel:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Follow the prompts to link your GitHub repository.

### Environment Variables in Production

⚠️ **Important**: Add all environment variables in your hosting platform:

**For Firebase:**
- Set environment variables in Firebase Functions config or use `.env.local` (not tracked in git)

**For Vercel:**
- Go to Project Settings → Environment Variables
- Add all variables from `.env.local`

Required variables:
- Firebase configuration (all `NEXT_PUBLIC_FIREBASE_*` vars)
- EmailJS credentials (for contact form)
- AI API keys (if using AI features)

---

## 🎨 Customization Guide

### Theme Colors

The portfolio supports dark and light themes. Customize colors in `app/globals.css`:

```css
:root[data-theme="dark"] {
  --background: #0a0a0a;
  --foreground: #ffffff;
  --primary: #3b82f6;
  --secondary: #8b5cf6;
  --accent: #f59e0b;
  /* Add your custom colors */
}

:root[data-theme="light"] {
  --background: #ffffff;
  --foreground: #0a0a0a;
  --primary: #2563eb;
  --secondary: #7c3aed;
  --accent: #d97706;
  /* Add your custom colors */
}
```

### Fonts

Fonts are configured in `app/layout.js`:

```javascript
const antonio = Antonio({
  subsets: ["latin"],
  variable: "--font-antonio",
  weight: ["400", "700"], // Customize weights
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"], // Customize weights
});
```

### Content Management

All dynamic content is managed through:

- **Firebase Firestore**: Projects, blogs, experiences stored in collections
- **Admin Dashboard**: Navigate to `/admin` to update content via UI
- **Static Content**: Edit components in `app/(home)/` for homepage sections
- **SEO Metadata**: Update `app/layout.js` for site-wide metadata

### Styling Individual Sections

Each section has its own CSS module:
- `app/(home)/Hero.module.css` - Hero section styles
- `app/(home)/About.module.css` - About section styles
- `app/(home)/Services.module.css` - Services section styles
- `app/admin/admin.module.css` - Admin dashboard styles

---

## 📱 Performance & Optimization

This portfolio is built with performance in mind:

- ⚡ **Next.js App Router**: Optimal server-side generation and client-side navigation
- 🎯 **Static Site Generation (SSG)**: Pre-rendered pages for instant load times
- 📦 **Code Splitting**: Automatic code splitting for smaller bundle sizes
- 🖼️ **Image Optimization**: Next.js Image component with lazy loading
- 🔄 **React Compiler**: Babel React Compiler for optimized React code
- 💾 **Local Storage**: Theme preference cached to prevent flash
- 🚀 **Firebase CDN**: Assets served from Firebase's global CDN
- 🎬 **Framer Motion**: Optimized animations with will-change and transform
- 📊 **Lighthouse Score**: Aim for 90+ across all metrics

### Performance Tips

- Keep images under 500KB (use WebP format)
- Minimize heavy animations on mobile
- Use Firebase indexing for complex queries
- Enable Firestore caching for offline support
- Lazy load non-critical components

---

## 🎬 Feature Deep Dive

### 1. Dynamic Blog System
- Real-time content fetched from Firebase Firestore
- Rich text / Markdown support for blog content
- Category-based filtering and search functionality
- SEO-optimized individual blog pages with metadata
- Dynamic routing with slugs (`/blogs/[slug]`)
- Estimated read time calculation
- Related posts suggestions

### 2. AI Content Generation
- Generate blog drafts using **Google Gemini AI**
- Fallback support for **OpenAI** and **Groq** APIs
- Customizable AI prompts and parameters
- Topic suggestion and title generation
- Direct publishing to Firestore
- Edit AI-generated content before publishing

### 3. Interactive Animations
- **Floating Profile**: Initial profile reveal animation on homepage load
- **Smooth Scrolling**: Lenis-powered butter-smooth scroll experience
- **Mouse Bubble**: Custom cursor trail effect that follows mouse movement
- **Page Transitions**: Framer Motion transitions between routes
- **Hover States**: Magnetic effects on interactive elements
- **Stagger Animations**: Sequential reveal of content sections

### 4. SEO Optimization
- **Structured Data**: JSON-LD schemas for Person, Website, and Navigation
- **Dynamic Sitemap**: Auto-generated XML sitemap with all routes
- **Robots.txt**: Crawler configuration for optimal indexing
- **Meta Tags**: Comprehensive Open Graph and Twitter Card metadata
- **Google Search Console**: Verified ownership for analytics
- **Canonical URLs**: Prevent duplicate content issues
- **Image Alt Tags**: Accessibility and SEO for all images

### 5. Contact System
- **EmailJS Integration**: Serverless email delivery
- **Form Validation**: Client-side validation for required fields
- **Success/Error States**: User-friendly notifications
- **Smooth Scroll**: Auto-scroll to form on navigation
- **Direct Links**: Support for `/#contact-form` URLs

---

## 🧪 Development Tools

- **ESLint**: Code quality and consistency enforcement
- **Next.js Dev Server**: Hot reload for instant feedback
- **React DevTools**: Component inspection and debugging
- **Firebase Emulator**: Local testing of Firestore and Auth
- **Git Hooks**: Pre-commit linting and formatting (optional)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write descriptive commit messages
- Update documentation for new features
- Test thoroughly before submitting PR
- Keep PRs focused on a single feature/fix

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

You are free to use this code for your own portfolio, but please:
- Give appropriate credit
- Don't claim it as entirely your own work
- Share improvements back with the community

---

## 📧 Connect & Contact

**Kushyanth Pothineni**

- **Portfolio:** [https://kushyanth-portfolio.web.app](https://kushyanth-portfolio.web.app)
- **GitHub:** [@kushyanthpothi](https://github.com/kushyanthpothi)
- **LinkedIn:** [kushyanth-pothineni](https://www.linkedin.com/in/kushyanth/)
- **Email:** pothineni.kushyanth@gmail.com

Feel free to reach out for collaborations, questions, or just to say hi!

---

## 🙏 Acknowledgments

- **Next.js Team** - For the incredible framework
- **Firebase** - For reliable backend infrastructure
- **Framer Motion** - For smooth, beautiful animations
- **Google Gemini AI** - For AI-powered content generation
- **Vercel** - For hosting and deployment platform
- **Open-source Community** - For inspiration and tools

---

## 📸 Screenshots

### Homepage
<img width="1440" height="777" alt="image" src="https://github.com/user-attachments/assets/b33dd8dd-a838-4686-bba3-ba8e991fab7c" />

### Admin Dashboard
<img width="1440" height="776" alt="image" src="https://github.com/user-attachments/assets/aab51f5d-a493-4685-89da-6840fe9238c4" />


### Blog Page
<img width="1440" height="779" alt="image" src="https://github.com/user-attachments/assets/566f0f42-af29-4ac9-afef-dbbda0ab2d97" />


### Project Showcase
<img width="1440" height="778" alt="image" src="https://github.com/user-attachments/assets/1f779c56-b9e3-4509-bda9-e800001e660d" />


---

## 🔄 Version History

- **v2.0.1** (Current - January 2026)
  - ✨ Dynamic blog system with Firestore integration
  - 🤖 AI-powered blog generation (Gemini, OpenAI, Groq)
  - 🛠️ Complete admin dashboard with analytics
  - 🎨 Glassmorphism UI redesign
  - ⚡ Performance optimizations and SEO improvements
  - 🌓 Enhanced theme switching
  - 📱 Improved mobile responsiveness

- **v1.0.0** (Archived in `/OLD` directory)
  - 🚀 Initial portfolio release
  - 📄 Static content pages
  - 🎬 Basic animations
  - 📧 Contact form

---

## 🐛 Known Issues & Roadmap

### Known Issues
- None at the moment! 🎉
- Report issues [here](https://github.com/kushyanthpothi/my-portfolio/issues)

### Upcoming Features (Roadmap)

- [ ] 🌍 Multi-language support (i18n)
- [ ] 📊 Enhanced analytics dashboard with charts
- [ ] 💬 Comment system for blog posts
- [ ] 📬 Newsletter subscription integration
- [ ] 🔍 Advanced blog search with filters
- [ ] 🎨 More theme options and customization
- [ ] 🤖 More AI automation features
- [ ] 📱 Progressive Web App (PWA) support
- [ ] 🔔 Push notifications for new posts
- [ ] 🏆 Featured projects carousel

---

## 💡 Tips & Best Practices

### For Users of This Template

1. **Replace Personal Info**: Update all references to my name, email, and social links
2. **Update Firebase Config**: Use your own Firebase project credentials
3. **Customize Content**: Add your own projects, blogs, and experiences
4. **Modify Theme**: Adjust colors and fonts to match your brand
5. **Set Up Analytics**: Connect Google Analytics or similar
6. **Add Your Images**: Replace images in `/public/images/` with your own
7. **Update SEO**: Modify metadata in `app/layout.js` for your info
8. **Test Thoroughly**: Test all features before deploying

### For Maintaining This Project

1. Keep dependencies updated regularly
2. Monitor Firebase usage and quotas
3. Backup Firestore data periodically
4. Test admin dashboard security
5. Check performance metrics with Lighthouse
6. Monitor for broken links and images
7. Review and update SEO as needed

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Built with ❤️ by [Kushyanth Pothineni](https://github.com/kushyanthpothi)**

*If you use this template for your portfolio, I'd love to see it! Feel free to reach out.*

</div>
