import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Palette, Layout, Film, Box, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// Icon Wrapper Component
function IconWrapper({
  icon: Icon,
  className
}: {
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <span className={className}>
      <Icon className="w-full h-full" />
    </span>
  );
}

interface Service {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  features: string[];
  color: string;
}

const services: Service[] = [
  {
    id: 'brand-identity',
    icon: Palette,
    title: 'Brand Identity',
    description: 'Creating memorable logos and complete branding systems that build trust.',
    features: ['Logo Design', 'Brand Identity', 'Business Cards', 'QR Code'],
    color: '#3B82F6', // Royal Blue
  },
  {
    id: 'web-seo',
    icon: Layout,
    title: 'Web & SEO',
    description: 'High-performance websites designed to convert visitors into customers.',
    features: ['Web Design', 'Development', 'SEO', 'Google Business'],
    color: '#10B981', // Emerald Green
  },
  {
    id: 'visual-video',
    icon: Film,
    title: 'Visual & Video',
    description: 'Engaging visual content that captures attention and tells your story.',
    features: ['Logo Animation', 'Video Editing', 'Flyer Design', 'Poster Design'],
    color: '#8B5CF6', // Vivid Purple
  },
  {
    id: 'marketing',
    icon: Box,
    title: 'Marketing',
    description: 'Strategic marketing solutions to grow your online presence.',
    features: ['Social Media', 'Email Marketing', 'Lead Generation', 'Instagram Growth'],
    color: '#F59E0B', // Bright Orange
  },
];

function ServiceCard({ service }: { service: Service }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.3,
      ease: 'power2.out',
    });

    // Update glow position
    const glow = card.querySelector('.card-glow') as HTMLDivElement;
    if (glow) {
      gsap.to(glow, {
        left: x,
        top: y,
        duration: 0.6,
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    const card = cardRef.current;
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)',
    });
  };

  const Icon = service.icon;

  return (
    <div
      ref={cardRef}
      className="card-3d relative group cursor-pointer"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(`/services/${service.id}`)}
      data-cursor-card
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/services/${service.id}`)}
    >
      <div
        className="relative h-full p-8 rounded-3xl glass transition-all duration-500 overflow-hidden border border-border"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Solid Background Color on Hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            backgroundColor: `${service.color}15`,
          }}
        />

        {/* Mouse Follow Glow (Simplified to service color) */}
        <div
          className="card-glow absolute w-[350px] h-[350px] -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none blur-[100px]"
          style={{
            background: `radial-gradient(circle, ${service.color}30 0%, transparent 70%)`,
            zIndex: 0,
          }}
        />

        {/* Icon */}
        <div
          className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110"
          style={{
            backgroundColor: isHovered ? `${service.color}20` : 'var(--muted)',
            color: isHovered ? service.color : 'var(--muted-foreground)'
          }}
        >
          <IconWrapper icon={Icon} className="w-8 h-8" />

          {/* Animated ring */}
          <div
            className="absolute inset-0 rounded-2xl border-2 opacity-0 group-hover:opacity-100 transition-all duration-500"
            style={{
              borderColor: service.color,
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            }}
          />
        </div>

        {/* Content */}
        <h3 className="font-heading text-2xl font-bold text-foreground mb-4 group-hover:text-gradient transition-all duration-300">
          {service.title}
        </h3>

        <p className="text-muted-foreground mb-6 leading-relaxed">
          {service.description}
        </p>

        {/* Features */}
        <ul className="space-y-2 mb-8">
          {service.features.map((feature, i) => (
            <li
              key={i}
              className="flex items-center gap-2 text-sm text-muted-foreground/80"
              style={{
                transitionDelay: `${i * 50}ms`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: service.color }}
              />
              {feature}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: service.color }}
        >
          <span>Learn More</span>
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>

        {/* Corner accent */}
        <div
          className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, transparent 50%, ${service.color}10 50%)`,
          }}
        />
      </div>
    </div>
  );
}

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const cards = cardsRef.current;

    if (!section || !heading || !cards) return;

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        heading.children,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards stagger animation
      const cardElements = cards.querySelectorAll('.service-card');
      gsap.fromTo(
        cardElements,
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cards,
            start: 'top 75%',
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
      id="services"
      className="relative w-full py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-background" />

      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headingRef} className="text-center mb-16 lg:mb-20">
          <span className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-mono mb-6">
            My Expertise
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Services I <span className="text-gradient">Offer</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From concept to completion, I provide end-to-end design solutions
            that help businesses stand out in the digital landscape.
          </p>
        </div>

        {/* Service Cards Grid */}
        <div
          ref={cardsRef}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6">
            Have a project in mind? Let&apos;s discuss how I can help.
          </p>
          <a
            href="https://www.freelancer.com/u/Bukhari690"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-medium transition-all duration-300 hover:shadow-glow-lg hover:scale-105"
            data-cursor-hover
          >
            Hire me on Freelancer
            <ArrowUpRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default Services;
