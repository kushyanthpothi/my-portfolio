import { useEffect, useRef, useState } from 'react';

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

  float dither4x4(vec2 position) {
    int x = int(mod(position.x, 4.0));
    int y = int(mod(position.y, 4.0));
    int index = x + y * 4;
    float matrix = 0.0;
    if (index == 0) matrix = 0.0 / 16.0;
    else if (index == 1) matrix = 8.0 / 16.0;
    else if (index == 2) matrix = 2.0 / 16.0;
    else if (index == 3) matrix = 10.0 / 16.0;
    else if (index == 4) matrix = 12.0 / 16.0;
    else if (index == 5) matrix = 4.0 / 16.0;
    else if (index == 6) matrix = 14.0 / 16.0;
    else if (index == 7) matrix = 6.0 / 16.0;
    else if (index == 8) matrix = 3.0 / 16.0;
    else if (index == 9) matrix = 11.0 / 16.0;
    else if (index == 10) matrix = 1.0 / 16.0;
    else if (index == 11) matrix = 9.0 / 16.0;
    else if (index == 12) matrix = 15.0 / 16.0;
    else if (index == 13) matrix = 7.0 / 16.0;
    else if (index == 14) matrix = 5.0 / 16.0;
    else matrix = 13.0 / 16.0;
    return (matrix - 0.5) / 255.0;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 p = (uv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);

    float t = u_time * 0.05;

    // Three glows orbiting slowly on independent elliptical paths.
    vec2 o1 = 0.40 * vec2(cos(t * 0.62 + 0.7), sin(t * 0.46));
    vec2 o2 = 0.42 * vec2(cos(t * 0.41 + 2.6), sin(t * 0.56 + 1.2));
    vec2 o3 = 0.36 * vec2(cos(t * 0.30 + 4.4), sin(t * 0.38 + 3.1));

    float breath = 1.0 + 0.07 * sin(t * 1.1);

    float d1 = length((p - o1) * vec2(1.0, 0.82));
    float d2 = length((p - o2) * vec2(0.88, 1.0));
    float d3 = length((p - o3) * vec2(1.06, 0.9));

    float g1 = exp(-d1 * d1 * 3.4) * 0.85 + exp(-d1 * 3.0) * 0.15;
    float g2 = exp(-d2 * d2 * 3.9) * 0.85 + exp(-d2 * 3.4) * 0.15;
    float g3 = exp(-d3 * d3 * 3.0) * 0.85 + exp(-d3 * 2.7) * 0.15;

    vec3 col = vec3(0.0);
    col += vec3(1.0, 0.3333, 0.0) * g1 * 1.9 * breath;              // Fiery Orange #FF5500
    col += vec3(0.8, 0.0667, 0.0) * g2 * 1.7;                       // Deep Red #CC1100
    col += vec3(0.0, 0.5333, 0.6667) * g3 * 2.1 * (2.0 - breath);   // Teal #0088AA

    // Low-frequency organic ripples so the mesh keeps shifting.
    float n = noise(p * 2.2 + t * 0.18);
    float n2 = noise(p * 4.6 - t * 0.11);
    col += vec3((n - 0.5) * 0.05 + (n2 - 0.5) * 0.03);

    // Extra-fine grain baked in; the DOM overlay adds the crisp 3% film texture.
    col += vec3((hash12(gl_FragCoord.xy + fract(t) * 73.0) - 0.5) * 0.015);

    col = pow(clamp(col, 0.0, 1.0), vec3(0.4545));

    // Apply 4x4 Bayer dithering to break up banding on mobile
    col += dither4x4(gl_FragCoord.xy);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Mesh gradient shader error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function MeshGradientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = (canvas.getContext('webgl', {
        antialias: false,
        alpha: false,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: false,
        powerPreference: 'high-performance',
      }) ||
        canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    } catch {
      gl = null;
    }

    if (!gl) {
      setWebglFailed(true);
      return;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SOURCE);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SOURCE);
    if (!vs || !fs) {
      setWebglFailed(true);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      setWebglFailed(true);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Mesh gradient link error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      setWebglFailed(true);
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const resolutionLoc = gl.getUniformLocation(program, 'u_resolution');
    const timeLoc = gl.getUniformLocation(program, 'u_time');

    const dpr = Math.min(window.devicePixelRatio || 1, 3);

    let currentW = 0;
    let currentH = 0;

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const targetW = Math.max(1, Math.round(w * dpr));
      const targetH = Math.max(1, Math.round(h * dpr));
      if (currentW !== targetW || currentH !== targetH) {
        currentW = targetW;
        currentH = targetH;
        canvas.width = targetW;
        canvas.height = targetH;
      }
      gl.viewport(0, 0, currentW, currentH);
    };

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let running = true;
    let raf = 0;
    const start = performance.now();

    const render = () => {
      gl.uniform2f(resolutionLoc, currentW, currentH);
      gl.uniform1f(timeLoc, reduceMotion ? 0 : (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = () => {
      if (!running) return;
      render();
      raf = requestAnimationFrame(loop);
    };

    const onResize = () => {
      resize();
      if (!reduceMotion) {
        render();
      }
    };

    resize();
    render();
    if (!reduceMotion) {
      raf = requestAnimationFrame(loop);
    }
    window.addEventListener('resize', onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  if (webglFailed) {
    return (
      <div className="mesh-bg mesh-bg--fallback" aria-hidden="true">
        <div className="mesh-bg__glow mesh-bg__glow--orange">
          <div className="mesh-bg__spin">
            <div className="mesh-bg__core" />
          </div>
        </div>
        <div className="mesh-bg__glow mesh-bg__glow--red">
          <div className="mesh-bg__spin">
            <div className="mesh-bg__core" />
          </div>
        </div>
        <div className="mesh-bg__glow mesh-bg__glow--teal">
          <div className="mesh-bg__spin">
            <div className="mesh-bg__core" />
          </div>
        </div>
        <div className="mesh-bg__noise" />
      </div>
    );
  }

  return (
    <div className="mesh-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="mesh-bg__canvas" />
      <div className="mesh-bg__noise" />
    </div>
  );
}
