import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, getDocs, doc, getDoc, setDoc, query, orderBy, limit } from 'firebase/firestore';
import { saveBlog, deleteBlog, saveProject, deleteProject } from './firestoreUtils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { LayoutDashboard, FileText, FolderGit2, FileUp, LogOut, Plus, Edit2, Trash2, ArrowLeft, BarChart2, Edit3, Eye, EyeOff, ArrowUpRight, Save } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { KPLogo } from './KPLogo';
import { ContentCard } from './ContentCard';
import { LoadingIndicator } from './LoadingIndicator';
import { MarkdownEditor, ModernInput, ModernTextarea, TagInput } from './AdminEditor';

export function AdminPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  if (loading) return <LoadingIndicator />;

  if (!user) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center px-4 relative z-10 max-w-full">
        {/* Decorative Background Elements */}
        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-white/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none -z-10"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[440px] relative"
        >
          {/* Glass Card */}
          <div className="w-full bg-white/5 backdrop-blur-[40px] border-[0.5px] border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
            
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]">
                <LayoutDashboard className="w-8 h-8 text-white/90" />
              </div>
            </div>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">Admin Portal</h2>
              <p className="text-white/50 text-sm">Secure access to your content management and analytics.</p>
            </div>
            
            {loginError && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl flex items-center justify-center text-center"
              >
                {loginError}
              </motion.div>
            )}
            
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div className="relative group/input">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border-[0.5px] border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-white/40 text-white placeholder:text-white/30 transition shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]" 
                  required
                />
              </div>
              <div className="relative group/input">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border-[0.5px] border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-white/40 text-white placeholder:text-white/30 transition shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] pr-12" 
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/80 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <button type="submit" className="w-full bg-white/10 hover:bg-white/20 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] text-white font-semibold rounded-2xl px-6 py-4 mt-2 transition duration-300 tracking-wide flex items-center justify-center gap-2 group/btn">
                <span>Sign In</span>
                <ArrowLeft className="w-4 h-4 rotate-180 opacity-50 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1">
      <Routes>
        <Route path="/" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}><Dashboard /></motion.div>} />
        <Route path="/blogs" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}><AdminBlogs /></motion.div>} />
        <Route path="/projects" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}><AdminProjects /></motion.div>} />
        <Route path="/resume" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}><AdminResume /></motion.div>} />
      </Routes>
    </div>
  );
}



function Dashboard() {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [topBlogs, setTopBlogs] = useState<any[]>([]);
  const [topProjects, setTopProjects] = useState<any[]>([]);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Daily visits
        const vSnap = await getDocs(query(collection(db, 'analytics_daily'), orderBy('date', 'desc'), limit(7)));
        const vData = vSnap.docs.map(d => d.data()).reverse();
        const formattedVData = vData.map((d: any) => {
           const date = new Date(d.date);
           const name = date.toLocaleDateString('en-US', { weekday: 'short' });
           return { name, pv: d.visits || 0 };
        });
        if (formattedVData.length === 0) formattedVData.push({ name: 'Today', pv: 0 });
        setVisitors(formattedVData);

        // Locations
        const lSnap = await getDocs(query(collection(db, 'analytics_locations'), orderBy('views', 'desc'), limit(5)));
        const lData = lSnap.docs.map(d => ({ name: d.data().name || d.id, views: d.data().views || 0 }));
        if (lData.length === 0) lData.push({ name: 'Unknown', views: 0 });
        setLocations(lData);

        // Fetch totals
        try {
          const likesSnap = await getDoc(doc(db, 'settings', 'likes'));
          if (likesSnap.exists()) setTotalLikes(likesSnap.data().count || 0);

          const bSnap = await getDocs(collection(db, 'blogs'));
          setTotalBlogs(bSnap.size);
          let bViews = 0;
          const blogsData = bSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
          blogsData.forEach((d: any) => { bViews += d.views || 0 });
          
          const sortedBlogs = [...blogsData].sort((a: any, b: any) => (b.views || 0) - (a.views || 0)).slice(0, 5);
          setTopBlogs(sortedBlogs.map(d => ({ title: d.title || d.name || 'Untitled', views: d.views || 0 })));

          const pSnap = await getDocs(collection(db, 'projects'));
          setTotalProjects(pSnap.size);
          let pViews = 0;
          const projectsData = pSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
          projectsData.forEach((d: any) => { pViews += d.views || 0 });
          
          const sortedProjects = [...projectsData].sort((a: any, b: any) => (b.views || 0) - (a.views || 0)).slice(0, 5);
          setTopProjects(sortedProjects.map(d => ({ title: d.title || d.name || 'Untitled', views: d.views || 0 })));

          setTotalViews(bViews + pViews);
        } catch(e: any) {
            console.error(e);
        }

      } catch(e: any) {
          if (e.code === 'permission-denied') handleFirestoreError(e, OperationType.GET, 'analytics_daily');
          console.error("Dashboard fetch error", e);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-4xl font-bold tracking-tight text-white mb-8">Dashboard Overview</h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 backdrop-blur-[32px] border-[0.5px] border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <p className="text-white/60 text-sm font-medium mb-1">Total Blogs</p>
          <p className="text-4xl font-bold text-white tabular-nums tracking-tight">{totalBlogs}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-[32px] border-[0.5px] border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <p className="text-white/60 text-sm font-medium mb-1">Total Projects</p>
          <p className="text-4xl font-bold text-white tabular-nums tracking-tight">{totalProjects}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-[32px] border-[0.5px] border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <p className="text-white/60 text-sm font-medium mb-1">Total Views</p>
          <p className="text-4xl font-bold text-white tabular-nums tracking-tight">{totalViews}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-[32px] border-[0.5px] border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-pink-500/50 to-transparent"></div>
          <p className="text-white/60 text-sm font-medium mb-1">Website Likes</p>
          <p className="text-4xl font-bold text-pink-400 tabular-nums tracking-tight flex items-center gap-2">
            {totalLikes}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/5 backdrop-blur-[32px] border-[0.5px] border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] rounded-[2rem] p-8 relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <h3 className="text-xl font-medium text-white mb-6">Website Visitors (Last 7 Days)</h3>
          <div className="h-64 relative z-10 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitors}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" />
                <XAxis dataKey="name" stroke="#ffffff80" />
                <YAxis stroke="#ffffff80" allowDecimals={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '1rem', backdropFilter: 'blur(16px)' }} />
                <Line type="monotone" name="Visits" dataKey="pv" stroke="#8884d8" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-[32px] border-[0.5px] border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] rounded-[2rem] p-8 relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <h3 className="text-xl font-medium text-white mb-6">Top Locations</h3>
          <div className="h-64 relative z-10 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locations}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" />
                <XAxis dataKey="name" stroke="#ffffff80" />
                <YAxis stroke="#ffffff80" allowDecimals={false} />
                <RechartsTooltip cursor={{fill: '#ffffff1a'}} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '1rem', backdropFilter: 'blur(16px)' }} />
                <Bar dataKey="views" name="Views" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-[32px] border-[0.5px] border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] rounded-[2rem] p-8 relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <h3 className="text-xl font-medium text-white mb-6">Most Read Blogs</h3>
          <div className="space-y-4 relative z-10">
            {topBlogs.length > 0 ? topBlogs.map((blog, i) => (
              <div key={i} className="flex justify-between items-center text-sm border-[0.5px] border-white/10 p-4 rounded-2xl bg-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] hover:bg-white/10 transition cursor-default">
                <span className="text-white/80 font-medium truncate pr-4">{blog.title}</span>
                <span className="text-emerald-400/80 font-mono bg-emerald-400/10 px-3 py-1 rounded-full whitespace-nowrap">{blog.views} views</span>
              </div>
            )) : <span className="text-white/50 text-sm">No data yet.</span>}
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-[32px] border-[0.5px] border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] rounded-[2rem] p-8 relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <h3 className="text-xl font-medium text-white mb-6">Most Viewed Projects</h3>
          <div className="space-y-4 relative z-10">
            {topProjects.length > 0 ? topProjects.map((proj, i) => (
              <div key={i} className="flex justify-between items-center text-sm border-[0.5px] border-white/10 p-4 rounded-2xl bg-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] hover:bg-white/10 transition cursor-default">
                <span className="text-white/80 font-medium truncate pr-4">{proj.title}</span>
                <span className="text-blue-400/80 font-mono bg-blue-400/10 px-3 py-1 rounded-full whitespace-nowrap">{proj.views} views</span>
              </div>
            )) : <span className="text-white/50 text-sm">No data yet.</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminBlogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'blogs'));
      setBlogs(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch {
      try {
        const snap2 = await getDocs(collection(db, 'Blogs'));
        setBlogs(snap2.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;
    
    try {
      const result = await saveBlog(editingBlog);
      if (!result.success) throw result.error;
      setEditingBlog(null);
      setPreviewMode(false);
      fetchBlogs();
    } catch (error) {
      console.error(error);
      alert("Error saving blog");
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure?")) return;
    try {
      const result = await deleteBlog(id);
      if (!result.success) throw result.error;
      fetchBlogs();
    } catch (e) {
      alert("Error deleting blog");
    }
  }

  if (editingBlog) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => { setEditingBlog(null); setPreviewMode(false); }} className="bg-white/5 hover:bg-white/10 border-[0.5px] border-white/10 text-white px-4 py-2 rounded-xl transition flex items-center gap-2 text-sm">
            &larr; Back
          </button>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setPreviewMode(!previewMode)} className="bg-transparent border-[0.5px] border-white/10 text-white px-6 py-2 rounded-xl hover:bg-white/5 transition flex items-center gap-2 text-sm">
              {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {previewMode ? "Edit" : "Preview"}
            </button>
            <button onClick={handleSave} className="bg-white text-black px-6 py-2 rounded-xl font-semibold hover:opacity-90 transition flex items-center gap-2 text-sm">
              <Save className="w-4 h-4" /> Save changes
            </button>
          </div>
        </div>

        {!previewMode && (
          <h2 className="text-3xl font-bold tracking-tight text-white mb-6">
            {editingBlog.id ? 'Blog Editor' : 'New Blog'}
          </h2>
        )}

        {previewMode ? (
          <div className="bg-white/5 backdrop-blur-[32px] border-[0.5px] border-white/20 rounded-[2rem] p-4 md:p-8 min-h-[600px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
            <div className="w-full lg:w-[80%] mx-auto pb-10">
              <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-8">{editingBlog.title || editingBlog.name || 'Untitled Blog'}</h1>
              {(editingBlog.image || editingBlog.imgUrl || editingBlog.coverImage) && !imgError && (
                <img 
                  src={editingBlog.image || editingBlog.imgUrl || editingBlog.coverImage} 
                  alt={editingBlog.title || 'Blog cover'} 
                  className="w-full aspect-[21/9] object-cover rounded-2xl mb-12 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border-[0.5px] border-white/10"
                  onError={() => setImgError(true)}
                />
              )}
              <div className="prose prose-invert max-w-none text-white/80 leading-relaxed prose-p:my-4 prose-headings:mt-8 prose-headings:mb-4 prose-headings:font-medium prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-white prose-a:underline prose-img:rounded-2xl prose-ul:my-4 prose-li:my-1">
                {editingBlog.content || editingBlog.body || editingBlog.description ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{editingBlog.content || editingBlog.body || editingBlog.description}</ReactMarkdown>
                ) : (
                  "No content provided."
                )}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6 bg-white/5 backdrop-blur-[32px] border-[0.5px] border-white/20 p-8 rounded-[2rem] shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ModernInput label="TITLE" value={editingBlog.title || editingBlog.name || ''} onChange={val => setEditingBlog({...editingBlog, title: val, name: val})} required />
              <ModernInput label="SLUG" value={editingBlog.id || ''} onChange={val => setEditingBlog({...editingBlog, id: val})} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ModernInput label="CATEGORY" value={editingBlog.category || ''} onChange={val => setEditingBlog({...editingBlog, category: val})} required />
              <ModernInput label="COVER IMAGE URL" value={editingBlog.image || editingBlog.imgUrl || editingBlog.coverImage || ''} onChange={val => setEditingBlog({...editingBlog, image: val})} required />
            </div>

            <ModernTextarea label="EXCERPT / SUMMARY" value={editingBlog.description || editingBlog.summary || ''} onChange={val => setEditingBlog({...editingBlog, description: val, summary: val})} required rows={3} />
            
            <MarkdownEditor label="CONTENT" value={editingBlog.content || editingBlog.body || ''} onChange={val => setEditingBlog({...editingBlog, content: val, body: val})} required />

            <div className="flex items-center justify-end gap-4 pt-6 border-t-[0.5px] border-white/20">
              <button type="button" onClick={() => setEditingBlog(null)} className="text-white/50 hover:text-white px-6 py-3 font-medium transition">
                Cancel
              </button>
              <button type="submit" className="bg-white text-black font-bold rounded-xl px-8 py-3 hover:opacity-90 transition flex justify-center items-center gap-2">
                <Save className="w-4 h-4" /> SAVE CHANGES
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold tracking-tight text-white">Manage Blogs</h2>
        <button onClick={() => setEditingBlog({ title: '', content: '' })} className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          <Plus className="w-4 h-4" /> New Blog
        </button>
      </div>

      {loading ? <div className="py-10"><LoadingIndicator /></div> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {blogs.map(blog => (
            <ContentCard key={blog.id} item={blog} type="blog" isAdmin onEdit={setEditingBlog} onDelete={handleDelete} />
          ))}
          {blogs.length === 0 && <div className="col-span-full text-center text-white/50 py-16 bg-white/5 backdrop-blur-xl rounded-[2rem] border-[0.5px] border-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">No blogs found. Create one!</div>}
        </div>
      )}
    </div>
  );
}

function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'projects'));
      setProjects(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch {
      try {
        const snap2 = await getDocs(collection(db, 'Projects'));
        setProjects(snap2.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    
    try {
      const result = await saveProject(editingProject);
      if (!result.success) throw result.error;
      setEditingProject(null);
      setPreviewMode(false);
      fetchProjects();
    } catch (error) {
      console.error(error);
      alert("Error saving project");
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure?")) return;
    try {
      const result = await deleteProject(id);
      if (!result.success) throw result.error;
      fetchProjects();
    } catch (e) {
      alert("Error deleting project");
    }
  }

  if (editingProject) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => { setEditingProject(null); setPreviewMode(false); }} className="bg-white/5 hover:bg-white/10 border-[0.5px] border-white/10 text-white px-4 py-2 rounded-xl transition flex items-center gap-2 text-sm">
            &larr; Back
          </button>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setPreviewMode(!previewMode)} className="bg-transparent border-[0.5px] border-white/10 text-white px-6 py-2 rounded-xl hover:bg-white/5 transition flex items-center gap-2 text-sm">
              {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {previewMode ? "Edit" : "Preview"}
            </button>
            <button onClick={handleSave} className="bg-white text-black px-6 py-2 rounded-xl font-semibold hover:opacity-90 transition flex items-center gap-2 text-sm">
              <Save className="w-4 h-4" /> Save changes
            </button>
          </div>
        </div>

        {!previewMode && (
          <h2 className="text-3xl font-bold tracking-tight text-white mb-6">
            {editingProject.id ? 'Project Editor' : 'New Project'}
          </h2>
        )}

        {previewMode ? (
          <div className="bg-white/5 backdrop-blur-[32px] border-[0.5px] border-white/20 rounded-[2rem] p-4 md:p-8 min-h-[600px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
            <div className="w-full lg:w-[80%] mx-auto pb-10">
              <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-8">{editingProject.title || editingProject.name || 'Untitled Project'}</h1>
              {(editingProject.heroImage || editingProject.image || editingProject.imgUrl) && !imgError && (
                <img 
                  src={editingProject.heroImage || editingProject.image || editingProject.imgUrl} 
                  alt={editingProject.title || 'Project cover'} 
                  className="w-full aspect-[21/9] object-cover rounded-2xl mb-12 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border-[0.5px] border-white/10"
                  onError={() => setImgError(true)}
                />
              )}
              <div className="prose prose-invert max-w-none text-white/80 leading-relaxed prose-p:my-4 prose-headings:mt-8 prose-headings:mb-4 prose-headings:font-medium prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-white prose-a:underline prose-img:rounded-2xl prose-ul:my-4 prose-li:my-1 mb-10">
                {editingProject.content || editingProject.description || editingProject.body || editingProject.tech ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{editingProject.content || editingProject.description || editingProject.body || editingProject.tech}</ReactMarkdown>
                ) : (
                  "No description provided."
                )}
              </div>
              {(editingProject.link || editingProject.url || editingProject.liveUrl || editingProject.github) && (
                <a href={editingProject.link || editingProject.url || editingProject.liveUrl || editingProject.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white text-black font-semibold rounded-xl px-6 py-3 transition hover:opacity-90">
                  View Project <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-8 bg-white/5 backdrop-blur-[32px] border-[0.5px] border-white/20 p-8 rounded-[2rem] shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ModernInput label="TITLE" value={editingProject.title || editingProject.name || ''} onChange={val => setEditingProject({...editingProject, title: val, name: val})} required />
                <ModernInput label="SLUG (ID)" value={editingProject.id || ''} onChange={val => setEditingProject({...editingProject, id: val})} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ModernInput label="CATEGORY" value={editingProject.category || ''} onChange={val => setEditingProject({...editingProject, category: val})} required />
                <ModernInput label="YEAR" value={editingProject.year || ''} onChange={val => setEditingProject({...editingProject, year: val})} required />
                <ModernInput label="INDUSTRY" value={editingProject.industry || ''} onChange={val => setEditingProject({...editingProject, industry: val})} />
              </div>

              <ModernTextarea label="SUMMARY" value={editingProject.summary || editingProject.description || ''} onChange={val => setEditingProject({...editingProject, summary: val, description: val})} required rows={3} />
              
              <ModernInput label="HERO IMAGE URL" value={editingProject.heroImage || editingProject.image || editingProject.imgUrl || ''} onChange={val => setEditingProject({...editingProject, heroImage: val, image: val})} required />
            </div>

            <div className="space-y-6 pt-6 border-t-[0.5px] border-white/20">
              <h3 className="text-xs font-semibold tracking-wider text-white/50 uppercase ml-1">CASE STUDY</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ModernTextarea label="PROBLEM" value={editingProject.problem || ''} onChange={val => setEditingProject({...editingProject, problem: val})} required rows={6} />
                <ModernTextarea label="SOLUTION" value={editingProject.solution || ''} onChange={val => setEditingProject({...editingProject, solution: val})} required rows={6} />
              </div>
              <ModernTextarea label="CHALLENGE" value={editingProject.challenge || ''} onChange={val => setEditingProject({...editingProject, challenge: val})} rows={4} />
            </div>

            <div className="space-y-6 pt-6 border-t-[0.5px] border-white/20">
              <h3 className="text-xs font-semibold tracking-wider text-white/50 uppercase ml-1">DETAILS & LINKS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ModernInput label="CLIENT" value={editingProject.client || ''} onChange={val => setEditingProject({...editingProject, client: val})} />
                <ModernInput label="DURATION" value={editingProject.duration || ''} onChange={val => setEditingProject({...editingProject, duration: val})} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ModernInput label="GITHUB URL" value={editingProject.github || ''} onChange={val => setEditingProject({...editingProject, github: val})} placeholder="https://github.com/..." />
                <ModernInput label="LIVE URL" value={editingProject.link || editingProject.url || editingProject.liveUrl || ''} onChange={val => setEditingProject({...editingProject, link: val, liveUrl: val})} placeholder="https://..." />
              </div>

              <TagInput label="TECH STACK" tags={editingProject.techStack || (editingProject.tech ? editingProject.tech.split(',').map((t: string) => t.trim()) : [])} onChange={tags => setEditingProject({...editingProject, techStack: tags, tech: tags.join(', ')})} />
              
              <TagInput label="CONTENT IMAGES" tags={editingProject.contentImages || []} onChange={tags => setEditingProject({...editingProject, contentImages: tags})} placeholder="Add image URL and press Enter" />
              
              <MarkdownEditor label="CONTENT / DETAILS (Markdown)" value={editingProject.content || editingProject.body || ''} onChange={val => setEditingProject({...editingProject, content: val, body: val})} />
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t-[0.5px] border-white/20">
              <button type="button" onClick={() => setEditingProject(null)} className="text-white/50 hover:text-white px-6 py-3 font-medium transition">
                Cancel
              </button>
              <button type="submit" className="bg-white text-black font-bold rounded-xl px-8 py-3 hover:opacity-90 transition flex justify-center items-center gap-2">
                <Save className="w-4 h-4" /> SAVE CHANGES
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold tracking-tight text-white">Manage Projects</h2>
        <button onClick={() => setEditingProject({ title: '', content: '' })} className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {loading ? <div className="py-10"><LoadingIndicator /></div> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map(project => (
            <ContentCard key={project.id} item={project} type="project" isAdmin onEdit={setEditingProject} onDelete={handleDelete} />
          ))}
          {projects.length === 0 && <div className="col-span-full text-center text-white/50 py-16 bg-white/5 backdrop-blur-xl rounded-[2rem] border-[0.5px] border-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">No projects found. Create one!</div>}
        </div>
      )}
    </div>
  );
}

function AdminResume() {
  const [resumeUrl, setResumeUrl] = useState('');
  const [success, setSuccess] = useState(false);

  const fetchResume = async () => {
    try {
      // Fake getting the resume link. We could store it in a single doc collection 'settings'
      // If none, it's just dummy. Wait, let's actually store it in 'settings/resume'
      const docSnap = await getDocs(collection(db, 'settings'));
      const resumeDoc = docSnap.docs.find(d => d.id === 'resume');
      if (resumeDoc) {
        setResumeUrl(resumeDoc.data().url || '');
      }
    } catch(e) {
      console.error("Could not fetch resume link", e);
    }
  }

  useEffect(() => {
    fetchResume();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    try {
      await setDoc(doc(db, 'settings', 'resume'), { url: resumeUrl });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert("Error saving resume URL");
    }
  }

  return (
    <div>
      <h2 className="text-4xl font-bold tracking-tight text-white mb-8">Resume Settings</h2>
      <div className="bg-white/5 backdrop-blur-[32px] p-8 rounded-[2rem] border-[0.5px] border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] relative overflow-hidden max-w-xl group">
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        <div className="relative z-10">
          <p className="text-white/70 mb-6 font-medium leading-relaxed">Update your resume URL (like Google Drive, Dropbox, or a public bucket link) so visitors can view or download it.</p>
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm text-white/60 mb-2">Resume URL</label>
              <input 
                type="text" 
                placeholder="https://..." 
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                className="w-full bg-black/40 border-[0.5px] border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-white/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] transition"
                required
              />
            </div>
            <button type="submit" className="bg-white text-black font-semibold rounded-xl px-6 py-3.5 w-full hover:opacity-90 transition shadow-[0_0_20px_rgba(255,255,255,0.3)]">Save Resume Link</button>
            
            {success && <p className="text-emerald-400 font-medium text-sm mt-3 text-center bg-emerald-400/10 py-2 rounded-lg border border-emerald-400/20">Resume link updated successfully!</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
