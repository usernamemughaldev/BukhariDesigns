import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Palette, Layout, Film, Box, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';

const serviceDetails = {
    'brand-identity': {
        title: 'Brand Identity',
        icon: Palette,
        color: '#3B82F6',
        description: 'We build memorable brands from scratch with cohesive visual systems and strategic positioning. Our goal is to ensure your brand communicates the right message to the right audience.',
        fullContent: 'A strong brand identity is more than just a logo; it’s the heartbeat of your business. We dive deep into your brand’s values, mission, and audience to create a visual language that resonates and endures. From color palettes to typography and tone of voice, we ensure every touchpoint is consistent and premium.',
        features: [
            'Custom Logo Design',
            'Brand Style Documentation',
            'Business Card & Stationery',
            'Custom QR Code Integration',
            'Typography Selection',
            'Brand Strategy & Positioning'
        ],
        deliverables: ['Vector Source Files', 'Brand Guidelines PDF', 'Physical Samples (Mockups)', 'Social Media Kit']
    },
    'web-seo': {
        title: 'Web & SEO',
        icon: Layout,
        color: '#10B981',
        description: 'High-performance websites designed to convert visitors into customers. We combine stunning UI with robust development and SEO best practices.',
        fullContent: 'In the digital age, your website is often the first impression a customer has of your business. We create fast, responsive, and SEO-optimized sites that look as good as they perform. By integrating Google My Business and technical SEO, we make sure your business is found by those who need it most.',
        features: [
            'Responsive Web Design',
            'Custom Development',
            'Technical SEO Audits',
            'Google My Business Setup',
            'Performance Optimization',
            'CMS Integration'
        ],
        deliverables: ['Fully Functional Website', 'SEO Performance Report', 'Admin Dashboard Access', 'Training Documentation']
    },
    'visual-video': {
        title: 'Visual & Video',
        icon: Film,
        color: '#8B5CF6',
        description: 'Engaging visual content that captures attention and tells your story. We specialize in logo animation, video editing, and print design.',
        fullContent: 'Movement and visuals are the most effective way to grab attention in a crowded market. Whether it’s a high-impact logo animation or a professionally edited video for social media, we bring your message to life through dynamic visual storytelling and high-end graphic design.',
        features: [
            'Animated Logos',
            'Social Media Ads',
            'Promotional Rollups',
            'Flyer & Poster Design',
            'Video Color Grading',
            'Motion Micro-interactions'
        ],
        deliverables: ['High-Res Video Files', 'Scalable Vector Graphics', 'Print-Ready PDF Files', 'Source Project Files']
    },
    'marketing': {
        title: 'Marketing',
        icon: Box,
        color: '#F59E0B',
        description: 'Strategic marketing solutions to grow your online presence. From social media posts to lead generation, we handle it all.',
        fullContent: 'Great design needs a great audience. Our marketing strategies are focused on driving engagement and increasing leads. We manage your social media presence, execute targeted email campaigns, and implement growth hacks like Instagram follower optimization to ensure your business stays ahead.',
        features: [
            'Social Media Management',
            'Email Marketing Automation',
            'Instagram Growth Strategy',
            'Lead Generation Funnels',
            'Content Planning',
            'Monthly Analytics Reporting'
        ],
        deliverables: ['Social Content Calendar', 'Campaign Performance Reports', 'Targeted Lead Lists', 'Strategy Roadmap']
    }
};

export function ServicePage() {
    const { serviceId } = useParams();
    const service = serviceDetails[serviceId as keyof typeof serviceDetails];
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        gsap.fromTo(
            containerRef.current.children,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
        );
    }, [serviceId]);

    if (!service) return <div className="min-h-screen pt-32 text-center">Service not found</div>;

    const Icon = service.icon;

    return (
        <section ref={containerRef} className="relative min-h-screen pt-32 pb-24 px-4 overflow-hidden">
            {/* Decorative Background */}
            <div
                className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10"
                style={{ backgroundColor: service.color }}
            />

            <div className="max-w-5xl mx-auto relative z-10">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-12 group"
                    data-cursor-hover
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to Home
                </Link>

                <div className="grid lg:grid-cols-2 gap-16">
                    <div>
                        <div
                            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8"
                            style={{ backgroundColor: `${service.color}15` }}
                        >
                            <Icon className="w-10 h-10" style={{ color: service.color }} />
                        </div>
                        <h1 className="font-heading text-5xl sm:text-6xl font-bold mb-8 leading-tight">
                            {service.title}
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                            {service.description}
                        </p>
                        <div className="p-8 rounded-3xl glass border border-border/50">
                            <h3 className="font-heading text-xl font-bold mb-6">Key Offerings</h3>
                            <ul className="grid sm:grid-cols-2 gap-4">
                                {service.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: service.color }} />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-12">
                        <div className="prose prose-invert max-w-none">
                            <h3 className="font-heading text-2xl font-bold mb-6">Overview</h3>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                {service.fullContent}
                            </p>
                        </div>

                        <div className="space-y-6">
                            <h3 className="font-heading text-xl font-bold">Primary Deliverables</h3>
                            <div className="flex flex-wrap gap-3">
                                {service.deliverables.map((item, i) => (
                                    <span
                                        key={i}
                                        className="px-4 py-2 rounded-full border border-border bg-background/50 text-sm"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div
                            className="p-8 rounded-3xl text-white overflow-hidden relative group"
                            style={{ background: `linear-gradient(135deg, ${service.color}, ${service.color}dd)` }}
                        >
                            <div className="relative z-10">
                                <h3 className="font-heading text-2xl font-bold mb-4">Start your project today</h3>
                                <p className="mb-8 opacity-90">Ready to stand out? Let&apos;s turn your vision into a stunning reality.</p>
                                <a
                                    href="https://www.freelancer.com/u/Bukhari690"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:shadow-xl transition-all hover:scale-105"
                                    data-cursor-hover
                                >
                                    Hire on Freelancer
                                    <ArrowUpRight className="w-5 h-5" />
                                </a>
                            </div>
                            <Icon className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 rotate-12" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
