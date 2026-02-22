import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Custom tool components are removed as they are replaced by provided GIFs

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const tools = toolsRef.current;
    const stats = statsRef.current;

    if (!section || !content || !tools || !stats) return;

    const ctx = gsap.context(() => {
      // Content reveal animation
      gsap.fromTo(
        content.children,
        { opacity: 0, y: 60, x: -40 },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Tools floating animation with parallax
      const toolElements = tools.querySelectorAll('.tool-item');
      toolElements.forEach((tool, i) => {
        gsap.fromTo(
          tool,
          { opacity: 0, scale: 0.8, y: 50 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.15,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: section,
              start: 'top 60%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Continuous floating with hover pause to fix jitter
        const floatAnim = gsap.to(tool, {
          y: `${-15 + i * 5}`,
          rotation: `${-3 + i * 3}`,
          duration: 3 + i * 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          paused: false
        });

        tool.addEventListener('mouseenter', () => floatAnim.pause());
        tool.addEventListener('mouseleave', () => floatAnim.play());
      });

      // Parallax on scroll
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          toolElements.forEach((tool, i) => {
            gsap.set(tool, {
              y: (progress - 0.5) * (50 + i * 20),
            });
          });
        },
      });

      // Stats counter animation
      const statNumbers = stats.querySelectorAll('.stat-number');
      statNumbers.forEach((stat) => {
        const target = parseInt(stat.getAttribute('data-target') || '0', 10);
        gsap.fromTo(
          stat,
          { innerText: 0 },
          {
            innerText: target,
            duration: 2,
            ease: 'power2.out',
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: stats,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Stats reveal
      gsap.fromTo(
        stats.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: stats,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full min-h-screen py-24 lg:py-32 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/50 to-background" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Content */}
          <div ref={contentRef} className="space-y-8">
            <div>
              <span className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-mono mb-6">
                About Bukhari Designs
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Crafting Your <span className="text-gradient">Vision</span>
              </h2>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              We craft attractive and custom design solutions for you which can make you stand out in the crowd.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Our expertise spans across brand identity, user interface design, and digital marketing. We believe that high-quality design should be accessible and tailored to your specific needs.
            </p>

            <div className="flex flex-wrap gap-4">
              <span className="px-4 py-2 bg-muted rounded-full text-muted-foreground text-sm">
                Logo Design
              </span>
              <span className="px-4 py-2 bg-muted rounded-full text-muted-foreground text-sm">
                Brand Identity
              </span>
              <span className="px-4 py-2 bg-muted rounded-full text-muted-foreground text-sm">
                Web Development
              </span>
              <span className="px-4 py-2 bg-muted rounded-full text-muted-foreground text-sm">
                Digital Marketing
              </span>
              <span className="px-4 py-2 bg-muted rounded-full text-muted-foreground text-sm">
                SEO
              </span>
              <span className="px-4 py-2 bg-muted rounded-full text-muted-foreground text-sm">
                Video Editing
              </span>
            </div>
          </div>

          {/* Right - Floating Tools */}
          <div ref={toolsRef} className="relative h-[400px] lg:h-[500px]">
            {/* Tool 1 - Pen Tool */}
            <div className="tool-item absolute top-0 left-0 w-32 h-32 lg:w-44 lg:h-44 transition-transform duration-500 hover:scale-110">
              <div className="w-full h-full glass rounded-3xl flex items-center justify-center p-4 glow-primary shine-hover overflow-hidden">
                <img src="/icons/pen.gif" alt="Pen Tool" className="w-full h-full object-contain pointer-events-none" />
              </div>
            </div>

            {/* Tool 2 - Selection Tool */}
            <div className="tool-item absolute top-10 right-0 w-28 h-28 lg:w-40 lg:h-40 transition-transform duration-500 hover:scale-110">
              <div className="w-full h-full glass rounded-3xl flex items-center justify-center p-4 glow-primary shine-hover overflow-hidden">
                <img src="/icons/layers-selection-tool.gif" alt="Selection Tool" className="w-full h-full object-contain pointer-events-none" />
              </div>
            </div>

            {/* Tool 3 - Text Tool */}
            <div className="tool-item absolute bottom-20 left-10 w-32 h-32 lg:w-44 lg:h-44 transition-transform duration-500 hover:scale-110">
              <div className="w-full h-full glass rounded-3xl flex items-center justify-center p-4 glow-primary shine-hover overflow-hidden">
                <img src="/icons/text-box.gif" alt="Text Tool" className="w-full h-full object-contain pointer-events-none" />
              </div>
            </div>

            {/* Tool 4 - Color Palette */}
            <div className="tool-item absolute bottom-0 right-10 w-28 h-28 lg:w-40 lg:h-40 transition-transform duration-500 hover:scale-110">
              <div className="w-full h-full glass rounded-3xl flex items-center justify-center p-4 glow-primary shine-hover overflow-hidden">
                <img src="/icons/paint-palette.gif" alt="Color Palette" className="w-full h-full object-contain pointer-events-none" />
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          </div>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="grid grid-cols-3 gap-8 mt-20 pt-16 border-t border-slate-800"
        >
          <div className="text-center">
            <div className="font-heading text-4xl sm:text-5xl font-bold text-gradient mb-2">
              <span className="stat-number" data-target="5">0</span>+
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">Years Experience</p>
          </div>
          <div className="text-center">
            <div className="font-heading text-4xl sm:text-5xl font-bold text-gradient mb-2">
              <span className="stat-number" data-target="100">0</span>+
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">Projects Completed</p>
          </div>
          <div className="text-center">
            <div className="font-heading text-4xl sm:text-5xl font-bold text-gradient mb-2">
              <span className="stat-number" data-target="50">0</span>+
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">Happy Clients</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
