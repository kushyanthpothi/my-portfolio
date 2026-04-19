'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import styles from '../admin.module.css';

// ─── Markdown → HTML (seed the contentEditable on load) ──────────────────────
function mdToHtml(md) {
    if (!md || typeof md !== 'string') return '';

    let h = md
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Fenced code blocks (before inline code)
    h = h.replace(/```[\w]*\n?([\s\S]*?)```/g, (_, c) =>
        `<pre><code>${c.trim()}</code></pre>`);
    // HR
    h = h.replace(/^---$/gm, '<hr/>');
    // Headings
    h = h.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    h = h.replace(/^## (.+)$/gm,  '<h2>$1</h2>');
    h = h.replace(/^# (.+)$/gm,   '<h1>$1</h1>');
    // Blockquote (after &gt; escaping)
    h = h.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
    // Lists
    h = h.replace(/((?:^- .+\n?)+)/gm, blk => {
        const items = blk.trim().split('\n').map(l => `<li>${l.slice(2)}</li>`).join('');
        return `<ul>${items}</ul>`;
    });
    h = h.replace(/((?:^\d+\. .+\n?)+)/gm, blk => {
        const items = blk.trim().split('\n').map(l => `<li>${l.replace(/^\d+\. /, '')}</li>`).join('');
        return `<ol>${items}</ol>`;
    });
    // Images before links
    h = h.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1"/>');
    h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g,  '<a href="$2">$1</a>');
    // Inline formatting
    h = h.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    h = h.replace(/\*\*(.+?)\*\*/g,  '<strong>$1</strong>');
    h = h.replace(/__(.+?)__/g,       '<strong>$1</strong>');
    h = h.replace(/\*(.+?)\*/g,       '<em>$1</em>');
    h = h.replace(/_(.+?)_/g,         '<em>$1</em>');
    h = h.replace(/~~(.+?)~~/g,       '<s>$1</s>');
    h = h.replace(/\+\+(.+?)\+\+/g,  '<u>$1</u>');
    h = h.replace(/`([^`]+)`/g,       '<code>$1</code>');
    // Paragraphs
    return h.split('\n').map(line => {
        const isBlock = /^<(h[1-6]|ul|ol|pre|blockquote|hr|img)/.test(line) || line.trim() === '';
        return isBlock ? line : `<p>${line}</p>`;
    }).join('');
}

// ─── DOM Node → Markdown ──────────────────────────────────────────────────────
function nodeToMd(node) {
    if (node.nodeType === 3) return node.textContent; // text
    if (node.nodeType !== 1) return '';               // not element

    const tag   = node.tagName.toLowerCase();
    const inner = Array.from(node.childNodes).map(nodeToMd).join('');

    switch (tag) {
        case 'b':
        case 'strong':    return `**${inner}**`;
        case 'i':
        case 'em':        return `*${inner}*`;
        case 'u':         return `++${inner}++`;
        case 's':
        case 'strike':
        case 'del':       return `~~${inner}~~`;
        case 'code':
            return node.parentElement?.tagName.toLowerCase() === 'pre'
                ? inner
                : `\`${inner}\``;
        case 'pre':       return `\`\`\`\n${inner}\n\`\`\`\n\n`;
        case 'h1':        return `# ${inner}\n\n`;
        case 'h2':        return `## ${inner}\n\n`;
        case 'h3':        return `### ${inner}\n\n`;
        case 'p':         return `${inner}\n\n`;
        case 'div':       return inner.trim() ? `${inner}\n` : '\n';
        case 'br':        return '\n';
        case 'a':         return `[${inner}](${node.getAttribute('href') || ''})`;
        case 'img':       return `![${node.getAttribute('alt') || ''}](${node.getAttribute('src') || ''})`;
        case 'ul': {
            const items = Array.from(node.querySelectorAll(':scope > li'))
                .map(li => `- ${nodeToMd(li)}`).join('\n');
            return `${items}\n\n`;
        }
        case 'ol': {
            const items = Array.from(node.querySelectorAll(':scope > li'))
                .map((li, i) => `${i + 1}. ${nodeToMd(li)}`).join('\n');
            return `${items}\n\n`;
        }
        case 'li':        return inner;
        case 'blockquote': return `> ${inner}\n\n`;
        case 'hr':        return `---\n\n`;
        default:          return inner;
    }
}

function htmlToMd(html) {
    if (typeof document === 'undefined' || !html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return nodeToMd(div).replace(/\n{3,}/g, '\n\n').trim();
}

// ─── Toolbar definition ───────────────────────────────────────────────────────
const TOOLBAR = [
    { id: 'h1',    label: 'H1',      title: 'Heading 1',      cmd: 'formatBlock', val: 'h1' },
    { id: 'h2',    label: 'H2',      title: 'Heading 2',      cmd: 'formatBlock', val: 'h2' },
    { id: 'h3',    label: 'H3',      title: 'Heading 3',      cmd: 'formatBlock', val: 'h3' },
    { id: 'd1' },
    { id: 'bold',  label: 'B',       title: 'Bold (⌘B)',       cmd: 'bold',  style: { fontWeight: 700 } },
    { id: 'italic',label: 'I',       title: 'Italic (⌘I)',     cmd: 'italic', style: { fontStyle: 'italic' } },
    { id: 'under', label: 'U',       title: 'Underline (⌘U)', cmd: 'underline', style: { textDecoration: 'underline' } },
    { id: 'strike',label: 'S',       title: 'Strikethrough',  cmd: 'strikeThrough', style: { textDecoration: 'line-through' } },
    { id: 'd2' },
    { id: 'ul',    label: '• List',  title: 'Bullet list',    cmd: 'insertUnorderedList' },
    { id: 'ol',    label: '1. List', title: 'Numbered list',  cmd: 'insertOrderedList' },
    { id: 'quote', label: '❝',       title: 'Blockquote',     cmd: 'formatBlock', val: 'blockquote' },
    { id: 'd3' },
    { id: 'code',  label: '</>',     title: 'Inline code',    type: 'code' },
    { id: 'link',  label: '🔗',      title: 'Link (⌘K)',       type: 'link' },
    { id: 'img',   label: '🖼',      title: 'Image',          type: 'img' },
    { id: 'hr',    label: '—',       title: 'Horizontal rule', type: 'hr' },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function MarkdownEditor({ value = '', onChange, placeholder = 'Start writing...', required }) {
    const editorRef  = useRef(null);
    const lastMdRef  = useRef(value);
    const [showMd, setShowMd] = useState(false);

    // Disable inline styles from execCommand (prevents `font-weight: bold` spans)
    useEffect(() => {
        try { document.execCommand('styleWithCSS', false, false); } catch (_) {}
    }, []);

    // Seed the editor on first mount
    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = mdToHtml(value);
            lastMdRef.current = value;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // When value changes externally (AI generation, editing a saved blog), re-seed
    useEffect(() => {
        if (editorRef.current && value !== lastMdRef.current) {
            editorRef.current.innerHTML = mdToHtml(value);
            lastMdRef.current = value;
        }
    }, [value]);

    // Read editor HTML → convert to markdown → push up
    const syncMd = useCallback(() => {
        if (!editorRef.current) return;
        const md = htmlToMd(editorRef.current.innerHTML);
        lastMdRef.current = md;
        onChange({ target: { name: 'content', value: md } });
    }, [onChange]);

    // Toolbar action handler
    const runAction = useCallback((item) => {
        const editor = editorRef.current;
        if (!editor) return;
        editor.focus();

        if (item.cmd) {
            if (item.val) {
                // Toggle headings/blockquote: if already that format, revert to p
                const current = document.queryCommandValue('formatBlock').toLowerCase();
                document.execCommand('formatBlock', false, current === item.val ? 'p' : item.val);
            } else {
                document.execCommand(item.cmd, false, null);
            }
            syncMd();
            return;
        }

        if (item.type === 'code') {
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
                const range = sel.getRangeAt(0);
                const code  = document.createElement('code');
                try { range.surroundContents(code); } catch (_) {}
                syncMd();
            }
            return;
        }

        if (item.type === 'link') {
            const sel = window.getSelection();
            const text = sel?.toString() || '';
            const url  = window.prompt('Enter URL:', 'https://');
            if (url) {
                if (text) {
                    document.execCommand('createLink', false, url);
                } else {
                    document.execCommand('insertHTML', false,
                        `<a href="${url}">${url}</a>`);
                }
                syncMd();
            }
            return;
        }

        if (item.type === 'img') {
            const alt = window.prompt('Image alt text:', 'image') || 'image';
            const src = window.prompt('Image URL:', 'https://');
            if (src) {
                document.execCommand('insertHTML', false,
                    `<img src="${src}" alt="${alt}" style="max-width:100%;border-radius:8px;margin:8px 0;display:block;"/>`);
                syncMd();
            }
            return;
        }

        if (item.type === 'hr') {
            document.execCommand('insertHTML', false, '<hr/>');
            syncMd();
        }
    }, [syncMd]);

    const handleKeyDown = useCallback((e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'b': e.preventDefault(); runAction({ cmd: 'bold' });      break;
                case 'i': e.preventDefault(); runAction({ cmd: 'italic' });    break;
                case 'u': e.preventDefault(); runAction({ cmd: 'underline' }); break;
                case 'k': e.preventDefault(); runAction({ type: 'link' });     break;
                default: break;
            }
        }
    }, [runAction]);

    return (
        <div className={styles.mdEditor}>
            {/* Toolbar */}
            <div className={styles.mdToolbar}>
                <div className={styles.mdToolbarLeft}>
                    {TOOLBAR.map(item => {
                        if (item.id.startsWith('d')) {
                            return <div key={item.id} className={styles.mdToolbarDivider} />;
                        }
                        return (
                            <button
                                key={item.id}
                                type="button"
                                title={item.title}
                                style={item.style}
                                className={styles.mdToolbarBtn}
                                onMouseDown={e => { e.preventDefault(); runAction(item); }}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </div>
                <button
                    type="button"
                    className={`${styles.mdModeBtn} ${showMd ? styles.mdModeBtnActive : ''}`}
                    onClick={() => setShowMd(v => !v)}
                    title="View raw markdown"
                >
                    {showMd ? 'Hide MD' : 'View MD'}
                </button>
            </div>

            {/* WYSIWYG editing area — always mounted to preserve content */}
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className={styles.mdWysiwyg}
                onInput={syncMd}
                onKeyDown={handleKeyDown}
                data-placeholder={placeholder}
                style={{ display: showMd ? 'none' : undefined }}
            />

            {/* Raw markdown view — always mounted, hidden when not needed */}
            <pre
                className={styles.mdRawView}
                style={{ display: showMd ? undefined : 'none' }}
            >{value}</pre>

            {/* Hidden field so native form validation still works */}
            {required && (
                <input
                    type="text"
                    value={value}
                    required
                    tabIndex={-1}
                    readOnly
                    aria-hidden="true"
                    style={{ opacity: 0, height: 0, position: 'absolute', pointerEvents: 'none' }}
                />
            )}
        </div>
    );
}
