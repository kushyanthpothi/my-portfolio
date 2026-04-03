'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { FiPlay, FiCheckCircle, FiClock, FiLoader, FiDatabase, FiSearch, FiFileText } from 'react-icons/fi';
import { IoSparkles } from 'react-icons/io5';
import { LuServer, LuCpu, LuTerminal, LuGitBranch, LuBot } from 'react-icons/lu';

const GH = 'https://api.github.com';
const LOG_INTERVAL = 3000;

const PIPELINE_STEPS = [
    { id: 'checkout', name: 'Checkout code', icon: LuGitBranch, description: 'Clone repository using actions/checkout@v4' },
    { id: 'node', name: 'Setup Node.js', icon: LuCpu, description: 'Initialize Node.js 24 with npm caching' },
    { id: 'install', name: 'Install Dependencies', icon: FiFileText, description: 'Install packages with npm ci (clean install)' },
    { id: 'discover', name: 'Discover Trending Topics', icon: FiSearch, description: 'AI scans web for trending tech topics via Tavily + Groq' },
    { id: 'research', name: 'Research & Write', icon: LuBot, description: 'Research -> Analyze -> Generate metadata -> Write content per topic' },
    { id: 'save', name: 'Persist to Firestore', icon: FiDatabase, description: 'Save lastRun timestamp, confirm articles are live' },
];

function matchStep(jobName) {
    const lower = (jobName || '').toLowerCase();
    if (lower.includes('checkout')) return 0;
    if (lower.includes('node') || lower.includes('setup')) return 1;
    if (lower.includes('install') || lower.includes('depend')) return 2;
    if (lower.includes('blog') || lower.includes('auto') || lower.includes('run')) return 3;
    return null;
}

function inferStepFromLine(line) {
    const l = line.toLowerCase();
    if (l.includes('checkout') || l.includes('syncing repository') || l.includes('cloning into')) return 0;
    if (l.includes('resolving node') || l.includes('node ') && l.includes('found')) return 1;
    if (l.includes('npm ci') || (l.includes('added') && l.includes('packages')) || l.includes('vulnerabilities')) return 2;
    if (l.includes('starting ai auto') || l.includes('loaded settings') || (l.includes('loaded') && l.includes('existing blogs'))) return 3;
    if (l.includes('discovering topics') || l.includes('web search')) return 3;
    if (l.includes('researching') || l.includes('analyzing')) return 4;
    if (l.includes('metadata') || l.includes('writing content')) return 4;
    if (l.includes('saving to db') || l.includes('published') || l.includes('cycle complete')) return 4;
    if (l.includes('lastrun') || l.includes('settings saved')) return 5;
    return null;
}

export default function AIAutoBlogger() {
    const [logs, setLogs] = useState([]);
    const [status, setStatus] = useState('idle');
    const [lastRun, setLastRun] = useState(null);
    const [currentStep, setCurrentStep] = useState(null);
    const [stepProgress, setStepProgress] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const terminalRef = useRef(null);
    const abortRef = useRef(null);

    const addLog = useCallback((line) => {
        if (!line) return;
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${line}`]);
    }, []);

    useEffect(() => {
        terminalRef.current?.scrollTo({ top: terminalRef.current.scrollHeight, behavior: 'smooth' });
    }, [logs.length]);

    const handleRunNow = useCallback(async () => {
        if (isRunning) return;

        const token = process.env.NEXT_PUBLIC_GITHUB_PAT;
        const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER;
        const repo = process.env.NEXT_PUBLIC_GITHUB_REPO;
        const workflow = 'daily-blog.yml';

        setLogs([]);
        setIsRunning(true);
        setStatus('running');
        setCurrentStep(null);
        setStepProgress(0);

        const abort = new AbortController();
        abortRef.current = abort;

        const api = async (url, opts = {}) => {
            return fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/vnd.github+json',
                    'X-GitHub-Api-Version': '2022-11-28',
                    ...opts.headers,
                },
                signal: abort.signal,
            });
        };

        try {
            if (!token || !owner || !repo) {
                addLog('ERROR: GitHub credentials not configured');
                addLog('Add NEXT_PUBLIC_GITHUB_PAT, NEXT_PUBLIC_GITHUB_OWNER, NEXT_PUBLIC_GITHUB_REPO to .env.local');
                setIsRunning(false);
                setStatus('error');
                return;
            }

            // 1. Dispatch workflow
            await api(`${GH}/repos/${owner}/${repo}/actions/workflows/${workflow}/dispatches`, {
                method: 'POST',
                body: JSON.stringify({ ref: 'main' }),
                headers: { 'Content-Type': 'application/json' },
            });
            addLog('Workflow dispatched on GitHub Actions');
            addLog('');

            // 2. Wait for run
            addLog('Waiting for workflow run to start...');
            let run = null;
            for (let i = 0; i < 15; i++) {
                const res = await api(`${GH}/repos/${owner}/${repo}/actions/workflows/${workflow}/runs?per_page=1&branch=main`);
                if (!res.ok) { await new Promise(r => setTimeout(r, 1500)); continue; }
                const data = await res.json();
                if (data.workflow_runs?.[0]) {
                    run = data.workflow_runs[0];
                    break;
                }
                await new Promise(r => setTimeout(r, 1500));
            }

            if (!run) {
                addLog('ERROR: Workflow run did not appear within 20 seconds');
                setIsRunning(false);
                setStatus('error');
                return;
            }

            addLog(`Run #${run.run_number} started (${run.status})`);
            addLog('');

            const runId = run.id;
            const logCache = new Map();

            // 3. Poll jobs & fetch logs
            while (!abort.signal.aborted) {
                const jobsRes = await api(`${GH}/repos/${owner}/${repo}/actions/runs/${runId}/jobs?per_page=100`);
                if (!jobsRes.ok) break;
                const jobsData = await jobsRes.json();

                let anyInProgress = false;

                for (const job of (jobsData.jobs || [])) {
                    addLog(`[${job.status.toUpperCase()}] ${job.name}`);

                    // Step detection from job name
                    const stepMatch = matchStep(job.name);
                    if (stepMatch !== null) {
                        setCurrentStep(stepMatch);
                        setStepProgress(0);
                    }

                    // Fetch live logs
                    if (job.status === 'in_progress' || job.status === 'completed') {
                        anyInProgress = job.status === 'in_progress';
                        try {
                            const logRes = await api(`${GH}/repos/${owner}/${repo}/actions/jobs/${job.id}/logs`);
                            if (logRes.ok) {
                                const logText = await logRes.text();
                                const prevLen = logCache.get(job.id) || 0;

                                if (logText.length > prevLen) {
                                    const newLines = logText.slice(prevLen).split('\n');
                                    for (const rawLine of newLines) {
                                        const line = rawLine.trim();
                                        if (line) {
                                            addLog(line);
                                            const step = inferStepFromLine(line);
                                            if (step !== null) {
                                                setCurrentStep(step);
                                                // Progress within research step
                                                if (line.includes('Published!')) setStepProgress(100);
                                                else if (line.match(/\(\d\/5\)/)) {
                                                    const m = line.match(/\((\d)\/5\)/);
                                                    if (m) setStepProgress(parseInt(m[1]) * 20);
                                                }
                                            }
                                        }
                                    }
                                    logCache.set(job.id, logText.length);
                                }
                            }
                        } catch (e) {
                            addLog(`[WARN] Could not fetch logs for ${job.name}: ${e.message}`);
                        }
                    }

                    // Detect completion
                    if (job.conclusion === 'success' || job.conclusion === 'failure') {
                        anyInProgress = false;
                    }
                }

                // Check if run is completed
                const runCheck = await api(`${GH}/repos/${owner}/${repo}/actions/runs/${runId}`);
                if (runCheck.ok) {
                    const rd = await runCheck.json();
                    if (rd.status === 'completed') {
                        anyInProgress = false;
                        addLog('');
                        addLog(`Workflow ${rd.conclusion === 'success' ? 'completed successfully' : `ended with ${rd.conclusion}`}`);
                        break;
                    }
                }

                if (!anyInProgress) {
                    // Double check: are all jobs completed?
                    const allDone = (jobsData.jobs || []).every(j =>
                        j.status === 'completed' || j.conclusion === 'success' || j.conclusion === 'failure'
                    );
                    if (allDone) break;
                }

                await new Promise(r => setTimeout(r, LOG_INTERVAL));
            }

            setCurrentStep(null);
            setIsRunning(false);
            setStatus('success');
            setLastRun(new Date().toISOString());
            setStepProgress(0);
            addLog('');
            addLog('Pipeline finished');

        } catch (err) {
            if (err.name === 'AbortError') return;
            addLog(`ERROR: ${err.message}`);
            setIsRunning(false);
            setStatus('error');
        }
    }, [isRunning, addLog]);

    const getLogColor = (log) => {
        const l = log.toLowerCase();
        if (l.includes('published') || l.includes('finished') || l.includes('cycle complete') || l.includes('completed successfully')) return '#34d399';
        if (l.includes('[error]') || l.includes('error:')) return '#f87171';
        if (l.includes('[warn') || l.includes('warning')) return '#fbbf24';
        if (l.includes('[completed]') || l.includes('[success]') || l.includes('pipeline finished')) return '#34d399';
        if (l.includes('[in_progress]')) return '#60a5fa';
        if (l.includes('pipeline') || l.includes('dispatched') || l.includes('starting')) return '#fbbf24';
        if (l.includes('researching') || l.includes('analyzing')) return '#a78bfa';
        if (l.includes('[queued]')) return '#6b7280';
        return '#9ca3af';
    };

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

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.4rem 0.9rem', borderRadius: '9999px',
                        background: status === 'running' ? 'rgba(251,191,36,0.1)'
                            : status === 'success' ? 'rgba(52,211,153,0.1)'
                            : status === 'error' ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${
                            status === 'running' ? 'rgba(251,191,36,0.2)'
                            : status === 'success' ? 'rgba(52,211,153,0.2)'
                            : status === 'error' ? 'rgba(248,113,113,0.2)' : 'rgba(255,255,255,0.08)'
                        }`,
                    }}>
                        {status === 'running' && <FiLoader className="pipeline-spin" style={{ color: '#fbbf24', fontSize: '14px' }} />}
                        {status === 'success' && <FiCheckCircle style={{ color: '#34d399', fontSize: '14px' }} />}
                        {status !== 'running' && status !== 'success' && <FiClock style={{ color: '#6b7280', fontSize: '14px' }} />}
                        <span style={{
                            color: status === 'running' ? '#fbbf24' : status === 'success' ? '#34d399'
                            : status === 'error' ? '#f87171' : '#6b7280',
                            fontSize: '0.8rem', fontWeight: 500,
                        }}>
                            {status === 'running' ? 'Running'
                                : status === 'success' ? `Done · ${lastRun ? new Date(lastRun).toLocaleTimeString() : ''}`
                                : status === 'error' ? 'Failed' : 'Ready'}
                        </span>
                    </div>

                    <button
                        onClick={handleRunNow}
                        disabled={isRunning}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.5rem 1.25rem',
                            background: isRunning ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                            color: isRunning ? '#6b7280' : '#000',
                            border: 'none', borderRadius: '10px',
                            fontWeight: 600, fontSize: '0.85rem',
                            cursor: isRunning ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {isRunning ? <FiLoader className="pipeline-spin" style={{ fontSize: '14px' }} /> : <FiPlay style={{ fontSize: '14px' }} />}
                        {isRunning ? 'Running...' : 'Run Now'}
                    </button>
                </div>
            </div>

            {/* Two-column layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* LEFT */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                                ['Runtime', 'Node 24 / ubuntu-latest'],
                                ['AI Model', 'llama-3.3-70b (Groq)'],
                                ['Search', 'Tavily API (basic)'],
                                ['Database', 'Firebase Firestore'],
                                ['Output', '5 articles / day'],
                            ].map(([k, v]) => (
                                <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                    <span style={{ color: '#6b7280', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k}</span>
                                    <span style={{ color: '#e5e7eb', fontSize: '0.82rem', fontFamily: 'monospace' }}>{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '16px', padding: '1.25rem',
                        flex: 1,
                    }}>
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 600, color: '#9ca3af' }}>
                            Pipeline Steps
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            {PIPELINE_STEPS.map((step, i) => {
                                const Icon = step.icon;
                                const isActive = currentStep === i;
                                const isPast = currentStep !== null && i < currentStep;
                                const done = isPast || (status === 'success' && currentStep === null);

                                return (
                                    <div key={step.id} style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                                        padding: '0.65rem 0.85rem',
                                        borderRadius: '10px',
                                        background: isActive ? 'rgba(251,191,36,0.06)' : 'transparent',
                                        border: `1px solid ${
                                            isActive ? 'rgba(251,191,36,0.15)'
                                            : done ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.04)'
                                        }`,
                                        transition: 'all 0.25s ease',
                                    }}>
                                        <div style={{
                                            width: '28px', height: '28px', borderRadius: '8px', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                            background: done ? 'rgba(52,211,153,0.12)' : isActive ? 'rgba(251,191,36,0.12)' : 'rgba(255,255,255,0.05)',
                                        }}>
                                            {done
                                                ? <FiCheckCircle style={{ color: '#34d399', fontSize: '14px' }} />
                                                : isActive
                                                ? <FiLoader className="pipeline-spin" style={{ color: '#fbbf24', fontSize: '14px' }} />
                                                : <Icon style={{ color: '#6b7280', fontSize: '14px' }} />
                                            }
                                        </div>

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                color: done ? '#34d399' : isActive ? '#fbbf24' : '#9ca3af',
                                                fontSize: '0.82rem', fontWeight: 500,
                                            }}>
                                                {step.name}
                                            </div>
                                            <div style={{ color: '#4b5563', fontSize: '0.72rem' }}>
                                                {step.description}
                                            </div>
                                        </div>

                                        {isActive && (
                                            <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${stepProgress}%`, background: '#fbbf24', borderRadius: '2px', transition: 'width 0.3s ease' }} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Terminal */}
                <div style={{
                    background: '#0c0c0c',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.06)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'sticky',
                    top: '1.5rem',
                    height: 'fit-content',
                }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        background: 'rgba(255,255,255,0.02)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }} />
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e' }} />
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }} />
                            </div>
                            <span style={{ color: '#6b7280', fontSize: '0.78rem', marginLeft: '0.5rem' }}>GitHub Actions · daily-blog.yml</span>
                        </div>
                        <LuTerminal style={{ color: '#4b5563', fontSize: '16px' }} />
                    </div>

                    <div
                        ref={terminalRef}
                        style={{
                            padding: '1rem 1.25rem',
                            height: 'calc(100vh - 280px)',
                            minHeight: '420px',
                            overflowY: 'auto',
                            fontFamily: '"SF Mono", "JetBrains Mono", "Fira Code", monospace',
                            fontSize: '0.73rem',
                            lineHeight: '1.7',
                            color: '#d1d5db',
                        }}
                    >
                        {logs.length === 0 ? (
                            <div style={{ textAlign: 'center', paddingTop: '40%', color: '#374151' }}>
                                <LuTerminal style={{ fontSize: '2.5rem', marginBottom: '0.75rem', display: 'block', margin: '0 auto 0.75rem' }} />
                                <div style={{ fontSize: '0.85rem' }}>Click <strong style={{ color: '#6b7280' }}>"Run Now"</strong> to trigger the pipeline</div>
                                <div style={{ fontSize: '0.72rem', marginTop: '0.25rem', color: '#1f2937' }}>or wait for the 21:00 daily cron</div>
                            </div>
                        ) : (
                            logs.map((log, i) => (
                                <div key={i} style={{
                                    color: getLogColor(log),
                                    borderBottom: '1px solid rgba(255,255,255,0.02)',
                                    paddingBottom: '0.2rem',
                                }}>
                                    {log}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .pipeline-spin {
                    animation: pipeline-spin 1s linear infinite;
                }
                @keyframes pipeline-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
