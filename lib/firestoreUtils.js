import { db } from './firebase';
import { collection, getDocs, query, where, orderBy, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

// Cache variables
let projectsCache = null;
let experiencesCache = null;
let servicesCache = null;
let techStackCache = null;
let blogsCache = null;
let blogCache = {}; // Cache individual blogs by slug

// Cache invalidation helper
export const invalidateCache = (type) => {
    if (type === 'projects') projectsCache = null;
    if (type === 'experiences') experiencesCache = null;
    if (type === 'services') servicesCache = null;
    if (type === 'techStack') techStackCache = null;
    if (type === 'blogs') {
        blogsCache = null;
        blogCache = {};
    }
};

export const fetchProjects = async (forceRefresh = false) => {
    if (projectsCache && !forceRefresh) return projectsCache;
    try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const projects = [];
        querySnapshot.forEach((doc) => {
            projects.push({ ...doc.data(), slug: doc.id });
        });
        // Sort by id if needed, or year. Assuming id is number.
        projectsCache = projects.sort((a, b) => a.id - b.id);
        return projectsCache;
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
};

export const fetchProjectBySlug = async (slug) => {
    // Check if we have it in the list cache first
    if (projectsCache) {
        const project = projectsCache.find(p => p.slug === slug);
        if (project) return project;
    }

    try {
        const docRef = doc(db, "projects", slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { ...docSnap.data(), slug: docSnap.id };
        } else {
            console.log("No such project!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching project:", error);
        return null;
    }
};

export const fetchExperiences = async (forceRefresh = false) => {
    if (experiencesCache && !forceRefresh) return experiencesCache;
    try {
        const querySnapshot = await getDocs(collection(db, "experiences"));
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push(doc.data());
        });
        experiencesCache = data.sort((a, b) => a.id.localeCompare(b.id));
        return experiencesCache;
    } catch (error) {
        console.error("Error fetching experiences:", error);
        return [];
    }
}

export const fetchServices = async (forceRefresh = false) => {
    if (servicesCache && !forceRefresh) return servicesCache;
    try {
        const querySnapshot = await getDocs(collection(db, "services"));
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push(doc.data());
        });
        servicesCache = data.sort((a, b) => a.id.localeCompare(b.id));
        return servicesCache;
    } catch (error) {
        console.error("Error fetching services:", error);
        return [];
    }
}

export const fetchTechStack = async (forceRefresh = false) => {
    if (techStackCache && !forceRefresh) return techStackCache;
    try {
        const querySnapshot = await getDocs(collection(db, "tech_stack"));
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push(doc.data());
        });
        // No specific order enforced unless we add an index field
        techStackCache = data;
        return techStackCache;
    } catch (error) {
        console.error("Error fetching tech stack:", error);
        return [];
    }
}

export const fetchBlogs = async (forceRefresh = false) => {
    if (blogsCache && !forceRefresh) return blogsCache;
    try {
        const querySnapshot = await getDocs(collection(db, "blogs"));
        const blogs = [];
        querySnapshot.forEach((doc) => {
            blogs.push({ ...doc.data(), slug: doc.id });
        });
        // Sort by date, newest first
        blogsCache = blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
        return blogsCache;
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return [];
    }
};

export const fetchBlogBySlug = async (slug) => {
    console.log(`[firestoreUtils] fetchBlogBySlug called for: "${slug}"`);
    if (blogCache[slug]) {
        console.log(`[firestoreUtils] Returning from individual cache for: "${slug}"`);
        return blogCache[slug];
    }

    // Check if we have it in the list cache
    if (blogsCache) {
        const blog = blogsCache.find(b => b.slug === slug);
        if (blog) {
            console.log(`[firestoreUtils] Found in list cache for: "${slug}"`);
            blogCache[slug] = blog;
            return blog;
        }
    }

    try {
        console.log(`[firestoreUtils] Fetching from Firestore for: "${slug}"`);
        const docRef = doc(db, "blogs", slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log(`[firestoreUtils] Document found in Firestore for: "${slug}"`);
            const blog = { ...docSnap.data(), slug: docSnap.id };
            blogCache[slug] = blog;
            return blog;
        } else {
            console.log(`[firestoreUtils] Document NOT found in Firestore for: "${slug}"`);
            return null;
        }
    } catch (error) {
        console.error("Error fetching blog:", error);
        return null;
    }
};

// Write Operations

export const addProject = async (projectData) => {
    try {
        // Generate slug from title if not provided
        const slug = projectData.slug || projectData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        // Use setDoc with a specific ID (slug) instead of addDoc with auto-generated ID
        await setDoc(doc(db, "projects", slug), {
            ...projectData,
            createdAt: new Date().toISOString()
        });
        invalidateCache('projects');
        return { success: true, id: slug };
    } catch (error) {
        console.error("Error adding project:", error);
        return { success: false, error };
    }
};

export const addBlog = async (blogData) => {
    try {
        // Generate slug from title if not provided
        const slug = blogData.slug || blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        // Auto-generate date if not provided
        const date = blogData.date || new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        await setDoc(doc(db, "blogs", slug), {
            ...blogData,
            date: date,
            createdAt: new Date().toISOString()
        });
        invalidateCache('blogs');
        return { success: true, id: slug };
    } catch (error) {
        console.error("Error adding blog:", error);
        return { success: false, error };
    }
};

export const saveSettings = async (settingsId, data) => {
    try {
        await setDoc(doc(db, "settings", settingsId), data, { merge: true });
        return { success: true };
    } catch (error) {
        console.error("Error saving settings:", error);
        return { success: false, error };
    }
};

export const getSettings = async (settingsId) => {
    try {
        const docRef = doc(db, "settings", settingsId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null; // Return null if not found
    } catch (error) {
        console.error("Error fetching settings:", error);
        return null;
    }
};


// Delete Operations

export const deleteProject = async (slug) => {
    try {
        await deleteDoc(doc(db, "projects", slug));
        invalidateCache('projects');
        return { success: true };
    } catch (error) {
        console.error("Error deleting project:", error);
        return { success: false, error };
    }
};

export const deleteBlog = async (slug) => {
    try {
        if (!slug) {
            throw new Error('Blog slug is required for deletion');
        }

        console.log('Deleting blog document with slug:', slug);
        const blogRef = doc(db, "blogs", slug);
        await deleteDoc(blogRef);
        console.log('Blog deleted successfully:', slug);
        invalidateCache('blogs');
        return { success: true };
    } catch (error) {
        console.error("Error deleting blog:", error);
        return { success: false, error: { message: error.message, code: error.code } };
    }
};

// Experience CRUD Operations

export const addExperience = async (experienceData) => {
    try {
        // Generate ID from role+company if not provided
        const id = experienceData.id || `${experienceData.role}-${experienceData.company}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        await setDoc(doc(db, "experiences", id), {
            ...experienceData,
            id,
            createdAt: new Date().toISOString()
        });
        return { success: true, id };
    } catch (error) {
        console.error("Error adding experience:", error);
        return { success: false, error };
    }
};

export const updateExperience = async (id, experienceData) => {
    try {
        if (!id) {
            throw new Error('Experience ID is required for update');
        }

        await setDoc(doc(db, "experiences", id), {
            ...experienceData,
            id,
            updatedAt: new Date().toISOString()
        }, { merge: true });
        return { success: true };
    } catch (error) {
        console.error("Error updating experience:", error);
        return { success: false, error };
    }
};

export const deleteExperience = async (id) => {
    try {
        if (!id) {
            throw new Error('Experience ID is required for deletion');
        }

        console.log('Deleting experience with ID:', id);
        await deleteDoc(doc(db, "experiences", id));
        console.log('Experience deleted successfully:', id);
        return { success: true };
    } catch (error) {
        console.error("Error deleting experience:", error);
        return { success: false, error: { message: error.message, code: error.code } };
    }
};

// ============== VISITOR ANALYTICS ==============

// Log a visit (call this when page loads)
export const logVisit = async () => {
    try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const docRef = doc(db, "analytics", today);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // Increment count
            await setDoc(docRef, {
                date: today,
                count: (docSnap.data().count || 0) + 1
            });
        } else {
            // First visit today
            await setDoc(docRef, { date: today, count: 1 });
        }
        return { success: true };
    } catch (error) {
        console.error("Error logging visit:", error);
        return { success: false, error };
    }
};

// Get visitor stats for last N days
export const getVisitorStats = async (days = 10) => {
    try {
        const stats = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const docRef = doc(db, "analytics", dateStr);
            const docSnap = await getDoc(docRef);

            stats.push({
                date: dateStr,
                label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                count: docSnap.exists() ? docSnap.data().count : 0
            });
        }

        const totalVisits = stats.reduce((sum, day) => sum + day.count, 0);

        return { stats, totalVisits };
    } catch (error) {
        console.error("Error fetching visitor stats:", error);
        return { stats: [], totalVisits: 0 };
    }
};
