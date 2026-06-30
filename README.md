# Kushyanth Portfolio

<div align="center">
  <img src="public/logo.svg" width="120" height="120" alt="Kushyanth Pothineni Logo" />
  <br /><br />
  
  ![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
  ![Built With](https://img.shields.io/badge/Vite-6.x-blue?style=for-the-badge&logo=vite)
  ![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)
  ![Backend](https://img.shields.io/badge/Firebase-Supported-orange?style=for-the-badge&logo=firebase)
  
  <p>
    A modern, high-performance digital portfolio showcasing technical expertise, personal projects, and professional experience. An interactive, premium alternative to traditional resumes.
  </p>
  
  🌐 **Live Demo:** [https://kushyanth-portfolio.web.app](https://kushyanth-portfolio.web.app)
</div>

---

## 📋 Overview

Kushyanth Portfolio is a high-performance, responsive single-page web application built with **React** and **TypeScript** powered by **Vite**, leveraging the **Firebase** ecosystem for scalable backend services. Designed with a professional glassmorphism aesthetic, it features advanced custom image carousels, responsive sidebar systems, real-time Firestore content integrations, and automated visitor analytics telemetry.

---

## ✨ Key Features

- **🚀 Modern Architecture**: Engineered with Vite, React, and TypeScript.
- **🎨 Glass Effect Design**: Premium UI featuring translucent frosted layouts, blur backdrops, fluid ambient gradients, and responsive animations.
- **🌗 Ambient Customizer**: Selection panel containing 8 customized styles (*Default, Purple, Emerald, Crimson, Silver, Gold, Hologram, and Sunset*) with an optimized inline handler to eliminate rendering flashes (FOUC).
- **🎬 Interactive Media Carousel**: Inline screenshots gallery with auto-play interval controls, play/pause state selectors, navigation indicators, and a Portal-based fullscreen lightbox mapping keyboard event listeners (`←` / `→` / `Esc`).
- **📝 Real-time Caching System**: Unified database cache layer (`firestoreUtils`) with automatic invalidation parameters, providing snappy navigation for case studies and blog lists.
- **🛠️ Secure Admin CMS**: Centralized access panel at `/admin` built on Firebase Auth, enabling drafts compilation, content edits, and visitor analytics.
- **📈 Analytics Dashboard**: Built-in visual analytics charts tracking visitor views and daily activity cycles.
- **⚡ SEO & Crawl Optimization**: Fully loaded search indexing verification, robots rules, canonical tags, Open Graph meta tags, and structured JSON-LD schemas.

---

## 🏗️ Tech Stack

### Frontend & UI
- **Build Engine**: Vite + TypeScript
- **Library**: React 19
- **Styling**: Vanilla CSS, Tailwind CSS
- **Animations**: Framer Motion (`motion/react`)
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend & Cloud
- **Database**: Firebase Firestore (caching and indexing setup)
- **Auth**: Firebase Authentication (Secure CMS Access)
- **Analytics**: Custom page view and event logging

---

## 📂 Project Structure

```bash
kushyanth-portfolio/
├── public/                       # Static Assets (verification files, SVGs, favicon)
│   ├── logo.svg                  # SVG website brand logo
│   └── google1941f105e947ff44.html
├── src/
│   ├── firebase.ts               # Core client credentials & error mapping
│   ├── firestoreUtils.ts         # Cache utilities & Firestore read/write engines
│   ├── ImageCarousel.tsx         # Media viewer with Portal lightbox
│   ├── App.tsx                   # Main routes, context, & detail screens
│   ├── main.tsx                  # Document mounting interface
│   └── index.css                 # Base theme variables & glass styles
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Firebase CLI (for cloud deploys)

### Installation
1. `git clone https://github.com/kushyanthpothi/my-portfolio.git`
2. `npm install`
3. Configure environment variables in `.env`:
   ```env
   # Firebase Web App Config Credentials
   NEXT_PUBLIC_FIREBASE_API_KEY="..."
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
   NEXT_PUBLIC_FIREBASE_APP_ID="..."
   ```
4. Start local development server:
   ```bash
   npm run dev
   ```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact

**Kushyanth Pothineni** - [pothineni.kushyanth@gmail.com](mailto:pothineni.kushyanth@gmail.com)

Project Link: [https://github.com/kushyanthpothi/my-portfolio](https://github.com/kushyanthpothi/my-portfolio)

---

<div align="center">
  <h3>⭐ Star this repo if you find it helpful!</h3>
  <p>Built with ❤️ by Kushyanth Pothineni</p>
</div>
