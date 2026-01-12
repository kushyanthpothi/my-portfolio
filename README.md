# ⚡️ Kushyanth Portfolio v2.0.1

![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-2.0.1-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Firebase](https://img.shields.io/badge/Firebase-Supported-orange?style=for-the-badge&logo=firebase)

> A modern, high-performance personal portfolio website built with Next.js 14, featuring dynamic content management, AI-powered interactions, and a premium glassmorphism design.

---

## 🚀 New Features (v2)

### 📝 Dynamic Blog System
- **Real-time Content**: Fetched dynamically from Firebase Firestore.
- **Rich Tech News**: Automatically curated tech news and articles.
- **Smart Categorization**: Filtering and categorized views for easy navigation.

### 🛠️ Admin Dashboard
- **Content Management**: Secure `/admin` route to manage projects and blogs.
- **AI Integration**: Experimental support for AI-generated blog drafts (Gemini powered).
- **Secure Access**: Protected routes to ensure only authorized modifications.

### 🎨 UI/UX Overhaul
- **Glassmorphism Design**: Sleek, modern aesthetic with blurred backdrops and subtle gradients.
- **Fluid Animations**: Smooth scrolling, page transitions, and interactive hover states.
- **Responsive & Fast**: Fully optimized for mobile, tablet, and desktop viewports.

### 🔌 Tech Stack
- **Frontend**: Next.js 14, React, Vanilla CSS (Modules)
- **Backend/Data**: Firebase Firestore, Firebase Storage
- **CMS**: Native Admin Panel built into the app

---

## 📂 Project Structure

- **/app**: Next.js App Router structure.
  - `(home)`: Landing page components.
  - `admin`: Admin dashboard routes.
  - `blogs`: Dynamic blog listing and post pages.
  - `projects`: Dynamic project case studies.
- **/components**: Reusable UI components (Navbar, Footer, Cards).
- **/lib**: Firebase configuration and helper functions.
- **/OLD**: Archived source code for the previous version (v1.0.0).

---

## 🛠️ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/kushyanthpothi/my-portfolio.git
   cd my-portfolio
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
   ...
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---

*Designed & Developed by [Kushyanth Pothineni](https://github.com/kushyanthpothi)*
