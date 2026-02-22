import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ExternalLink } from 'lucide-react';
import { useTheme } from 'next-themes';

gsap.registerPlugin(ScrollTrigger);

// Fluid Background Shader
const FluidBackground = ({ theme }: { theme: string | undefined }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const { viewport } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const colors = useMemo(() => {
    if (theme === 'light') {
      return {
        bg: new THREE.Color('#F1F5F9'), // slate-100
        primary: new THREE.Color('#3B82F6'), // blue-500
        secondary: new THREE.Color('#60A5FA'), // blue-400
      };
    }
    return {
      bg: new THREE.Color('#020617'), // slate-950/background
      primary: new THREE.Color('#3B82F6'), // blue-500
      secondary: new THREE.Color('#0EA5E9'), // sky-500
    };
  }, [theme]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
      uColorBg: { value: colors.bg },
      uColorPrimary: { value: colors.primary },
      uColorSecondary: { value: colors.secondary },
    }),
    [viewport, colors]
  );

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uColorBg.value = colors.bg;
      materialRef.current.uniforms.uColorPrimary.value = colors.primary;
      materialRef.current.uniforms.uColorSecondary.value = colors.secondary;
    }
  }, [colors]);

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    uniform vec3 uColorBg;
    uniform vec3 uColorPrimary;
    uniform vec3 uColorSecondary;
    varying vec2 vUv;

    // Simplex noise function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
        + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
      m = m*m;
      m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = vUv;
      vec2 mouse = uMouse;
      
      // Create flowing noise
      float noise1 = snoise(uv * 3.0 + uTime * 0.1);
      float noise2 = snoise(uv * 5.0 - uTime * 0.15);
      float noise3 = snoise(uv * 2.0 + uTime * 0.08);
      
      // Mouse influence
      float mouseDist = distance(uv, mouse);
      float mouseInfluence = smoothstep(0.5, 0.0, mouseDist) * 0.3;
      
      // Combine noises
      float finalNoise = (noise1 + noise2 * 0.5 + noise3 * 0.25) / 1.75;
      finalNoise += mouseInfluence;
      
      // Colors from uniforms
      vec3 color1 = uColorBg;
      vec3 color2 = uColorPrimary;
      vec3 color3 = uColorSecondary;
      
      // Mix colors based on noise
      vec3 finalColor = mix(color1, color2, smoothstep(-0.3, 0.5, finalNoise) * 0.15);
      finalColor = mix(finalColor, color3, smoothstep(0.3, 0.8, finalNoise) * 0.08);
      
      // Add subtle vignette
      float vignette = 1.0 - smoothstep(0.3, 1.2, length(uv - 0.5));
      finalColor *= vignette * 0.4 + 0.6;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;

      // Smooth mouse follow
      material.uniforms.uMouse.value.x += (mouseRef.current.x - material.uniforms.uMouse.value.x) * 0.05;
      material.uniforms.uMouse.value.y += (mouseRef.current.y - material.uniforms.uMouse.value.y) * 0.05;
    }
  });

  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1.0 - e.clientY / window.innerHeight,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

// Grid Overlay Component
const GridOverlay = () => {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(currentColor 1px, transparent 1px),
            linear-gradient(90deg, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
};

export function Hero() {
  const { resolvedTheme } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const subheading = subheadingRef.current;
    const cta = ctaRef.current;
    const scrollHint = scrollHintRef.current;

    if (!section || !heading || !subheading || !cta || !scrollHint) return;

    const ctx = gsap.context(() => {
      // Split heading into characters
      const chars = heading.querySelectorAll('.char');

      // Initial entrance animation timeline
      const tl = gsap.timeline({ delay: 0.5 });

      // Animate characters
      tl.fromTo(
        chars,
        {
          opacity: 0,
          y: 100,
          rotateX: -90,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          stagger: 0.05,
          ease: 'power3.out',
        }
      );

      // Animate subheading
      tl.fromTo(
        subheading,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      );

      // Animate CTA
      tl.fromTo(
        cta,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      );

      // Animate scroll hint
      tl.fromTo(
        scrollHint,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.3'
      );

      // Continuous scroll hint bounce
      gsap.to(scrollHint, {
        y: 10,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });

      // Scroll-triggered exit animation
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.set(heading, {
            opacity: 1 - progress * 1.5,
            y: -progress * 100,
            scale: 1 - progress * 0.1,
          });
          gsap.set(subheading, {
            opacity: 1 - progress * 2,
            y: -progress * 80,
          });
          gsap.set(cta, {
            opacity: 1 - progress * 2.5,
          });
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // Split text into characters
  const splitText = (text: string) => {
    return text.split('').map((char, i) => (
      <span
        key={i}
        className="char inline-block"
        style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  const tagline = "Graphic designer · Web designer · Designer";

  const scrollToWorks = () => {
    const worksSection = document.getElementById('works');
    if (worksSection) {
      worksSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
    >
      {/* WebGL Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <FluidBackground key={resolvedTheme} theme={resolvedTheme} />
        </Canvas>
      </div>

      {/* Grid Overlay */}
      <GridOverlay />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <h1
          ref={headingRef}
          className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 tracking-tight"
          style={{ perspective: '1000px' }}
        >
          {splitText('BUKHARI DESIGNS')}
        </h1>

        <p
          ref={subheadingRef}
          className="text-xl sm:text-2xl md:text-3xl text-muted-foreground mb-10 font-light"
        >
          {tagline.split(' · ').map((part, i) => (
            <span key={i}>
              <span className="text-gradient font-medium">{part}</span>
              {i < tagline.split(' · ').length - 1 && <span className="mx-2 text-muted-foreground/30">·</span>}
            </span>
          ))}
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={scrollToWorks}
            className="magnetic-btn px-8 py-4 bg-primary hover:opacity-90 text-white rounded-full font-medium text-lg transition-all duration-300 hover:shadow-glow-lg group"
            data-cursor-hover
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore Works
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>

          <button
            onClick={scrollToContact}
            className="magnetic-btn px-8 py-4 border border-border hover:border-primary text-muted-foreground hover:text-foreground rounded-full font-medium text-lg transition-all duration-300 flex items-center gap-2 group"
            data-cursor-hover
          >
            Get in Touch
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scroll Hint */}
      <div
        ref={scrollHintRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-muted-foreground text-sm font-mono">Scroll to explore</span>
        <div className="w-6 h-10 border-2 border-border rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary rounded-full" />
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 border border-primary/20 rounded-full floating" />
      <div className="absolute bottom-32 right-16 w-32 h-32 border border-primary/10 rounded-full floating-delayed" />
      <div className="absolute top-1/3 right-20 w-3 h-3 bg-primary/40 rounded-full floating" />
    </section>
  );
}

export default Hero;
