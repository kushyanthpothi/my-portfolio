'use client';

import { FiEdit2, FiTrash2, FiCpu, FiCalendar } from 'react-icons/fi';

function CardCSS() {
    return (
        <style jsx global>{`
            .content-card {
                transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .content-card:hover {
                transform: translateY(-6px);
                border-color: rgba(255, 215, 0, 0.4) !important;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 215, 0, 0.1);
            }
            .content-card:hover .card-image {
                transform: scale(1.05);
            }
            .card-image {
                transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .card-actions-overlay {
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .content-card:hover .card-actions-overlay {
                opacity: 1 !important;
            }
        `}</style>
    );
}

function Badge({ children, position = 'top-right', variant = 'default' }) {
    const positions = {
        'top-right': { top: '12px', right: '12px', bottom: 'auto', left: 'auto' },
        'bottom-left': { bottom: '12px', left: '12px', top: 'auto', right: 'auto' },
    };
    const variantStyles = {
        'ai': {
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 215, 0, 0.05))',
            color: '#FFD700',
            border: '1px solid rgba(255, 215, 0, 0.25)',
        },
        'category': {
            background: '#1a2035',
            color: '#fff',
        },
    };
    const vs = variantStyles[variant] || variantStyles.category;

    return (
        <div style={{
            position: 'absolute',
            ...positions[position],
            padding: variant === 'ai' ? '6px 14px' : '5px 12px',
            borderRadius: '100px',
            fontSize: '0.7rem',
            fontWeight: variant === 'ai' ? '700' : '600',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: variant === 'ai' ? '5px' : '0',
            zIndex: 11,
            ...vs,
        }}>
            {variant === 'ai' && <FiCpu size={13} />}
            {children}
        </div>
    );
}

// Dashboard-style card (exact same design as Latest Blogs / Latest Projects in Dashboard)
export function ContentCard({
    imageUrl,
    imageHeight = '200px',
    cardHeight = '380px',
    isAI,
    badge,
    title,
    metaDate,
    metaLabel,
    onEdit,
    onDelete,
    cardWidth,
}) {
    return (
        <>
            <CardCSS />
            <div className="content-card" style={{
                ...(cardWidth ? { flex: `0 0 ${cardWidth}` } : { width: '100%' }),
                height: cardHeight,
                background: '#161b22', /* Solid color for performance, matching Dashboard */
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
            }}>
                {/* Image Section */}
                <div style={{ width: '100%', height: imageHeight, overflow: 'hidden', position: 'relative' }}>
                    <div
                        className="card-image"
                        style={{
                            width: '100%', height: '100%',
                            background: `url(${imageUrl}) center/cover`,
                            backgroundColor: '#1a1a2e',
                        }}
                    />
                    {/* Bottom Fade */}
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px',
                        background: 'radial-gradient(ellipse at center bottom, rgba(10, 10, 15, 0.8) 0%, transparent 70%)',
                    }} />
                    {/* Hover Edit/Delete Overlay */}
                    <div className="card-actions-overlay" style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '12px', zIndex: 10,
                    }}>
                        {onEdit && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    border: '1px solid rgba(255, 255, 255, 0.4)',
                                    borderRadius: '50%', width: '44px', height: '44px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                                title="Edit"
                            >
                                <FiEdit2 size={18} />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
                                style={{
                                    background: 'rgba(255, 68, 68, 0.3)',
                                    border: '1px solid rgba(255, 68, 68, 0.5)',
                                    borderRadius: '50%', width: '44px', height: '44px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#ff4444', cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                                title="Delete"
                            >
                                <FiTrash2 size={18} />
                            </button>
                        )}
                    </div>
                    {/* Badges */}
                    {isAI && <Badge position="top-right" variant="ai">AI</Badge>}
                    {badge && !isAI && <Badge position="bottom-left" variant="category">{badge}</Badge>}
                </div>
                {/* Content Section */}
                <div style={{
                    padding: '1.25rem 1.25rem 1rem',
                    display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1,
                }}>
                    <h4 style={{
                        color: '#fff', fontSize: '1rem', fontWeight: '600', lineHeight: '1.4',
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        overflow: 'hidden', margin: 0,
                    }}>
                        {title}
                    </h4>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        color: '#6B7280', fontSize: '0.8rem', marginTop: 'auto',
                    }}>
                        {metaDate && <><FiCalendar size={13} /><span>{metaDate}</span></>}
                        {metaLabel && <span style={{ marginLeft: metaDate ? 'auto' : 'auto' }}>{metaLabel}</span>}
                    </div>
                </div>
            </div>
        </>
    );
}
