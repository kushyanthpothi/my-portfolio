import React, { useState } from 'react';
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, Quote, Code, Link as LinkIcon, Image as ImageIcon, Minus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function MarkdownEditor({ value, onChange, label = "CONTENT", required = false }: { value: string, onChange: (val: string) => void, label?: string, required?: boolean }) {
  const [viewMd, setViewMd] = useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = '') => {
    setViewMd(false);
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      const newText = value.substring(0, start) + before + (selectedText || (after ? 'text' : '')) + after + value.substring(end);
      onChange(newText);
      setTimeout(() => {
        textarea.focus();
        const selectionLen = (selectedText || (after ? 'text' : '')).length;
        textarea.setSelectionRange(start + before.length, start + before.length + selectionLen);
      }, 0);
    } else {
      onChange(value + before + (after ? 'text' : '') + after);
    }
  };

  return (
    <div className="flex flex-col border-[0.5px] border-white/20 rounded-xl overflow-hidden bg-white/5 backdrop-blur-[32px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
      <div className="flex items-center justify-between px-4 py-2 border-b-[0.5px] border-white/20 bg-white/5">
        <label className="text-xs font-semibold tracking-wider text-white/50 uppercase">{label} {required && <span className="text-red-500">*</span>}</label>
        
        <div className="flex items-center gap-4 text-white/50">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => insertText('# ')} className="text-xs hover:text-white transition font-medium">H1</button>
            <button type="button" onClick={() => insertText('## ')} className="text-xs hover:text-white transition font-medium">H2</button>
            <button type="button" onClick={() => insertText('### ')} className="text-xs hover:text-white transition font-medium">H3</button>
            <button type="button" onClick={() => insertText('**', '**')} className="hover:text-white transition"><Bold className="w-3 h-3" /></button>
            <button type="button" onClick={() => insertText('_', '_')} className="hover:text-white transition"><Italic className="w-3 h-3" /></button>
            <button type="button" onClick={() => insertText('~~', '~~')} className="hover:text-white transition"><Strikethrough className="w-3 h-3" /></button>
            <button type="button" onClick={() => insertText('- ')} className="hover:text-white transition flex items-center gap-1 text-xs"><List className="w-3 h-3" /> List</button>
            <button type="button" onClick={() => insertText('1. ')} className="hover:text-white transition flex items-center gap-1 text-xs"><ListOrdered className="w-3 h-3" /> 1. List</button>
            <button type="button" onClick={() => insertText('> ')} className="hover:text-white transition"><Quote className="w-3 h-3" /></button>
            <button type="button" onClick={() => insertText('```\n', '\n```')} className="hover:text-white transition"><Code className="w-3 h-3" /></button>
            <button type="button" onClick={() => insertText('[', '](url)')} className="hover:text-white transition"><LinkIcon className="w-3 h-3" /></button>
            <button type="button" onClick={() => insertText('![', '](url)')} className="hover:text-white transition"><ImageIcon className="w-3 h-3" /></button>
            <button type="button" onClick={() => insertText('\n---\n')} className="hover:text-white transition"><Minus className="w-3 h-3" /></button>
          </div>
          <div className="flex bg-white/10 p-0.5 rounded-lg ml-4">
            <button type="button" onClick={() => setViewMd(false)} className={`text-xs px-3 py-1 font-medium rounded-md transition ${!viewMd ? 'bg-white/20 text-white shadow' : 'text-white/50 hover:text-white'}`}>Write</button>
            <button type="button" onClick={() => setViewMd(true)} className={`text-xs px-3 py-1 font-medium rounded-md transition ${viewMd ? 'bg-white/20 text-white shadow' : 'text-white/50 hover:text-white'}`}>Preview</button>
          </div>
        </div>
      </div>
      
      {viewMd ? (
        <div className="p-4 min-h-[300px] text-white/80 prose prose-invert max-w-none leading-relaxed prose-p:my-4 prose-headings:mt-8 prose-headings:mb-4 prose-headings:font-medium prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-white prose-a:underline prose-img:rounded-2xl prose-ul:my-4 prose-li:my-1">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{value || 'Nothing to preview'}</ReactMarkdown>
        </div>
      ) : (
        <textarea 
          ref={textareaRef}
          value={value} 
          onChange={e => onChange(e.target.value)} 
          className="w-full bg-transparent px-4 py-4 text-white outline-none resize-y min-h-[300px] placeholder:text-white/20"
          placeholder="Start writing..."
          required={required}
        />
      )}
    </div>
  );
}

export function ModernInput({ label, value, onChange, required = false, type = "text", placeholder = "" }: { label: string, value: string, onChange: (val: string) => void, required?: boolean, type?: string, placeholder?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold tracking-wider text-white/50 uppercase ml-1">{label} {required && <span className="text-red-500">*</span>}</label>
      <input 
        type={type} 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder}
        className="w-full bg-white/5 backdrop-blur-[32px] border-[0.5px] border-white/20 rounded-xl px-4 py-3.5 text-white outline-none focus:border-white/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] transition placeholder:text-white/20" 
        required={required} 
      />
    </div>
  );
}

export function ModernTextarea({ label, value, onChange, required = false, rows = 3, placeholder = "" }: { label: string, value: string, onChange: (val: string) => void, required?: boolean, rows?: number, placeholder?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold tracking-wider text-white/50 uppercase ml-1">{label} {required && <span className="text-red-500">*</span>}</label>
      <textarea 
        rows={rows} 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder}
        className="w-full bg-white/5 backdrop-blur-[32px] border-[0.5px] border-white/20 rounded-xl px-4 py-3.5 text-white outline-none focus:border-white/40 resize-none shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] transition placeholder:text-white/20" 
        required={required} 
      ></textarea>
    </div>
  );
}

export function TagInput({ label, tags, onChange, placeholder = "Type and press Enter" }: { label: string, tags: string[], onChange: (tags: string[]) => void, placeholder?: string }) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (input.trim() && !tags.includes(input.trim())) {
        onChange([...tags, input.trim()]);
        setInput('');
      }
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold tracking-wider text-white/50 uppercase ml-1">{label}</label>
      <div className="w-full bg-white/5 backdrop-blur-[32px] border-[0.5px] border-white/20 rounded-xl p-2 flex flex-wrap gap-2 items-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] transition focus-within:border-white/40">
        {tags.map((tag, index) => (
          <div key={index} className="flex items-center gap-1.5 bg-white/10 text-white border border-white/20 px-2.5 py-1 rounded-lg text-sm">
            <span>{tag}</span>
            <button type="button" onClick={() => removeTag(index)} className="hover:text-white/60">&times;</button>
          </div>
        ))}
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : "Add more..."}
          className="flex-1 bg-transparent border-none outline-none text-white px-2 py-1.5 text-sm placeholder:text-white/30 min-w-[120px]"
        />
      </div>
    </div>
  );
}
