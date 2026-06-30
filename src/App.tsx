/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';

// Initialize EmailJS key
emailjs.init('FR_bQvDLbvWZSxFRO');

import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { Sparkles, Palette, Menu, ArrowUpRight, CheckSquare, Activity, Box, Code2, Layers, MapPin, BarChart2, Database, X, ChevronDown, Terminal, Wrench, GitPullRequest, Layout, Cloud, Instagram, Linkedin, Github, LogOut } from 'lucide-react';
import { fetchBlogs, fetchProjects, fetchBlogBySlug, fetchProjectBySlug } from './firestoreUtils';
import { db, auth } from './firebase';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { KPLogo } from './KPLogo';
import { LikeButton } from './LikeButton';
import { trackPageView, trackItemView } from './analytics';
import { AdminPanel } from './AdminPanel';
import { ImageCarousel } from './ImageCarousel';

import { LoadingIndicator } from './LoadingIndicator';
import { JourneyCard } from './JourneyCard';
import { ContentCard } from './ContentCard';

export function updateMetaTags(title: string, description: string, path: string) {
  document.title = title;
  
  const setMeta = (nameOrProperty: string, content: string, isProp = false) => {
    const attr = isProp ? 'property' : 'name';
    let el = document.head.querySelector(`meta[${attr}="${nameOrProperty}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, nameOrProperty);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('description', description);
  setMeta('og:title', title, true);
  setMeta('og:description', description, true);
  setMeta('og:url', `https://kushyanth-portfolio.web.app${path}`, true);
  setMeta('twitter:title', title);
  setMeta('twitter:description', description);

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', `https://kushyanth-portfolio.web.app${path}`);
}

interface GlassOption {
  value: string;
  label: string;
}

interface GlassSelectProps {
  options: GlassOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function GlassSelect({ options, value, onChange, placeholder = 'Select...' }: GlassSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Select button */}
      <div
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full bg-white/5 backdrop-blur-[32px] border border-white/10 rounded-xl px-5 py-3 text-white flex items-center justify-between cursor-pointer select-none transition hover:bg-white/10 focus:border-white/30"
      >
        <span className={selectedOption ? 'text-white' : 'text-white/40'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Options list dropdown with framer-motion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute z-50 w-full mt-2 bg-[#121626]/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-[0_10px_45px_rgba(0,0,0,0.6)]"
          >
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`px-5 py-3.5 text-sm cursor-pointer transition select-none ${
                  opt.value === value
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                {opt.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


function ContactView() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setStatus('loading');
    setErrorMessage('');

    emailjs.sendForm(
      'service_ab1oioq',
      'template_xwyd7xc',
      formRef.current,
      { publicKey: 'FR_bQvDLbvWZSxFRO' }
    )
      .then((result) => {
        console.log('SUCCESS!', result.status, result.text);
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          service: '',
          message: ''
        });
        setTimeout(() => setStatus('idle'), 5000);
      }, (error) => {
        console.error('FAILED...', error);
        setStatus('error');
        setErrorMessage(error.text || error.message || 'Failed to send. Please try again.');
      });
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-white/30 text-white placeholder:text-white/40 transition";

  return (
    <div className="w-full max-w-xl">
      <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-8">Get in Touch</h2>
      
      {status === 'success' && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-5 py-3 rounded-xl text-center font-medium"
        >
          Message sent successfully! I'll get back to you soon.
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-5 py-3 rounded-xl text-center font-medium"
        >
          {errorMessage}
        </motion.div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold tracking-wider text-white/50 uppercase mb-2 ml-1">Name</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Smith" 
            className={inputClass} 
            required 
          />
        </div>
        
        <div>
          <label className="block text-xs font-semibold tracking-wider text-white/50 uppercase mb-2 ml-1">Email</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="johnsmith@gmail.com" 
            className={inputClass} 
            required 
          />
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-wider text-white/50 uppercase mb-2 ml-1">Service Needed ?</label>
          <input type="hidden" name="service" value={formData.service} />
          <GlassSelect
            options={[
              { value: 'Web Development', label: 'Web Development' },
              { value: 'UI/UX Design', label: 'UI/UX Design' },
              { value: 'Backend System', label: 'Backend System' },
              { value: 'Other', label: 'Other' },
            ]}
            value={formData.service}
            onChange={(val) => setFormData(prev => ({ ...prev, service: val }))}
            placeholder="Select..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-wider text-white/50 uppercase mb-2 ml-1">What Can I Help You...</label>
          <textarea 
            rows={4} 
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Hello, I'd like to enquire about..." 
            className={`${inputClass} resize-none`} 
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={status === 'loading' || status === 'success'}
          className="bg-white text-black font-semibold rounded-xl px-5 py-3.5 mt-2 hover:opacity-90 transition disabled:opacity-50"
        >
          {status === 'loading' ? 'Sending...' : status === 'success' ? 'Message Sent' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}


function ScrollToTop() {

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const themes = ["default", "purple", "emerald", "crimson", "silver", "gold", "hologram", "sunset"];

const phrases = ["Kushyanth Pothineni", "I am a software developer engineer."];

function BlurMorphText() {
  const [index, setIndex] = useState(0);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
      setIsFirstRender(false);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const words = phrases[index].split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: isFirstRender ? 1.0 : 0 },
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    }
  };

  const wordVariants = {
    hidden: { filter: "blur(8px)", opacity: 0, y: 15, scale: 0.95 },
    visible: { 
      filter: "blur(0px)", opacity: 1, y: 0, scale: 1, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    },
    exit: { 
      filter: "blur(8px)", opacity: 0, y: -15, scale: 1.05, 
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <div className="relative w-full h-[140px] sm:h-[160px] md:h-[200px] lg:h-[240px] perspective-1000 mt-[5vh] lg:mt-[10vh]">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute left-0 -bottom-8 md:-bottom-16 lg:-bottom-20 flex flex-wrap text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-medium tracking-tight text-white leading-[1.05] max-w-[900px]"
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariants as any}
              className="inline-block mr-[0.3em] mb-[0.1em]"
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}


function BlogDetailView({ data }: { data: any[] }) {
  const { id } = useParams();
  const [imgError, setImgError] = useState(false);
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    trackItemView('blogs', id);

    // Check the cached list first; fall back to a direct Firestore fetch
    const cached = data.find(b => b.id === id || b.slug === id);
    if (cached) {
      setItem(cached);
      setLoading(false);
    } else {
      fetchBlogBySlug(id).then(blog => {
        setItem(blog);
        setLoading(false);
      });
    }
  }, [id, data]);

  useEffect(() => {
    if (item) {
      updateMetaTags(
        `${item.title || item.name || 'Blog'} | Kushyanth Pothineni`,
        item.description || item.summary || item.excerpt || 'Read this article by Kushyanth Pothineni.',
        `/blogs/${id}`
      );
    }
  }, [item, id]);

  if (loading) return <LoadingIndicator />;
  if (!item) return (
    <div className="w-[80%] mx-auto pb-10">
      <Link to="/blogs" className="inline-flex items-center text-white/50 hover:text-white mb-8 transition font-medium">
        ← Back to Blogs
      </Link>
      <p className="text-white/50">Blog not found.</p>
    </div>
  );

  // v2 Firestore canonical field for blogs is `coverImage`
  const imgUrl = item.coverImage || item.heroImage || item.image || item.imgUrl || item.thumbnail || item.imageUrl || item.pic;


  return (
    <div className="w-[80%] mx-auto pb-10">
      <Link to="/blogs" className="inline-flex items-center text-white/50 hover:text-white mb-8 transition font-medium">
         ← Back to Blogs
      </Link>
      <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-8">{item.title || item.name || 'Untitled Blog'}</h1>
      {imgUrl && !imgError ? (
        <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden mb-10 bg-white/5 border border-white/10 relative">
          <img src={imgUrl} onError={() => setImgError(true)} alt={item.title || "Blog Image"} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden mb-10 bg-white/5 border border-white/10 flex items-center justify-center relative">
          <KPLogo className="w-24 h-24 text-white/20" />
        </div>
      )}
      <div className="prose prose-invert max-w-none text-white/80 leading-relaxed prose-p:my-4 prose-headings:mt-8 prose-headings:mb-4 prose-headings:font-medium prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-white prose-a:underline prose-img:rounded-2xl prose-ul:my-4 prose-li:my-1">
        {item.content || item.body || item.description ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.content || item.body || item.description}</ReactMarkdown>
        ) : (
          "No content provided."
        )}
      </div>
    </div>
  );
}

function ProjectDetailView({ data }: { data: any[] }) {
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    trackItemView('projects', id);

    // Check the cached list first; fall back to a direct Firestore fetch
    const cached = data.find(p => p.id === id || p.slug === id);
    if (cached) {
      setItem(cached);
      setLoading(false);
    } else {
      fetchProjectBySlug(id).then(project => {
        setItem(project);
        setLoading(false);
      });
    }
  }, [id, data]);

  useEffect(() => {
    if (item) {
      updateMetaTags(
        `${item.title || item.name || 'Project'} | Kushyanth Pothineni`,
        item.summary || item.description || 'Explore this project by Kushyanth Pothineni.',
        `/projects/${id}`
      );
    }
  }, [item, id]);

  if (loading) return <LoadingIndicator />;
  if (!item) return (
    <div className="w-[80%] mx-auto pb-10">
      <Link to="/projects" className="inline-flex items-center text-white/50 hover:text-white mb-8 transition font-medium">
        ← Back to Projects
      </Link>
      <p className="text-white/50">Project not found.</p>
    </div>
  );

  // v2 Firestore canonical field for projects is `heroImage`
  const imgUrl = item.heroImage || item.image || item.coverImage || item.imgUrl || item.thumbnail || item.imageUrl || item.pic;

  // Resolve primary description/content block
  const mainContent = item.content || item.body || '';
  const summary = item.summary || item.description || '';

  // Resolve link
  const projectLink = item.link || item.liveUrl || item.url || item.github;

  // Tech stack array or comma-string
  const techStack: string[] = Array.isArray(item.techStack)
    ? item.techStack
    : item.tech ? item.tech.split(',').map((t: string) => t.trim()).filter(Boolean) : [];

  // Case-study fields
  const problem = item.problem || '';
  const solution = item.solution || '';
  const challenge = item.challenge || '';

  // Additional content screenshots
  const contentImages: string[] = Array.isArray(item.contentImages) ? item.contentImages : [];

  // Combine heroImage + contentImages into a single ordered array for the carousel
  const carouselImages: string[] = [
    ...(imgUrl ? [imgUrl] : []),
    ...contentImages.filter(src => src && src !== imgUrl),
  ];

  return (
    <div className="w-[80%] mx-auto pb-10">
      <Link to="/projects" className="inline-flex items-center text-white/50 hover:text-white mb-8 transition font-medium">
         ← Back to Projects
      </Link>

      <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">{item.title || item.name || 'Untitled Project'}</h1>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        {item.category && <span className="border border-white/20 text-white/60 text-xs font-medium px-3 py-1.5 rounded-full">{item.category}</span>}
        {(item.year || item.date) && <span className="text-white/40 text-sm">{item.year || item.date}</span>}
        {item.industry && <span className="text-white/40 text-sm">· {item.industry}</span>}
        {item.client && <span className="text-white/40 text-sm">· {item.client}</span>}
        {item.duration && <span className="text-white/40 text-sm">· {item.duration}</span>}
      </div>

      {/* Image carousel: hero + content screenshots */}
      <ImageCarousel images={carouselImages} title={item.title || 'Project'} />

      {/* Summary */}
      {summary && (
        <p className="text-lg text-white/70 leading-relaxed mb-10">{summary}</p>
      )}

      {/* Case study section */}
      {(problem || solution || challenge) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {problem && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xs font-semibold tracking-wider text-white/40 uppercase mb-3">Problem</h3>
              <p className="text-white/75 leading-relaxed">{problem}</p>
            </div>
          )}
          {solution && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xs font-semibold tracking-wider text-white/40 uppercase mb-3">Solution</h3>
              <p className="text-white/75 leading-relaxed">{solution}</p>
            </div>
          )}
          {challenge && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:col-span-2">
              <h3 className="text-xs font-semibold tracking-wider text-white/40 uppercase mb-3">Challenge</h3>
              <p className="text-white/75 leading-relaxed">{challenge}</p>
            </div>
          )}
        </div>
      )}

      {/* Main markdown content */}
      {mainContent && (
        <div className="prose prose-invert max-w-none text-white/80 leading-relaxed prose-p:my-4 prose-headings:mt-8 prose-headings:mb-4 prose-headings:font-medium prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-white prose-a:underline prose-img:rounded-2xl prose-ul:my-4 prose-li:my-1 mb-10">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{mainContent}</ReactMarkdown>
        </div>
      )}

      {/* Tech stack */}
      {techStack.length > 0 && (
        <div className="mb-10">
          <h3 className="text-xs font-semibold tracking-wider text-white/40 uppercase mb-4">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {techStack.map(tech => (
              <span key={tech} className="bg-white/10 border border-white/10 px-3.5 py-2 rounded-xl text-sm text-white font-medium">{tech}</span>
            ))}
          </div>
        </div>
      )}

      {/* CTA links */}
      <div className="flex flex-wrap gap-4">
        {projectLink && (
          <a href={projectLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white text-black font-semibold rounded-xl px-6 py-3 transition hover:opacity-90">
            View Live <ArrowUpRight className="w-4 h-4" />
          </a>
        )}
        {item.github && item.github !== projectLink && (
          <a href={item.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/10 text-white font-semibold rounded-xl px-6 py-3 transition hover:bg-white/20">
            GitHub <ArrowUpRight className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}

function LiquidAccordion({ title, children }: { title: string, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white/5 backdrop-blur-[32px] border-[0.5px] border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] rounded-3xl overflow-hidden mb-4 relative transition-all duration-500">
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"></div>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none relative z-10 hover:bg-white/5 transition-colors"
      >
        <span className="text-xl font-medium tracking-tight text-white/90">{title}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
          <ChevronDown className="w-5 h-5 text-white/60" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-6 pb-6 pt-2 text-white/70 leading-relaxed text-lg border-t border-white/10">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BlogsView({ blogsData }: { blogsData: any[] }) {
  const [visibleCount, setVisibleCount] = useState(10);
  const handleLoadMore = () => setVisibleCount(prev => prev + 10);
  
  return (
    <div className="w-full">
      <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-8">Latest Writings</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {blogsData.length > 0 ? blogsData.slice(0, visibleCount).map(blog => (
          <ContentCard key={blog.id} item={blog} type="blog" />
        )) : (
          <ContentCard item={{ id: 'placeholder', title: "The Future of UI: Liquid Glass & Spatial Computing", description: "Exploring how frontend architectures will adapt to the new design trends dominated by heavy blurs and augmented reality..." }} type="blog" />
        )}
      </div>
      {blogsData.length > visibleCount && (
        <div className="mt-10 flex justify-center">
          <button onClick={handleLoadMore} className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-xl transition border border-white/10">
            More blogs
          </button>
        </div>
      )}
    </div>
  );
}

function ProjectsView({ projectsData }: { projectsData: any[] }) {
  const [visibleCount, setVisibleCount] = useState(10);
  const handleLoadMore = () => setVisibleCount(prev => prev + 10);
  
  return (
    <div className="w-full">
      <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-8">Featured Work</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projectsData.length > 0 ? projectsData.slice(0, visibleCount).map(project => (
          <ContentCard key={project.id} item={project} type="project" />
        )) : (
          <ContentCard item={{ id: 'placeholder', title: "Financial Dashboard", tech: "React, Tailwind, Recharts" }} type="project" />
        )}
      </div>
      {projectsData.length > visibleCount && (
        <div className="mt-10 flex justify-center">
          <button onClick={handleLoadMore} className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-xl transition border border-white/10">
            More projects
          </button>
        </div>
      )}
    </div>
  );
}

function HomeView({ blogsData, projectsData }: { blogsData: any[], projectsData: any[] }) {
  return (
    <div className="flex flex-col gap-24 md:gap-32 w-full pb-10">
      {/* Hero section */}
      <section className="min-h-[calc(100vh-280px)] md:min-h-[calc(100vh-320px)] flex flex-col justify-end">
        <BlurMorphText />
      </section>

      {/* About snippet */}
      <section 
        className="flex flex-col md:flex-row gap-6 md:gap-8 justify-between items-start md:items-center bg-white/5 backdrop-blur-[32px] border-[0.5px] border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] p-6 sm:p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"></div>
        <div className="flex-1 max-w-2xl relative z-10 w-full flex flex-col items-start">
          <div className="md:hidden w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-white/20 to-transparent rounded-full flex items-center justify-center shrink-0 border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] mb-6">
             <Terminal className="w-7 h-7 sm:w-8 sm:h-8 text-white/90 drop-shadow-lg" />
          </div>
          <h2 className="text-3xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-3 md:mb-4">Engineering with purpose</h2>
          <p className="text-base md:text-lg text-white/70 leading-relaxed mb-6 md:mb-8 font-medium">
            I'm a Software Development Engineer passionate about building scalable backends, intuitive interfaces, and automating workflows.
          </p>
          <Link to="/about" className="inline-flex w-full sm:w-max justify-center items-center gap-2 px-6 py-3.5 bg-white text-black font-semibold rounded-xl hover:opacity-90 transition shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]">
            More About Me <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="hidden md:flex w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full items-center justify-center shrink-0 border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] relative z-10">
           <Terminal className="w-16 h-16 text-white/90 drop-shadow-lg" />
        </div>
      </section>

      {/* Projects snippet */}
      <section>
        <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Featured Work</h2>
          <Link to="/projects" className="text-white/60 hover:text-white transition flex items-center gap-1 font-medium bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full">
            See All <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projectsData.length > 0 ? projectsData.slice(0, 4).map(project => (
            <ContentCard key={project.id} item={project} type="project" />
          )) : (
            <ContentCard item={{ id: 'placeholder', title: "Financial Dashboard", tech: "React, Tailwind, Recharts" }} type="project" />
          )}
        </div>
      </section>

      {/* Blogs snippet */}
      <section>
        <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Latest Writings</h2>
          <Link to="/blogs" className="text-white/60 hover:text-white transition flex items-center gap-1 font-medium bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full">
            See All <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {blogsData.length > 0 ? blogsData.slice(0, 4).map(blog => (
            <ContentCard key={blog.id} item={blog} type="blog" />
          )) : (
            <ContentCard item={{ id: 'placeholder', title: "The Future of UI: Liquid Glass & Spatial Computing", description: "Exploring how frontend architectures will adapt to the new design trends dominated by heavy blurs and augmented reality..." }} type="blog" />
          )}
        </div>
      </section>

    </div>
  );
}

function PageTransition({ children, className = "w-full" }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function IntroScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000); 
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-40 flex items-center justify-center bg-[var(--bg-base)]"
      exit={{ opacity: 0 }} 
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <motion.div layoutId="logo-container" className="w-32 h-32 md:w-48 md:h-48 text-white flex items-center justify-center">
        <KPLogo animate={true} className="w-full h-full" />
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    if (!introComplete) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [introComplete]);

  const getInitialThemeIndex = () => {
    const saved = localStorage.getItem('themeIndex');
    if (saved !== null) {
      const idx = parseInt(saved, 10);
      document.documentElement.setAttribute('data-theme', themes[idx]);
      return idx;
    }
    return 0;
  };

  const [themeIndex, setThemeIndex] = useState(getInitialThemeIndex);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themes[themeIndex]);
  }, []);

  useEffect(() => {
    trackPageView();
  }, []);

  const [blogsData, setBlogsData] = useState<any[]>([]);
  const [projectsData, setProjectsData] = useState<any[]>([]);

  useEffect(() => {
    fetchBlogs().then(setBlogsData).catch(err => console.error('Failed to load blogs:', err));
    fetchProjects().then(setProjectsData).catch(err => console.error('Failed to load projects:', err));
  }, []);

  const toggleTheme = () => {
    const nextIndex = (themeIndex + 1) % themes.length;
    setThemeIndex(nextIndex);
    localStorage.setItem('themeIndex', String(nextIndex));
    document.documentElement.setAttribute('data-theme', themes[nextIndex]);
  };

  const isAdminPath = location.pathname.startsWith('/admin') && user !== null;
  const navItems = isAdminPath ? [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/admin" },
    { name: "Blogs", path: "/admin/blogs" },
    { name: "Projects", path: "/admin/projects" },
    { name: "Resume", path: "/admin/resume" }
  ] : [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Blogs", path: "/blogs" },
    { name: "Projects", path: "/projects" },
    { name: "Contact Us", path: "/contact" }
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Dynamically update SEO tags for static paths on route change
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      updateMetaTags(
        'Kushyanth Pothineni | Software Development Engineer',
        'Portfolio of Kushyanth Pothineni - Software Development Engineer specializing in web development, mobile applications, and creative design solutions.',
        '/'
      );
    } else if (path === '/about') {
      updateMetaTags(
        'About Me | Kushyanth Pothineni',
        'Learn more about Kushyanth Pothineni, a Software Development Engineer passionate about building scalable backends, intuitive interfaces, and DevOps.',
        '/about'
      );
    } else if (path === '/blogs') {
      updateMetaTags(
        'Latest Writings | Kushyanth Pothineni',
        'Read technical articles, guides, and insights on software development, cloud systems, and coding written by Kushyanth Pothineni.',
        '/blogs'
      );
    } else if (path === '/projects') {
      updateMetaTags(
        'Featured Work | Kushyanth Pothineni',
        'Explore featured engineering projects, mobile apps, and case studies built by Kushyanth Pothineni.',
        '/projects'
      );
    } else if (path === '/contact') {
      updateMetaTags(
        'Get in Touch | Kushyanth Pothineni',
        'Contact Kushyanth Pothineni for web development, consulting, cloud migrations, or contract projects.',
        '/contact'
      );
    }
  }, [location.pathname]);

  return (
    <LayoutGroup>
      <div className="min-h-screen font-sans overflow-x-hidden p-6 md:p-8 flex flex-col selection:bg-white/30 selection:text-white relative">
        <AnimatePresence>
          {!introComplete && (
            <IntroScreen onComplete={() => {
              setIntroComplete(true);
            }} />
          )}
        </AnimatePresence>
        
        <ScrollToTop />
        {/* Navbar */}
        <div className="fixed top-6 left-6 right-6 md:left-8 md:right-8 z-50 pointer-events-none">
          <nav className="flex items-center justify-between mx-auto w-full pointer-events-auto">
            {/* Logo */}
            <div className="z-[110] relative">
              <Link to="/" className="flex items-center gap-2 cursor-pointer transition hover:opacity-80 text-white">
                {introComplete ? (
                  <motion.div layoutId="logo-container" className="w-8 h-8 flex items-center justify-center">
                    <KPLogo className="w-full h-full opacity-90" />
                  </motion.div>
                ) : (
                  <div className="w-8 h-8" />
                )}
              </Link>
            </div>

          {/* Links Pill */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: introComplete ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="hidden md:flex items-center gap-8 px-8 bg-white/10 backdrop-blur-[32px] border-[0.5px] border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)] rounded-full py-3 relative overflow-hidden"
          >
            {/* Subtle inner top highlight */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
            
            {navItems.map((item, i) => {
              const isActive = location.pathname === item.path;
              return (
                <Link to={item.path} key={item.name} className="flex items-center gap-2 cursor-pointer z-10 group shrink-0">
                  <motion.span 
                    initial={{ opacity: 0, width: 0, x: -10 }}
                    animate={{ opacity: 1, width: "auto", x: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.8 + i * 0.1 }}
                    className={`text-sm overflow-hidden whitespace-nowrap transition ${isActive ? 'text-white font-bold' : 'text-white/70 font-medium group-hover:text-white'}`}
                    style={{ originX: 0 }}
                  >
                    {item.name}
                  </motion.span>
                </Link>
              )
            })}
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: introComplete ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 md:gap-4 z-50"
          >
            <button onClick={toggleTheme} className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-[32px] border-[0.5px] border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)] text-white flex items-center justify-center hover:bg-white/20 transition shrink-0 relative overflow-hidden">
              {/* Subtle inner top highlight */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
              <Palette className="w-5 h-5 z-10" />
            </button>

            {isAdminPath && (
              <button onClick={() => signOut(auth)} className="hidden md:flex w-11 h-11 rounded-full bg-red-500/10 backdrop-blur-[32px] border-[0.5px] border-red-500/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] text-red-400 items-center justify-center hover:bg-red-500/20 transition shrink-0 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <LogOut className="w-5 h-5 z-10" />
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: introComplete ? 1 : 0 }}
              transition={{ duration: 0.8 }}
              className="relative md:hidden w-11 h-11 shrink-0 z-50"
            >
              <motion.div
                initial={false}
                animate={{
                  width: isMobileMenuOpen ? 220 : 44,
                  height: isMobileMenuOpen ? "auto" : 44,
                  borderRadius: isMobileMenuOpen ? 28 : 20,
                }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="absolute top-0 right-0 bg-white/10 backdrop-blur-[24px] flex flex-col"
                style={{
                  boxShadow: "0 8px 32px 0 rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4)",
                  border: "0.5px solid rgba(255,255,255,0.3)",
                  overflow: "hidden"
                }}
              >
                <div className="flex justify-end items-center h-11 w-full shrink-0 relative">
                  {!isMobileMenuOpen && <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none"></div>}
                  <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="w-11 h-11 flex items-center justify-center text-white relative z-10 shrink-0">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {isMobileMenuOpen ? (
                        <motion.div
                          key="close"
                          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                          animate={{ opacity: 1, rotate: 0, scale: 1 }}
                          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                          transition={{ duration: 0.2 }}
                          className="absolute flex items-center justify-center"
                        >
                          <X className="w-5 h-5" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="menu"
                          initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                          animate={{ opacity: 1, rotate: 0, scale: 1 }}
                          exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                          transition={{ duration: 0.2 }}
                          className="absolute flex items-center justify-center"
                        >
                          <Menu className="w-5 h-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
                
                <AnimatePresence>
                  {isMobileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                      transition={{ duration: 0.3, delay: 0.05 }}
                      className="flex flex-col gap-1 px-3 pb-3 w-[220px] shrink-0"
                    >
                      {navItems.map((item, i) => {
                        const isActive = location.pathname === item.path;
                        return (
                          <Link onClick={() => setIsMobileMenuOpen(false)} to={item.path} key={item.name} className="relative overflow-hidden group rounded-2xl shrink-0">
                            <div className={`absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition duration-300 ${isActive ? 'opacity-100' : ''}`}></div>
                            <div className={`px-4 py-3 flex items-center gap-3 relative z-10 text-[16px] whitespace-nowrap transition ${isActive ? 'text-white font-bold' : 'text-white/80 font-medium group-hover:text-white'}`}>
                              {item.name}
                            </div>
                          </Link>
                        )
                      })}
                      {isAdminPath && (
                        <button onClick={() => { setIsMobileMenuOpen(false); signOut(auth); }} className="relative overflow-hidden group rounded-2xl shrink-0 w-full text-left mt-2">
                          <div className={`absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition duration-300`}></div>
                          <div className={`px-4 py-3 flex items-center gap-3 relative z-10 text-[16px] whitespace-nowrap transition text-red-400 font-medium`}>
                            Logout <LogOut className="w-4 h-4 ml-auto" />
                          </div>
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </motion.div>
        </nav>
      </div>

      {/* Main Content Layout */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: introComplete ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className={`flex-1 w-full mx-auto z-10 relative flex flex-col pb-6 ${location.pathname.startsWith('/admin') ? 'pt-16 md:pt-20' : 'pt-32 md:pt-40'}`}
      >
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><HomeView blogsData={blogsData} projectsData={projectsData} /></PageTransition>} />
            <Route path="/about" element={
              <PageTransition className="w-full pb-10">
                <div className="mb-12 md:mb-20">
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-white leading-[1.1] md:leading-[86px] max-w-[857px]">Engineering <br className="hidden md:block" /> with purpose.</h2>
                <p className="text-xl md:text-2xl text-white/60 max-w-2xl leading-relaxed font-medium">
                  I'm a Software Development Engineer passionate about building scalable backends, intuitive interfaces, and automating workflows.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto">
                {/* Large Profile / Bio Block replaced by JourneyCard */}
                <JourneyCard />

                {/* Tech Stack / Keywords */}
                <div className="bg-white/5 backdrop-blur-[32px] border-[0.5px] border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group flex flex-col">
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  <h3 className="text-2xl font-semibold tracking-tight text-white mb-8">Core Toolkit</h3>
                  <div className="flex flex-wrap gap-2.5 mt-auto">
                    {["Java", "Python", "TypeScript", "Spring Boot", "React", "Node.js", "Firebase", "SQL", "Docker", "Kubernetes", "AWS"].map(tech => (
                      <span key={tech} className="bg-white/10 hover:bg-white/20 transition cursor-default border border-white/10 px-3.5 py-2 rounded-xl text-sm text-white font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* What I Do - Bento Grid style */}
                <div className="bg-white/5 hover:bg-white/10 transition duration-500 backdrop-blur-[32px] border-[0.5px] border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-[2.5rem] p-8 relative overflow-hidden group flex flex-col">
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  <div className="mb-6 w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                    <Cloud className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight text-white mb-3">Cloud & DevOps</h3>
                  <p className="text-white/60 leading-relaxed font-medium">Deploying and managing resilient cloud-native architectures with AWS, GCP, and Kubernetes integrations.</p>
                </div>

                <div className="bg-white/5 hover:bg-white/10 transition duration-500 backdrop-blur-[32px] border-[0.5px] border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-[2.5rem] p-8 relative overflow-hidden group flex flex-col">
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  <div className="mb-6 w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                    <Database className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight text-white mb-3">Backend & Data</h3>
                  <p className="text-white/60 leading-relaxed font-medium">Designing scalable systems and RESTful APIs. Expertise in scalable DataGrip, Snowflake, Redis, and MySQL.</p>
                </div>

                <div className="bg-white/5 hover:bg-white/10 transition duration-500 backdrop-blur-[32px] border-[0.5px] border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-[2.5rem] p-8 relative overflow-hidden group flex flex-col">
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  <div className="mb-6 w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                    <Terminal className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight text-white mb-3">AI & Automation</h3>
                  <p className="text-white/60 leading-relaxed font-medium">Leveraging powerful tools like n8n and Claude to build intelligent automation pipelines and dev workflows.</p>
                </div>

                {/* Full Width Footer area for Open Source */}
                <div className="md:col-span-3 bg-white/5 hover:bg-white/10 transition duration-500 backdrop-blur-[32px] border-[0.5px] border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center">
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-semibold tracking-tight text-white mb-4">Open Source Community</h3>
                    <p className="text-lg text-white/70 leading-relaxed">
                      An active contributor to core open-source repositories. I focus on resolving community-reported issues, refactoring legacy code for backend optimization, and enhancing technical documentation to streamline onboarding for new developers.
                    </p>
                  </div>
                  <div className="shrink-0 flex gap-4 align-middle">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                      <Code2 className="w-8 h-8 text-white" />
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                      <GitPullRequest className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>

                {/* Social Links Section */}
                <div className="md:col-span-3 bg-white/5 hover:bg-white/10 transition duration-500 backdrop-blur-[32px] border-[0.5px] border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  <div>
                    <h3 className="text-3xl font-semibold tracking-tight text-white mb-2 md:mb-4">Connect with me</h3>
                    <p className="text-lg text-white/70">Find me on these online spaces and let's build something together.</p>
                  </div>
                  <div className="flex flex-wrap gap-4 shrink-0">
                    <a href="https://www.instagram.com/kushyanthpothineni.21/" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-white/10 hover:bg-white/20 transition flex items-center justify-center group border border-white/10">
                      <Instagram className="w-6 h-6 text-white/80 group-hover:text-white transition-colors" />
                    </a>
                    <a href="http://x.com/KushyanthPothi1" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-white/10 hover:bg-white/20 transition flex items-center justify-center group border border-white/10">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-white/80 group-hover:text-white transition-colors" aria-hidden="true">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/kushyanthpothineni/" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-white/10 hover:bg-white/20 transition flex items-center justify-center group border border-white/10">
                      <Linkedin className="w-6 h-6 text-white/80 group-hover:text-white transition-colors" />
                    </a>
                    <a href="https://github.com/kushyanthpothi" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-white/10 hover:bg-white/20 transition flex items-center justify-center group border border-white/10">
                      <Github className="w-6 h-6 text-white/80 group-hover:text-white transition-colors" />
                    </a>
                  </div>
                </div>
              </div>
            </PageTransition>
          } />
          <Route path="/blogs" element={
            <PageTransition className="w-full">
              <BlogsView blogsData={blogsData} />
            </PageTransition>
          } />
          <Route path="/blogs/:id" element={<PageTransition><BlogDetailView data={blogsData} /></PageTransition>} />
          <Route path="/projects" element={
            <PageTransition className="w-full">
              <ProjectsView projectsData={projectsData} />
            </PageTransition>
          } />
          <Route path="/projects/:id" element={<PageTransition><ProjectDetailView data={projectsData} /></PageTransition>} />
          <Route path="/admin/*" element={<PageTransition className="w-full flex-1 flex flex-col"><AdminPanel /></PageTransition>} />
          <Route path="/contact" element={
            <PageTransition className="w-full max-w-xl">
              <ContactView />
            </PageTransition>
          } />
          <Route path="*" element={
            <PageTransition className="w-full flex-1 flex flex-col items-start justify-end">
              <div className="flex flex-wrap items-center gap-6 md:gap-8">
                <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-white">404</h2>
                <div className="hidden sm:block w-[1px] h-12 bg-white/20"></div>
                <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-white/80">Page not found.</h3>
                <Link to="/" className="inline-flex items-center justify-center gap-2 bg-white text-black font-semibold rounded-xl px-6 py-3 transition hover:opacity-90 sm:ml-4">
                  Back to Home <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </PageTransition>
          } />
        </Routes>
        </AnimatePresence>
      </motion.main>

      {/* Footer & Horizontal Line */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: introComplete ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="w-full mx-auto border-t-[0.5px] border-white/20 pt-6 pb-2 z-10 shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4"
      >
        <div className="text-white/60 text-[13px] font-medium tracking-wide text-center sm:text-left">
          © {new Date().getFullYear()} Kushyanth Pothineni. All rights reserved.
        </div>
        <div className="flex items-center gap-5 text-[13px] text-white/60 font-medium">
          <a href="https://www.linkedin.com/in/kushyanth/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">LinkedIn</a>
          <a href="https://github.com/kushyanthpothi" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">GitHub</a>
          <a href="https://x.com/KushyanthPothi1" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">X (Twitter)</a>
        </div>
      </motion.footer>
      {!location.pathname.startsWith('/admin') && <LikeButton introComplete={introComplete} />}
    </div>
    </LayoutGroup>
  );
}
