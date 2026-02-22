import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, ExternalLink } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Works', href: '#works' },
  { label: 'Contact', href: '#contact' },
];

export function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // Show/hide navigation based on scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial animation
    gsap.fromTo(
      nav,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 1, ease: 'power3.out' }
    );

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border'
          : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a
              href="#hero"
              className="font-heading text-xl font-bold text-foreground"
              onClick={(e) => handleLinkClick(e, '#hero')}
              data-cursor-hover
            >
              Bukhari<span className="text-primary">.</span>Designs
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="relative text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm font-medium group"
                  data-cursor-hover
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              <a
                href="https://www.freelancer.com/u/Bukhari690"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-primary hover:opacity-90 text-white rounded-full text-sm font-medium transition-all duration-300 hover:glow-primary flex items-center gap-2"
                data-cursor-hover
              >
                Let&apos;s Talk
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-4 md:hidden">
              <ThemeToggle />
              <button
                className="w-10 h-10 flex items-center justify-center text-foreground"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                data-cursor-hover
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${isMobileMenuOpen ? 'visible' : 'invisible'
          }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-background/95 backdrop-blur-xl transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Content */}
        <div
          className={`absolute inset-x-0 top-20 p-8 transition-all duration-500 ${isMobileMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-10'
            }`}
        >
          <div className="flex flex-col gap-6">
            {navLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="font-heading text-3xl font-bold text-foreground hover:text-primary transition-colors duration-300"
                style={{
                  transitionDelay: `${index * 50}ms`,
                }}
              >
                {link.label}
              </a>
            ))}

            <a
              href="https://www.freelancer.com/u/Bukhari690"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 px-8 py-4 bg-primary text-white rounded-full text-center font-medium flex items-center justify-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Let&apos;s Talk
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navigation;
