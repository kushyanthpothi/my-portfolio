'use client';

import { useState, useCallback } from 'react';
import { FiPlay, FiCheckCircle, FiClock, FiLoader, FiDatabase, FiSearch, FiFileText, FiExternalLink, FiAlertCircle } from 'react-icons/fi';
import { IoSparkles } from 'react-icons/io5';
import { LuServer, LuCpu, LuGitBranch, LuBot } from 'react-icons/lu';
import { auth } from '@/lib/firebase';

const GH = 'https://api.github.com';

const PIPELINE_STEPS = [
    { id: 'checkout',  name: 'Checkout code',           icon: LuGitBranch, description: 'Clone repository using actions/checkout@v4' },
    { id: 'node',      name: 'Setup Node.js',            icon: LuCpu,       description: 'Initialize Node.js 24 with npm caching' },
    { id: 'install',   name: 'Install Dependencies',     icon: FiFileText,  description: 'Install packages with npm ci (clean install)' },
    { id: 'discover',  name: 'Discover Trending Topics', icon: FiSearch,    description: 'AI scans web for trending tech topics via Tavily + Groq' },
    { id: 'research',  name: 'Research & Write',         icon: LuBot,       description: 'Research → Analyze → Generate metadata → Write content per topic' },
    { id: 'save',      name: 'Persist to Firestore',     icon: FiDatabase,  description: 'Save lastRun timestamp, confirm articles are live' },
];

export default function AIAutoBlogger() {
    const [status, setStatus]     = useState('idle');   // idle | triggering | success | error
    const [runUrl, setRunUrl]     = useState(null);
    const [runNumber, setRunNumber] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const handleRunNow = useCallback(async () => {
        if (status === 'triggering') return;

        const workflow = 'daily-blog.yml';

        setStatus('triggering');
        setRunUrl(null);
        setRunNumber(null);
        setErrorMsg('');

        let idToken = '';
        try {
            if (auth.currentUser) {
                idToken = await auth.currentUser.getIdToken();
            }
        } catch (e) {
            console.error('Failed to get auth token', e);
        }

        const headers = {
            Authorization: `Bearer ${idToken}`,
            'Content-Type': 'application/json'
        };

        try {
            // 1. Dispatch the workflow via our secure server route
            const dispatchRes = await fetch('/api/github/dispatch', {
                method: 'POST',
                headers,
                body: JSON.stringify({ workflow, ref: 'main' }),
            });

            const dispatchData = await dispatchRes.json();
            if (!dispatchRes.ok || !dispatchData.success) {
                throw new Error(`Dispatch failed: ${dispatchData.error}`);
            }

            // 2. Poll until the new run appears via our secure server route
            await new Promise(r => setTimeout(r, 4000));

            let run = null;
            let repoOwner = '';
            let repoName = '';
            
            for (let i = 0; i < 20; i++) {
                for (const st of ['queued', 'in_progress', '']) {
                    const qs = st ? `&status=${st}` : '';
                    const res = await fetch(`/api/github/runs?workflow=${workflow}${qs}`, { headers });
                    
                    if (!res.ok) continue;
                    
                    const data = await res.json();
                    if (!data.success) continue;
                    
                    repoOwner = data.owner;
                    repoName = data.repo;
                    
                    const { workflow_runs } = data;
                    if (!workflow_runs?.length) continue;
                    
                    const latest = workflow_runs[0];
                    // Accept runs created within the last 2 minutes
                    if (Date.now() - new Date(latest.created_at).getTime() < 120_000) {
                        run = latest;
                        break;
                    }
                }
                if (run) break;
                await new Promise(r => setTimeout(r, 2000));
            }

            if (run) {
                setRunUrl(run.html_url);
                setRunNumber(run.run_number);
                setStatus('success');
            } else {
                // Dispatch succeeded but couldn't find the run in time — still okay
                setRunUrl(repoOwner && repoName ? `https://github.com/${repoOwner}/${repoName}/actions` : '#');
                setRunNumber(null);
                setStatus('success');
            }
        } catch (err) {
            setErrorMsg(err.message);
            setStatus('error');
        }
    }, [status]);

    const isTriggering = status === 'triggering';

    return (
        <div style={{ padding: '1.5rem', maxWidth: 1400, margin: '0 auto' }}>
            {/* Header */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem',
            }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <IoSparkles style={{ color: '#fbbf24' }} />
                        AI Blog Generator
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
                        Automated pipeline — discovers, researches, and writes 5 tech articles daily via GitHub Actions
                    </p>
                </div>

                <button
                    onClick={handleRunNow}
                    disabled={isTriggering}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.6rem 1.4rem',
                        background: isTriggering ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                        color: isTriggering ? '#6b7280' : '#000',
                        border: 'none', borderRadius: '10px',
                        fontWeight: 600, fontSize: '0.875rem',
                        cursor: isTriggering ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                >
                    {isTriggering
                        ? <><FiLoader className="pipeline-spin" style={{ fontSize: '14px' }} /> Triggering…</>
                        : <><FiPlay style={{ fontSize: '14px' }} /> Run Now</>
                    }
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* LEFT — Pipeline info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Config card */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(251,191,36,0.05), rgba(139,92,246,0.03))',
                        border: '1px solid rgba(251,191,36,0.12)',
                        borderRadius: '16px', padding: '1.25rem',
                    }}>
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 600, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <LuServer style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                            Pipeline Config
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem 1.5rem' }}>
                            {[
                                ['Schedule', 'cron 30 15 * * *'],
                                ['Runtime',  'Node 24 / ubuntu-latest'],
                                ['AI Model', 'llama-3.3-70b (Groq)'],
                                ['Search',   'Tavily API (basic)'],
                                ['Database', 'Firebase Firestore'],
                                ['Output',   '5 articles / day'],
                            ].map(([k, v]) => (
                                <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                    <span style={{ color: '#6b7280', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k}</span>
                                    <span style={{ color: '#e5e7eb', fontSize: '0.82rem', fontFamily: 'monospace' }}>{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pipeline steps */}
                    <div style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '16px', padding: '1.25rem', flex: 1,
                    }}>
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 600, color: '#9ca3af' }}>
                            Pipeline Steps
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            {PIPELINE_STEPS.map((step) => {
                                const Icon = step.icon;
                                return (
                                    <div key={step.id} style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                                        padding: '0.65rem 0.85rem', borderRadius: '10px',
                                        border: '1px solid rgba(255,255,255,0.04)',
                                    }}>
                                        <div style={{
                                            width: '28px', height: '28px', borderRadius: '8px', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                            background: 'rgba(255,255,255,0.05)',
                                        }}>
                                            <Icon style={{ color: '#6b7280', fontSize: '14px' }} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ color: '#9ca3af', fontSize: '0.82rem', fontWeight: 500 }}>{step.name}</div>
                                            <div style={{ color: '#4b5563', fontSize: '0.72rem' }}>{step.description}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* RIGHT — Status card */}
                <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '16px', padding: '1.5rem',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    minHeight: '320px', gap: '1.25rem', textAlign: 'center',
                }}>
                    {status === 'idle' && (
                        <>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '20px',
                                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <FiClock style={{ fontSize: '28px', color: '#4b5563' }} />
                            </div>
                            <div>
                                <div style={{ color: '#6b7280', fontSize: '0.95rem', fontWeight: 500 }}>Ready to run</div>
                                <div style={{ color: '#374151', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                                    Click <strong style={{ color: '#6b7280' }}>"Run Now"</strong> to trigger the pipeline,<br />
                                    or wait for the daily cron at 21:00 UTC.
                                </div>
                            </div>
                        </>
                    )}

                    {status === 'triggering' && (
                        <>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '20px',
                                background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <FiLoader className="pipeline-spin" style={{ fontSize: '28px', color: '#fbbf24' }} />
                            </div>
                            <div>
                                <div style={{ color: '#fbbf24', fontSize: '0.95rem', fontWeight: 600 }}>Triggering workflow…</div>
                                <div style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                                    Dispatching to GitHub Actions and waiting for the runner to pick it up.
                                </div>
                            </div>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '20px',
                                background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <FiCheckCircle style={{ fontSize: '28px', color: '#34d399' }} />
                            </div>
                            <div>
                                <div style={{ color: '#34d399', fontSize: '1rem', fontWeight: 700 }}>
                                    Triggered Successfully!
                                </div>
                                <div style={{ color: '#6b7280', fontSize: '0.82rem', marginTop: '0.4rem' }}>
                                    {runNumber
                                        ? `Run #${runNumber} is now queued on GitHub Actions.`
                                        : 'Workflow dispatched to GitHub Actions.'}
                                </div>
                            </div>
                            <a
                                href={runUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.55rem 1.25rem',
                                    background: 'rgba(52,211,153,0.1)',
                                    border: '1px solid rgba(52,211,153,0.3)',
                                    borderRadius: '10px',
                                    color: '#34d399', fontWeight: 600, fontSize: '0.85rem',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.18)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.1)'; }}
                            >
                                <FiExternalLink style={{ fontSize: '14px' }} />
                                {runNumber ? `View Run #${runNumber} on GitHub` : 'View on GitHub Actions'}
                            </a>

                            {/* Run again */}
                            <button
                                onClick={handleRunNow}
                                style={{
                                    background: 'transparent', border: 'none',
                                    color: '#4b5563', fontSize: '0.78rem',
                                    cursor: 'pointer', textDecoration: 'underline',
                                }}
                            >
                                Trigger again
                            </button>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '20px',
                                background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <FiAlertCircle style={{ fontSize: '28px', color: '#f87171' }} />
                            </div>
                            <div>
                                <div style={{ color: '#f87171', fontSize: '0.95rem', fontWeight: 600 }}>Trigger Failed</div>
                                <div style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.4rem', maxWidth: '280px' }}>
                                    {errorMsg}
                                </div>
                            </div>
                            <button
                                onClick={handleRunNow}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.5rem 1.2rem',
                                    background: 'rgba(248,113,113,0.1)',
                                    border: '1px solid rgba(248,113,113,0.25)',
                                    borderRadius: '10px',
                                    color: '#f87171', fontWeight: 600, fontSize: '0.82rem',
                                    cursor: 'pointer',
                                }}
                            >
                                <FiPlay style={{ fontSize: '13px' }} /> Retry
                            </button>
                        </>
                    )}
                </div>
            </div>

            <style jsx global>{`
                .pipeline-spin {
                    animation: pipeline-spin 1s linear infinite;
                }
                @keyframes pipeline-spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
