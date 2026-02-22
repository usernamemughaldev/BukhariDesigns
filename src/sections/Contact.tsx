import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, Mail, MapPin, Phone, Facebook, MessageCircle, Dribbble, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FormData {
  name: string;
  email: string;
  message: string;
}

function ContactInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  isTextarea = false,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isTextarea?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    if (lineRef.current) {
      gsap.to(lineRef.current, {
        scaleX: 1,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (lineRef.current && !value) {
      gsap.to(lineRef.current, {
        scaleX: 0,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  };

  const InputComponent = isTextarea ? 'textarea' : 'input';

  return (
    <div className="relative">
      <label
        className={`absolute left-0 transition-all duration-300 font-mono text-sm ${isFocused || value
          ? '-top-6 text-primary text-xs'
          : 'top-4 text-muted-foreground'
          }`}
      >
        {label}
      </label>
      <InputComponent
        ref={inputRef as any}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`w-full bg-transparent border-b border-border text-foreground py-4 focus:outline-none transition-colors duration-300 ${isTextarea ? 'resize-none min-h-[120px]' : ''
          }`}
        data-cursor-hover
      />
      <div
        ref={lineRef}
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary origin-left"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const form = formRef.current;
    const info = infoRef.current;

    if (!section || !heading || !form || !info) return;

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

      // Form animation
      gsap.fromTo(
        form,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: form,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Info animation
      gsap.fromTo(
        info.children,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: info,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setFormData({ name: '', email: '', message: '' });

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://web.facebook.com/bukhari.designz', label: 'Facebook' },
    { icon: MessageCircle, href: 'https://wa.me/19189531562', label: 'WhatsApp' },
    { icon: ExternalLink, href: 'https://www.freelancer.com/u/Bukhari690', label: 'Freelancer' },
    { icon: Dribbble, href: 'https://dribbble.com/ABukhari', label: 'Dribbble' },
  ];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-background" />

      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headingRef} className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-mono mb-6">
            Contact
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Let&apos;s Work <span className="text-gradient">Together</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? I&apos;d love to hear about it. Let&apos;s create
            something extraordinary together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            <ContactInput
              label="Your Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            <ContactInput
              label="Your Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

            <ContactInput
              label="Your Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              isTextarea
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-medium transition-all duration-300 hover:shadow-glow-lg disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              data-cursor-hover
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : submitSuccess ? (
                  <>
                    Message Sent!
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </span>

              {/* Button hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </form>

          {/* Contact Info */}
          <div ref={infoRef} className="space-y-8">
            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-foreground mb-1">Email</h4>
                  <a
                    href="mailto:adnanbukhari690@gmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    adnanbukhari690@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-foreground mb-1">Phone</h4>
                  <a
                    href="tel:+19189531562"
                    className="text-muted-foreground hover:text-secondary transition-colors duration-300"
                  >
                    +1 (918) 953-1562
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-foreground mb-1">Location</h4>
                  <p className="text-muted-foreground">
                    Available Worldwide
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-8 border-t border-border">
              <h4 className="font-heading font-bold text-foreground mb-4">Follow Me</h4>
              <div className="flex gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      className="w-12 h-12 rounded-xl bg-muted hover:bg-primary/20 flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-300 group"
                      data-cursor-hover
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Availability */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 font-mono text-sm">Available for work</span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Currently accepting new projects. Visit my Freelancer profile to discuss your ideas!
              </p>
              <a
                href="https://www.freelancer.com/u/Bukhari690"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:underline mb-4"
                data-cursor-hover
              >
                Hire me on Freelancer
                <ExternalLink className="w-4 h-4" />
              </a>
              <div className="pt-4 border-t border-border/50">
                <p className="text-primary font-medium text-sm">
                  Note: Payment will be after the Design.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
