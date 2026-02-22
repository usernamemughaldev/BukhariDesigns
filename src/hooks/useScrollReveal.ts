import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const {
    direction = 'up',
    distance = 50,
    duration = 0.8,
    delay = 0,
    ease = 'power3.out',
    start = 'top 85%',
    end = 'bottom 20%',
    scrub = false,
    markers = false,
  } = options;

  const elementRef = useRef<T>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Get transform values based on direction
    const getFromTransform = () => {
      switch (direction) {
        case 'up':
          return { y: distance, x: 0 };
        case 'down':
          return { y: -distance, x: 0 };
        case 'left':
          return { x: distance, y: 0 };
        case 'right':
          return { x: -distance, y: 0 };
        default:
          return { y: distance, x: 0 };
      }
    };

    const fromTransform = getFromTransform();

    // Set initial state
    gsap.set(element, {
      opacity: 0,
      ...fromTransform,
    });

    // Create animation
    const animation = gsap.to(element, {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      delay,
      ease,
      scrollTrigger: {
        trigger: element,
        start,
        end,
        scrub,
        markers,
        toggleActions: scrub ? undefined : 'play none none reverse',
        onEnter: () => {
          // Animation plays on enter
        },
      },
    });

    if (animation.scrollTrigger) {
      triggersRef.current.push(animation.scrollTrigger);
    }

    return () => {
      triggersRef.current.forEach((trigger) => trigger.kill());
      triggersRef.current = [];
      animation.kill();
    };
  }, [direction, distance, duration, delay, ease, start, end, scrub, markers]);

  return elementRef;
}

// Hook for staggering multiple children
export function useStaggerReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const {
    direction = 'up',
    distance = 50,
    duration = 0.8,
    delay = 0,
    stagger = 0.1,
    ease = 'power3.out',
    start = 'top 85%',
    scrub = false,
  } = options;

  const containerRef = useRef<T>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = container.children;
    if (children.length === 0) return;

    const getFromTransform = () => {
      switch (direction) {
        case 'up':
          return { y: distance };
        case 'down':
          return { y: -distance };
        case 'left':
          return { x: distance };
        case 'right':
          return { x: -distance };
        default:
          return { y: distance };
      }
    };

    const fromTransform = getFromTransform();

    gsap.set(children, {
      opacity: 0,
      ...fromTransform,
    });

    const animation = gsap.to(children, {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      delay,
      stagger,
      ease,
      scrollTrigger: {
        trigger: container,
        start,
        scrub,
        toggleActions: scrub ? undefined : 'play none none reverse',
      },
    });

    if (animation.scrollTrigger) {
      triggersRef.current.push(animation.scrollTrigger);
    }

    return () => {
      triggersRef.current.forEach((trigger) => trigger.kill());
      triggersRef.current = [];
      animation.kill();
    };
  }, [direction, distance, duration, delay, stagger, ease, start, scrub]);

  return containerRef;
}

export default useScrollReveal;
