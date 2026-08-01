import { useEffect, useRef, useState } from 'react';

function getBgImage(): string {
  try { return localStorage.getItem('bgImage') || ''; } catch { return ''; }
}

function parseRgba(str: string): [number, number, number, number] {
  const m = str.match(/[\d.]+/g);
  if (!m || m.length < 3) return [0, 0, 0, 1];
  return [parseFloat(m[0]) / 255, parseFloat(m[1]) / 255, parseFloat(m[2]) / 255, m.length > 3 ? parseFloat(m[3]) : 1];
}

function readThemeColors() {
  const s = getComputedStyle(document.documentElement);
  return {
    glow1: parseRgba(s.getPropertyValue('--glow-1').trim() || 'rgba(1,15,200,0.7)'),
    glow2: parseRgba(s.getPropertyValue('--glow-2').trim() || 'rgba(0,25,150,0.6)'),
    aurora1: parseRgba(s.getPropertyValue('--aurora-1').trim() || 'rgba(56,130,246,0.5)'),
    aurora2: parseRgba(s.getPropertyValue('--aurora-2').trim() || 'rgba(168,85,247,0.42)'),
    aurora3: parseRgba(s.getPropertyValue('--aurora-3').trim() || 'rgba(34,211,238,0.38)'),
    aurora4: parseRgba(s.getPropertyValue('--aurora-4').trim() || 'rgba(29,78,216,0.5)'),
  };
}

const VERTEX_SOURCE = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SOURCE = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec4 u_glow1;
  uniform vec4 u_glow2;
  uniform vec4 u_aurora1;
  uniform vec4 u_aurora2;
  uniform vec4 u_aurora3;
  uniform vec4 u_aurora4;

  float hash12(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x),
      mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float t = u_time * 0.12;

    vec3 col = vec3(0.015, 0.02, 0.05);

    // Layer 1 — aurora curtain 1
    float drift1y = 0.4 + 0.2 * sin(t * 0.7 + 1.0);
    float drift1x = 0.5 + 0.3 * sin(t * 0.4 + 2.5);
    float n1 = fbm(vec2(uv.x * 2.0 + t * 0.3, uv.y * 1.0 + t * 0.12));
    float c1 = exp(-pow((uv.y - drift1y - n1 * 0.4) * 3.0, 2.0));
    float s1 = smoothstep(-0.1, 0.5, uv.x - drift1x + n1 * 0.6) * smoothstep(1.2, 0.5, uv.x - drift1x + n1 * 0.6);
    col += u_aurora1.rgb * c1 * s1 * 0.35;

    // Layer 2 — aurora curtain 2
    float drift2y = 0.55 + 0.2 * sin(t * 0.55 + 3.0);
    float drift2x = 0.5 + 0.35 * cos(t * 0.35 + 4.0);
    float n2 = fbm(vec2(uv.x * 1.6 - t * 0.25, uv.y * 1.3 - t * 0.1));
    float c2 = exp(-pow((uv.y - drift2y - n2 * 0.35) * 3.5, 2.0));
    float s2 = smoothstep(-0.1, 0.6, uv.x - drift2x - n2 * 0.5) * smoothstep(1.2, 0.4, uv.x - drift2x - n2 * 0.5);
    col += u_aurora2.rgb * c2 * s2 * 0.30;

    // Layer 3 — aurora curtain 3
    float drift3y = 0.5 + 0.18 * sin(t * 0.65 + 5.5);
    float drift3x = 0.5 + 0.25 * sin(t * 0.5 + 0.5);
    float n3 = fbm(vec2(uv.x * 2.5 + t * 0.2, uv.y * 0.7 + t * 0.15));
    float c3 = exp(-pow((uv.y - drift3y - n3 * 0.3) * 4.0, 2.0));
    float s3 = smoothstep(-0.1, 0.5, uv.x - drift3x + n3 * 0.4) * smoothstep(1.1, 0.5, uv.x - drift3x + n3 * 0.4);
    col += u_aurora3.rgb * c3 * s3 * 0.25;

    // Layer 4 — aurora curtain 4
    float drift4y = 0.65 + 0.22 * cos(t * 0.45 + 6.0);
    float drift4x = 0.5 + 0.3 * cos(t * 0.3 + 1.5);
    float n4 = fbm(vec2(uv.x * 1.3 + t * 0.18, uv.y * 1.8 - t * 0.12));
    float c4 = exp(-pow((uv.y - drift4y - n4 * 0.35) * 2.5, 2.0));
    float s4 = smoothstep(-0.1, 0.7, uv.x - drift4x + n4 * 0.6) * smoothstep(1.3, 0.3, uv.x - drift4x + n4 * 0.6);
    col += u_aurora4.rgb * c4 * s4 * 0.28;

    // Subtle glow orbs — very low intensity
    float glow1d = length((uv - vec2(0.5 + 0.2 * sin(t * 0.3), 0.5)) * vec2(1.0, 0.7));
    col += u_glow1.rgb * exp(-glow1d * glow1d * 4.0) * 0.15;

    float glow2d = length((uv - vec2(0.7 + 0.15 * cos(t * 0.25), 0.3)) * vec2(0.9, 1.0));
    col += u_glow2.rgb * exp(-glow2d * glow2d * 4.5) * 0.12;

    // Tone map — preserve darks
    col = pow(clamp(col, 0.0, 1.0), vec3(1.1));

    gl_FragColor = vec4(col, 1.0);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Aurora shader error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function ReededGlassBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bgImage, setBgImage] = useState(getBgImage);

  useEffect(() => {
    const handler = () => setBgImage(getBgImage());
    window.addEventListener('bgImageChanged', handler);
    return () => window.removeEventListener('bgImageChanged', handler);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = (canvas.getContext('webgl', {
        antialias: false, alpha: false, depth: false,
        stencil: false, preserveDrawingBuffer: false,
        powerPreference: 'high-performance',
      }) || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    } catch { gl = null; }
    if (!gl) return;

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SOURCE);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SOURCE);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs);
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uGlow1 = gl.getUniformLocation(program, 'u_glow1');
    const uGlow2 = gl.getUniformLocation(program, 'u_glow2');
    const uA1 = gl.getUniformLocation(program, 'u_aurora1');
    const uA2 = gl.getUniformLocation(program, 'u_aurora2');
    const uA3 = gl.getUniformLocation(program, 'u_aurora3');
    const uA4 = gl.getUniformLocation(program, 'u_aurora4');

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const tw = Math.max(1, Math.round(w * dpr));
      const th = Math.max(1, Math.round(h * dpr));
      if (canvas.width !== tw || canvas.height !== th) { canvas.width = tw; canvas.height = th; }
      gl!.viewport(0, 0, canvas.width, canvas.height);
    };

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let running = true;
    let raf = 0;
    const start = performance.now();

    const render = () => {
      resize();
      const c = readThemeColors();
      gl!.uniform2f(uRes, canvas.width, canvas.height);
      gl!.uniform1f(uTime, reduceMotion ? 0 : (performance.now() - start) / 1000);
      gl!.uniform4f(uGlow1, c.glow1[0], c.glow1[1], c.glow1[2], c.glow1[3]);
      gl!.uniform4f(uGlow2, c.glow2[0], c.glow2[1], c.glow2[2], c.glow2[3]);
      gl!.uniform4f(uA1, c.aurora1[0], c.aurora1[1], c.aurora1[2], c.aurora1[3]);
      gl!.uniform4f(uA2, c.aurora2[0], c.aurora2[1], c.aurora2[2], c.aurora2[3]);
      gl!.uniform4f(uA3, c.aurora3[0], c.aurora3[1], c.aurora3[2], c.aurora3[3]);
      gl!.uniform4f(uA4, c.aurora4[0], c.aurora4[1], c.aurora4[2], c.aurora4[3]);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    };

    const loop = () => { if (!running) return; render(); raf = requestAnimationFrame(loop); };
    const onResize = () => { reduceMotion ? render() : resize(); };

    render();
    if (!reduceMotion) raf = requestAnimationFrame(loop);
    window.addEventListener('resize', onResize);

    return () => {
      running = false; cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      gl!.deleteBuffer(buffer); gl!.deleteProgram(program);
      gl!.deleteShader(vs); gl!.deleteShader(fs);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* WebGL aurora — bottom layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {/* Background image — ON TOP of canvas so it's visible */}
      {bgImage && (
        <div className="absolute inset-0" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      )}
    </div>
  );
}
