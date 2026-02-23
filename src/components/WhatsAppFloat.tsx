import { MessageCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function WhatsAppFloat() {
    const buttonRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        const button = buttonRef.current;
        if (!button) return;

        // Pulse animation
        gsap.to(button, {
            scale: 1.1,
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        });

        // Initial entrance
        gsap.fromTo(
            button,
            { scale: 0, opacity: 0, y: 50 },
            { scale: 1, opacity: 1, y: 0, duration: 1, delay: 2, ease: 'elastic.out(1, 0.5)' }
        );
    }, []);

    return (
        <a
            ref={buttonRef}
            href="https://wa.me/19189531562"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[100] w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-[#25D366]/40 transition-shadow duration-300 group"
            aria-label="Chat on WhatsApp"
            data-cursor-hover
        >
            <MessageCircle className="w-10 h-10 fill-white" />

            {/* Tooltip */}
            <div className="absolute right-full mr-4 px-4 py-2 bg-background border border-border rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap shadow-xl">
                <p className="text-sm font-medium">Chat with us</p>
            </div>
        </a>
    );
}
