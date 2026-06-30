/**
 * Firestore utility functions for v3.
 * Mirrors the v2 pattern: in-memory cache + sorted fetches + slug-based document IDs.
 */

import { db } from './firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';

// ---------------------------------------------------------------------------
// In-memory caches (module-level singletons)
// ---------------------------------------------------------------------------
let projectsCache: any[] | null = null;
let blogsCache: any[] | null = null;
const blogCacheBySlug: Record<string, any> = {};
const projectCacheBySlug: Record<string, any> = {};

// ---------------------------------------------------------------------------
// Cache invalidation
// ---------------------------------------------------------------------------
export function invalidateCache(type: 'projects' | 'blogs') {
  if (type === 'projects') {
    projectsCache = null;
    for (const key of Object.keys(projectCacheBySlug)) delete projectCacheBySlug[key];
  }
  if (type === 'blogs') {
    blogsCache = null;
    for (const key of Object.keys(blogCacheBySlug)) delete blogCacheBySlug[key];
  }
}

// ---------------------------------------------------------------------------
// Slug generator (matches v2 convention)
// ---------------------------------------------------------------------------
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
export async function fetchProjects(forceRefresh = false): Promise<any[]> {
  if (projectsCache && !forceRefresh) return projectsCache;
  try {
    const snapshot = await getDocs(collection(db, 'projects'));
    const projects: any[] = snapshot.docs.map(d => ({ ...d.data(), id: d.id, slug: d.id }));

    // Sort by createdAt descending (newest first), fallback to id
    projectsCache = projects.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
    return projectsCache;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function fetchProjectBySlug(slug: string): Promise<any | null> {
  if (projectCacheBySlug[slug]) return projectCacheBySlug[slug];

  if (projectsCache) {
    const found = projectsCache.find(p => p.slug === slug || p.id === slug);
    if (found) { projectCacheBySlug[slug] = found; return found; }
  }

  try {
    const snap = await getDoc(doc(db, 'projects', slug));
    if (snap.exists()) {
      const project = { ...snap.data(), id: snap.id, slug: snap.id };
      projectCacheBySlug[slug] = project;
      return project;
    }
    return null;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

export async function saveProject(
  projectData: any
): Promise<{ success: boolean; id?: string; error?: any }> {
  try {
    const slug =
      projectData.slug ||
      projectData.id ||
      generateSlug(projectData.title || String(Date.now()));

    const payload = {
      ...projectData,
      id: slug,
      slug,
      createdAt: projectData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'projects', slug), payload);
    invalidateCache('projects');
    return { success: true, id: slug };
  } catch (error) {
    console.error('Error saving project:', error);
    return { success: false, error };
  }
}

export async function deleteProject(
  slug: string
): Promise<{ success: boolean; error?: any }> {
  try {
    await deleteDoc(doc(db, 'projects', slug));
    invalidateCache('projects');
    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    return { success: false, error };
  }
}

// ---------------------------------------------------------------------------
// Blogs
// ---------------------------------------------------------------------------
export async function fetchBlogs(forceRefresh = false): Promise<any[]> {
  if (blogsCache && !forceRefresh) return blogsCache;
  try {
    const snapshot = await getDocs(collection(db, 'blogs'));
    const blogs: any[] = snapshot.docs.map(d => ({ ...d.data(), id: d.id, slug: d.id }));

    // Sort by date descending (newest first)
    blogsCache = blogs.sort((a, b) => {
      const dateA = a.createdAt || a.date || '';
      const dateB = b.createdAt || b.date || '';
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
    return blogsCache;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export async function fetchBlogBySlug(slug: string): Promise<any | null> {
  if (blogCacheBySlug[slug]) return blogCacheBySlug[slug];

  if (blogsCache) {
    const found = blogsCache.find(b => b.slug === slug || b.id === slug);
    if (found) { blogCacheBySlug[slug] = found; return found; }
  }

  try {
    const snap = await getDoc(doc(db, 'blogs', slug));
    if (snap.exists()) {
      const blog = { ...snap.data(), id: snap.id, slug: snap.id };
      blogCacheBySlug[slug] = blog;
      return blog;
    }
    return null;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

export async function saveBlog(
  blogData: any
): Promise<{ success: boolean; id?: string; error?: any }> {
  try {
    const slug =
      blogData.slug ||
      blogData.id ||
      generateSlug(blogData.title || String(Date.now()));

    const date =
      blogData.date ||
      new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

    const payload = {
      ...blogData,
      id: slug,
      slug,
      date,
      createdAt: blogData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'blogs', slug), payload);
    invalidateCache('blogs');
    return { success: true, id: slug };
  } catch (error) {
    console.error('Error saving blog:', error);
    return { success: false, error };
  }
}

export async function deleteBlog(
  slug: string
): Promise<{ success: boolean; error?: any }> {
  try {
    await deleteDoc(doc(db, 'blogs', slug));
    invalidateCache('blogs');
    return { success: true };
  } catch (error) {
    console.error('Error deleting blog:', error);
    return { success: false, error };
  }
}
