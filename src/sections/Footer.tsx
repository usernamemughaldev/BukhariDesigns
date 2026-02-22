import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUp, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const button = buttonRef.current;

    if (!footer || !button) return;

    const ctx = gsap.context(() => {
      // Footer reveal animation
      gsap.fromTo(
        footer,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Back to top button magnetic effect
      const handleMouseMove = (e: MouseEvent) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(button, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3,
          ease: 'power2.out',
        });
      };

      const handleMouseLeave = () => {
        gsap.to(button, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)',
        });
      };

      button.addEventListener('mousemove', handleMouseMove);
      button.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        button.removeEventListener('mousemove', handleMouseMove);
        button.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, footer);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Works', href: '#works' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative w-full py-12 lg:py-16 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-background border-t border-border" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          {/* Logo & Copyright */}
          <div className="text-center lg:text-left">
            <a
              href="#hero"
              className="font-heading text-2xl font-bold text-foreground inline-block mb-2"
              data-cursor-hover
            >
              Bukhari<span className="text-primary">.</span>Designs
            </a>
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Bukhari Designs. All rights reserved.
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm"
                data-cursor-hover
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Back to Top */}
          <button
            ref={buttonRef}
            onClick={scrollToTop}
            className="w-14 h-14 rounded-full bg-primary hover:opacity-90 flex items-center justify-center text-white transition-all duration-300 hover:shadow-glow-lg"
            data-cursor-hover
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-secondary fill-secondary" /> for you
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors duration-300">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
