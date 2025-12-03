/*
	Installed from https://reactbits.dev/tailwind/
*/

'use client';

/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { forwardRef, useRef, useMemo, useLayoutEffect, useEffect, useState } from "react";
import { Color } from "three";

const hexToNormalizedRGB = (hex) => {
  hex = hex.replace("#", "");
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255,
  ];
};

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd        = noise(gl_FragCoord.xy);
  vec2  uv         = rotateUvs(vUv * uScale, uRotation);
  vec2  tex        = uv * uScale;
  float tOffset    = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`;

const SilkPlane = forwardRef(function SilkPlane({ uniforms }, ref) {
  const { viewport } = useThree();

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.scale.set(viewport.width, viewport.height, 1);
    }
  }, [ref, viewport]);

  useFrame((_, delta) => {
    ref.current.material.uniforms.uTime.value += 0.1 * delta;
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
});
SilkPlane.displayName = "SilkPlane";

const Silk = ({
  speed = 5,
  scale = 2,
  noiseIntensity = 0.2,
  rotation = 0,
  currentTheme = 'blue',
  isDarkMode = false,
  disableAnimation = false,
}) => {
  const meshRef = useRef();

  // Theme colors mapping matching Fireworks component
  const themeColors = {
    blue: isDarkMode ? ['#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'] : ['#1D4ED8', '#2563EB', '#3B82F6', '#60A5FA'],
    red: isDarkMode ? ['#EF4444', '#F87171', '#FCA5A5', '#FECACA'] : ['#DC2626', '#EF4444', '#F87171', '#FCA5A5'],
    purple: isDarkMode ? ['#A855F7', '#C084FC', '#DDD6FE', '#EDE9FE'] : ['#7C3AED', '#A855F7', '#C084FC', '#DDD6FE'],
    emerald: isDarkMode ? ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'] : ['#059669', '#10B981', '#34D399', '#6EE7B7'],
    orange: isDarkMode ? ['#F97316', '#FB923C', '#FDBA74', '#FED7AA'] : ['#EA580C', '#F97316', '#FB923C', '#FDBA74'],
    pink: isDarkMode ? ['#EC4899', '#F472B6', '#F9A8D4', '#FBCFE8'] : ['#DB2777', '#EC4899', '#F472B6', '#F9A8D4'],
    lightgray: isDarkMode ? ['#dee1e0', '#c3c7c6', '#b8bbba', '#929594'] : ['#b8bbba', '#929594', '#6c6f6e', '#464948']
  };
  const colors = themeColors[currentTheme] || themeColors.blue;
  const color = colors[0]; // Use the first color from the theme array

  const uniforms = useMemo(
    () => ({
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: new Color(...hexToNormalizedRGB(color)) },
      uRotation: { value: rotation },
      uTime: { value: 0 },
    }),
    [speed, scale, noiseIntensity, rotation] // Removed color from dependencies
  );

  // Update color when currentTheme or isDarkMode changes
  useEffect(() => {
    if (meshRef.current) {
      const updatedColors = themeColors[currentTheme] || themeColors.blue;
      meshRef.current.material.uniforms.uColor.value = new Color(...hexToNormalizedRGB(updatedColors[0]));
    }
  }, [currentTheme, isDarkMode, themeColors]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-full" />;
  }

  return (
    <Canvas dpr={[1, 2]} frameloop={disableAnimation ? "never" : "always"}>
      <SilkPlane ref={meshRef} uniforms={uniforms} />
    </Canvas>
  );
};

export default Silk;