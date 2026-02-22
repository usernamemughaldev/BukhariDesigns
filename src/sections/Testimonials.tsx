import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Star, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  id: number;
  name: string;
  username: string;
  location: string;
  content: string;
  rating: number;
  avatar: string;
  platform: string;
  project: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Matt S.',
    username: '@blake24',
    location: 'New Brunswick, US',
    content: "Always great working together! Extremely professional, easy to communicate with, and consistently delivers high-quality work on time. A reliable partner I'm always happy to collaborate with.",
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
    platform: 'Freelancer',
    project: 'Design Project',
  },
  {
    id: 2,
    name: 'Matt S.',
    username: '@blake24',
    location: 'New Brunswick, US',
    content: 'It was good working with him, quick to reply and adjust work per the feedback provided, would continue to work with him.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    platform: 'Freelancer',
    project: 'Social Media Video Editing',
  },
  {
    id: 3,
    name: 'Steve F.',
    username: '@stevefrancis95',
    location: 'Sammamish, US',
    content: "Adnan is very proficient with figma and is an excellent designer. I'm not sure how many projects he has done for me now but as long as he's available, he will get all my design work. Great communicator and also very flexible with when he is able to meet and work.",
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    platform: 'Freelancer',
    project: 'Figma for AI Features',
  },
  {
    id: 4,
    name: 'Michael L.',
    username: '@freelance1976',
    location: 'Lemon Grove, US',
    content: 'Muhammad provided me with a great logo! Love it. He gave me a very nice concept and I asked him to revise it multiple times until I got what I liked. He was quick with his work and would highly recommend. Thanks Muhammad :)',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    platform: 'Freelancer',
    project: 'Seeking New Logo',
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="testimonial-card glass rounded-3xl p-8 relative overflow-hidden group glow-primary shine-hover transition-all duration-500">
      {/* Quote icon */}
      <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
        <Quote className="w-16 h-16 text-primary" />
      </div>

      {/* Rating */}
      <div className="flex gap-1 mb-6">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-primary text-primary" />
        ))}
      </div>

      {/* Content */}
      <p className="text-muted-foreground text-lg leading-relaxed mb-8 relative z-10">
        &ldquo;{testimonial.content}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-primary/30"
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20" />
        </div>
        <div>
          <h4 className="font-heading font-bold text-foreground flex items-center gap-2">
            {testimonial.name}
            <span className="text-xs font-normal text-muted-foreground">{testimonial.username}</span>
          </h4>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            <MapPin className="w-3 h-3 text-primary" /> {testimonial.location}
          </p>
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </div>
  );
}

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 }
    }
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = (api: any) => {
    setSelectedIndex(api.selectedScrollSnap());
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  };

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi]);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;

    if (!section || !heading) return;

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
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();
  const scrollTo = (index: number) => emblaApi && emblaApi.scrollTo(index);

  const scrollSnaps = emblaApi ? emblaApi.scrollSnapList() : [];

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative w-full py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-background" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headingRef} className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-mono mb-6">
            Testimonials
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Client <span className="text-gradient">Stories</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don&apos;t just take my word for it. Here&apos;s what my clients have to say
            about working together.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="flex-[0_0_100%] md:flex-[0_0_50%] min-w-0 pl-4 md:pl-6 lg:pl-8">
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            onClick={scrollPrev}
            className={`w-12 h-12 rounded-full border border-border flex items-center justify-center transition-all duration-300 ${!canScrollPrev ? 'opacity-30 cursor-not-allowed' : 'hover:border-primary text-muted-foreground hover:text-foreground'
              }`}
            disabled={!canScrollPrev}
            data-cursor-hover
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === selectedIndex ? 'bg-primary w-6' : 'bg-muted hover:bg-muted/80'
                  }`}
                data-cursor-hover
              />
            ))}
          </div>

          <button
            onClick={scrollNext}
            className={`w-12 h-12 rounded-full border border-border flex items-center justify-center transition-all duration-300 ${!canScrollNext ? 'opacity-30 cursor-not-allowed' : 'hover:border-primary text-muted-foreground hover:text-foreground'
              }`}
            disabled={!canScrollNext}
            data-cursor-hover
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Trust badges */}
        <div className="mt-20 pt-16 border-t border-border">
          <p className="text-center text-muted-foreground/60 text-sm mb-8">
            Trusted by leading companies worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-50">
            {['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta'].map((company) => (
              <span
                key={company}
                className="font-heading text-xl lg:text-2xl font-bold text-slate-600"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
