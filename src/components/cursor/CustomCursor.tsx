import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface CustomCursorProps {
  isEnabled?: boolean;
}

export function CustomCursor({ isEnabled = true }: CustomCursorProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);
  const location = useLocation();

  // Reset cursor on route change
  useEffect(() => {
    isHoveringRef.current = false;
    if (dotRef.current) {
      dotRef.current.classList.remove('hover', 'card');
    }
    if (ringRef.current) {
      ringRef.current.classList.remove('hover', 'card');
    }
  }, [location]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    posRef.current = { x: e.clientX, y: e.clientY };

    if (dotRef.current && ringRef.current) {
      gsap.to(dotRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.08,
        ease: 'power2.out',
      });

      gsap.to(ringRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: 'power2.out',
      });
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (dotRef.current && ringRef.current) {
      gsap.to([dotRef.current, ringRef.current], {
        opacity: 1,
        duration: 0.3,
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (dotRef.current && ringRef.current) {
      gsap.to([dotRef.current, ringRef.current], {
        opacity: 0,
        duration: 0.3,
      });
    }
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    // Check for touch device
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    // Add custom cursor class to body
    document.body.classList.add('custom-cursor-active');

    // Event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Event delegation for hover states
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactive = target.closest('a, button, [data-cursor-hover]');
      const card = target.closest('[data-cursor-card]');

      if (card) {
        isHoveringRef.current = true;
        dotRef.current?.classList.add('card');
        ringRef.current?.classList.add('card');
      } else if (interactive) {
        isHoveringRef.current = true;
        dotRef.current?.classList.add('hover');
        ringRef.current?.classList.add('hover');
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactive = target.closest('a, button, [data-cursor-hover]');
      const card = target.closest('[data-cursor-card]');

      if (card) {
        // Check if we are moving to another element inside the same card
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (relatedTarget && card.contains(relatedTarget)) return;

        isHoveringRef.current = false;
        dotRef.current?.classList.remove('card');
        ringRef.current?.classList.remove('card');
      } else if (interactive) {
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (relatedTarget && interactive.contains(relatedTarget)) return;

        isHoveringRef.current = false;
        dotRef.current?.classList.remove('hover');
        ringRef.current?.classList.remove('hover');
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isEnabled, handleMouseMove, handleMouseEnter, handleMouseLeave]);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  if (!isEnabled) return null;

  return (
    <div className="custom-cursor pointer-events-none fixed inset-0 z-[9999]">
      <div
        ref={dotRef}
        className="cursor-dot absolute opacity-0"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div
        ref={ringRef}
        className="cursor-ring absolute opacity-0 flex items-center justify-center"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <ArrowUpRight className="arrow-icon w-6 h-6" />
      </div>
    </div>
  );
}

export default CustomCursor;
