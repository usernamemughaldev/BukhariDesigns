import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const logo = logoRef.current;
    const progressEl = progressRef.current;
    const progressBar = progressBarRef.current;

    if (!container || !logo || !progressEl || !progressBar) return;

    const tl = gsap.timeline();

    // Logo entrance
    tl.fromTo(
      logo,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }
    );

    // Progress bar animation
    tl.to(
      {},
      {
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate: function () {
          const prog = Math.round(this.progress() * 100);
          setProgress(prog);
          gsap.set(progressBar, { scaleX: this.progress() });
        },
      },
      '-=0.3'
    );

    // Exit animation
    tl.to(logo, {
      opacity: 0,
      y: -30,
      duration: 0.4,
      ease: 'power2.in',
    });

    tl.to(
      progressEl,
      {
        opacity: 0,
        duration: 0.3,
      },
      '-=0.3'
    );

    // Curtain wipe
    tl.to(container, {
      clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
      duration: 0.8,
      ease: 'power3.inOut',
      onComplete: () => {
        onComplete();
      },
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="loading-screen"
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
    >
      <div className="flex flex-col items-center gap-8">
        {/* Logo */}
        <div ref={logoRef} className="relative">
          <span className="font-heading text-4xl sm:text-5xl font-bold text-foreground">
            Bukhari<span className="text-primary">.</span>Designs
          </span>

          {/* Glow effect */}
          <div className="absolute inset-0 blur-2xl opacity-50">
            <span className="font-heading text-4xl sm:text-5xl font-bold text-primary">
              Bukhari<span className="text-secondary">.</span>Designs
            </span>
          </div>
        </div>

        {/* Progress */}
        <div ref={progressRef} className="w-48 sm:w-64">
          <div className="flex justify-between text-xs text-muted-foreground font-mono mb-2">
            <span>Loading</span>
            <span>{progress}%</span>
          </div>
          <div className="h-0.5 bg-muted rounded-full overflow-hidden">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-primary to-secondary origin-left"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
