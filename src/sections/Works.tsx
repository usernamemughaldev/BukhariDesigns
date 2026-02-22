import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, X, Download, LayoutGrid, ArrowLeft } from 'lucide-react';
import { projects, type Project } from '../data/projects';
import { AnimatePresence, motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({
  project,
  isActive,
  onClick,
}: {
  project: Project;
  isActive: boolean;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 30;
    const rotateY = (centerX - x) / 30;

    gsap.to(card, {
      rotateX: -rotateX,
      rotateY: rotateY,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  return (
    <div
      ref={cardRef}
      className={`project-card relative cursor-pointer transition-all duration-500 ${isActive ? 'z-20' : 'z-10'
        }`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor-hover
    >
      <div
        className={`relative overflow-hidden rounded-2xl transition-all duration-500 ${isActive ? 'scale-100' : 'scale-90 opacity-60'
          }`}
        style={{
          transformStyle: 'preserve-3d',
          boxShadow: isActive ? `0 25px 80px ${project.color}30` : 'none',
        }}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80" />

          {/* Glow effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at 50% 100%, ${project.color}20 0%, transparent 70%)`,
            }}
          />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-mono mb-3"
            style={{ backgroundColor: `${project.color}20`, color: project.color }}
          >
            {project.category}
          </span>

          <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
            {project.title}
          </h3>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {project.description}
          </p>

          <a
            href={project.link}
            className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-300"
            style={{ color: project.color }}
            onClick={(e) => e.stopPropagation()}
          >
            View Project
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

function ImageModal({
  project,
  isOpen,
  onClose,
}: {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!project) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = project.image;
    link.download = `${project.title.toLowerCase().replace(/\s+/g, '-')}-design.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-6xl aspect-[16/10] sm:aspect-video bg-card rounded-3xl overflow-hidden shadow-2xl border border-border"
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />

            {/* Modal Controls */}
            <div className="absolute top-6 right-6 flex gap-3">
              <button
                onClick={handleDownload}
                className="w-12 h-12 rounded-full bg-background/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-primary transition-colors duration-300"
                title="Download Image"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="w-12 h-12 rounded-full bg-background/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-destructive transition-colors duration-300"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 bg-gradient-to-t from-background/95 via-background/80 to-transparent">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] sm:text-xs font-mono mb-3 uppercase tracking-wider">
                {project.category}
              </span>
              <h3 className="font-heading text-xl sm:text-3xl font-bold text-foreground mb-2">
                {project.title}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl line-clamp-3 sm:line-clamp-none">
                {project.description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Works() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isGalleryView, setIsGalleryView] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dragStartX = useRef(0);
  const currentTranslate = useRef(0);

  const carouselProjects = projects.slice(0, 5);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const carousel = carouselRef.current;

    if (!section || !heading || !carousel) return;

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

      // Carousel entrance
      gsap.fromTo(
        carousel,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: carousel,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  // Handle carousel navigation
  const goToSlide = (index: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const cards = carousel.querySelectorAll('.project-card');
    const cardWidth = cards[0]?.clientWidth || 400;
    const gap = 32;
    const offset = (carousel.parentElement?.clientWidth || 0) / 2 - cardWidth / 2;

    setActiveIndex(index);

    gsap.to(carousel, {
      x: offset - index * (cardWidth + gap),
      duration: 0.8,
      ease: 'power3.out',
    });

    // Update card scales
    cards.forEach((card, i) => {
      gsap.to(card, {
        scale: i === index ? 1 : 0.9,
        opacity: i === index ? 1 : 0.6,
        duration: 0.5,
        ease: 'power2.out',
      });
    });
  };

  // Drag handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    dragStartX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
    currentTranslate.current = gsap.getProperty(carouselRef.current, 'x') as number;
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = currentX - dragStartX.current;

    gsap.set(carouselRef.current, {
      x: currentTranslate.current + diff,
    });
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    const currentX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = currentX - dragStartX.current;

    if (Math.abs(diff) > 100) {
      if (diff > 0 && activeIndex > 0) {
        goToSlide(activeIndex - 1);
      } else if (diff < 0 && activeIndex < projects.length - 1) {
        goToSlide(activeIndex + 1);
      } else {
        goToSlide(activeIndex);
      }
    } else {
      goToSlide(activeIndex);
    }
  };

  // Initialize carousel position
  useEffect(() => {
    const timer = setTimeout(() => {
      goToSlide(0);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const openProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const toggleGallery = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsGalleryView(!isGalleryView);
    // Refresh ScrollTrigger after layout change
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  return (
    <section
      ref={sectionRef}
      id="works"
      className="relative w-full py-24 lg:py-32 overflow-hidden bg-background"
    >
      {/* Large background text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden h-full flex items-center justify-center w-full">
        <span className="font-heading text-[20vw] font-bold text-muted/10 whitespace-nowrap uppercase">
          {isGalleryView ? 'GALLERY' : 'WORKS'}
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headingRef} className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-mono mb-6">
            Portfolio
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            {isGalleryView ? 'All Projects' : 'Selected '}
            <span className="text-gradient">
              {isGalleryView ? 'Gallery' : 'Works'}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isGalleryView
              ? 'Browse through my complete portfolio of creative designs, branding, and motion graphics.'
              : 'A curated collection of projects that showcase my expertise in design and creative problem-solving.'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isGalleryView ? (
            <motion.div
              key="carousel"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="relative"
            >
              {/* 3D Carousel */}
              <div
                className="relative overflow-hidden py-8"
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
              >
                <div
                  ref={carouselRef}
                  className="flex gap-8 px-4"
                  style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                >
                  {carouselProjects.map((project, index) => (
                    <div
                      key={project.id}
                      className="flex-shrink-0 w-[320px] sm:w-[400px] lg:w-[450px]"
                    >
                      <ProjectCard
                        project={project}
                        isActive={index === activeIndex}
                        onClick={() => openProject(project)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Dots */}
              <div className="flex justify-center gap-3 mt-8">
                {carouselProjects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeIndex
                      ? 'bg-primary w-8'
                      : 'bg-muted hover:bg-muted/80'
                      }`}
                    data-cursor-hover
                  />
                ))}
              </div>

              {/* View All CTA */}
              <div className="text-center mt-12">
                <button
                  onClick={toggleGallery}
                  className="inline-flex items-center gap-2 px-8 py-4 border border-border hover:border-primary text-muted-foreground hover:text-foreground rounded-full font-medium transition-all duration-300"
                  data-cursor-hover
                >
                  View All Projects
                  <LayoutGrid className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
            >
              {/* Back to Carousel button */}
              <button
                onClick={toggleGallery}
                className="mb-8 flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors duration-300"
                data-cursor-hover
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Selected Works
              </button>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    whileHover={{ y: -10 }}
                    className="group relative cursor-pointer aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-border"
                    onClick={() => openProject(project)}
                    data-cursor-hover
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Hover Glow */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `linear-gradient(to top, ${project.color}30, transparent)` }}
                    />

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <span className="text-primary text-[10px] font-mono mb-2 block uppercase tracking-wider">
                        {project.category}
                      </span>
                      <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground text-xs line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2">
                        {project.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Image Preview Modal */}
      <ImageModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}

export default Works;
