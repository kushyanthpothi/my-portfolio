import { useState } from 'react';
import { ArrowUpRight, Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { KPLogo } from './KPLogo';

interface ContentCardProps {
  item: any;
  type: 'blog' | 'project';
  isAdmin?: boolean;
  onEdit?: (item: any) => void;
  onDelete?: (id: string) => void;
}

export function ContentCard({ item, type, isAdmin, onEdit, onDelete }: ContentCardProps) {
  const [imgError, setImgError] = useState(false);

  // v2 Firestore canonical fields: projects use `heroImage`, blogs use `coverImage`
  const imgUrl = item.heroImage || item.coverImage || item.image || item.imgUrl || item.thumbnail || item.imageUrl || item.pic;

  const isBlog = type === 'blog';
  const title = item.title || item.name || (isBlog ? 'Untitled Blog' : 'Untitled Project');
  // Projects: prefer summary over content; blogs: prefer description over summary
  const description = isBlog
    ? item.description || item.summary || item.content || item.excerpt || 'No description provided.'
    : item.summary || item.description || item.content || item.tech || item.skills || 'No description provided.';
  const category = item.category || (isBlog ? 'Software Development' : 'Artificial Intelligence');
  const date = item.date || 'June 25, 2026';
  
  const linkPath = isBlog ? `/blogs/${item.id}` : `/projects/${item.id || 'placeholder'}`;
  
  const CardContent = (
    <>
      <div className="w-full h-64 sm:h-[280px] bg-white/5 relative overflow-hidden flex items-center justify-center">
        {imgUrl && !imgError ? (
          <img src={imgUrl} alt={title} onError={() => setImgError(true)} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        ) : (
          <KPLogo className="w-16 h-16 text-white/20 group-hover:scale-110 transition duration-500" />
        )}
      </div>
      <div className="p-6 sm:p-8 flex flex-col flex-1">
        <div className="flex items-center gap-4 mb-6">
          <span 
            className="border px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium tracking-wide theme-accent-border theme-accent-text transition-colors duration-300"
          >
            {category}
          </span>
          <span className="text-white/50 text-sm">
            {date}
          </span>
        </div>
        <h3 className="text-2xl sm:text-[28px] font-bold uppercase mb-4 text-white leading-[1.1] line-clamp-3 font-sans tracking-tight">
          {title}
        </h3>
        <p className="text-white/60 line-clamp-3 leading-relaxed text-base mb-6">
          {description}
        </p>

        {isAdmin && (
          <div className="mt-auto flex gap-3 pt-6 border-t border-white/10">
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit?.(item); }} 
              className="flex-1 py-3 bg-white/10 rounded-xl hover:bg-white/20 text-white transition font-medium text-sm flex items-center justify-center gap-2"
            >
              <Edit2 className="w-4 h-4" /> Edit
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete?.(item.id); }} 
              className="flex-1 py-3 bg-red-500/10 rounded-xl hover:bg-red-500/20 text-red-400 transition font-medium text-sm flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        )}
      </div>
    </>
  );

  const cardClasses = "bg-white/5 backdrop-blur-md border border-white/10 rounded-[20px] overflow-hidden hover:bg-white/10 transition flex flex-col group relative h-full";

  if (isAdmin) {
    return (
      <div className={cardClasses}>
        {CardContent}
      </div>
    );
  }

  return (
    <Link to={linkPath} className={`${cardClasses} cursor-pointer`}>
      {CardContent}
    </Link>
  );
}
