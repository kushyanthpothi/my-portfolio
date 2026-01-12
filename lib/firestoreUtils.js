import { db } from './firebase';
import { collection, getDocs, query, where, orderBy, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

export const fetchProjects = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const projects = [];
        querySnapshot.forEach((doc) => {
            projects.push({ ...doc.data(), slug: doc.id });
        });
        // Sort by id if needed, or year. Assuming id is number.
        return projects.sort((a, b) => a.id - b.id);
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
};

export const fetchProjectBySlug = async (slug) => {
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

export const fetchExperiences = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "experiences"));
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push(doc.data());
        });
        return data.sort((a, b) => a.id.localeCompare(b.id));
    } catch (error) {
        console.error("Error fetching experiences:", error);
        return [];
    }
}

export const fetchServices = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "services"));
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push(doc.data());
        });
        return data.sort((a, b) => a.id.localeCompare(b.id));
    } catch (error) {
        console.error("Error fetching services:", error);
        return [];
    }
}

export const fetchTechStack = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "tech_stack"));
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push(doc.data());
        });
        // No specific order enforced unless we add an index field
        return data;
    } catch (error) {
        console.error("Error fetching tech stack:", error);
        return [];
    }
}

export const fetchBlogs = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "blogs"));
        const blogs = [];
        querySnapshot.forEach((doc) => {
            blogs.push({ ...doc.data(), slug: doc.id });
        });
        // Sort by date, newest first
        return blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return [];
    }
};

export const fetchBlogBySlug = async (slug) => {
    try {
        const docRef = doc(db, "blogs", slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { ...docSnap.data(), slug: docSnap.id };
        } else {
            console.log("No such blog!");
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
