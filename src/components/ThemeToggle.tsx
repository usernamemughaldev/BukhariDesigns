import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 transition-all duration-300 hover:scale-110 active:scale-95 border border-slate-200 dark:border-slate-700 hover:shadow-lg dark:hover:shadow-glow-indigo/20 group relative overflow-hidden"
            aria-label="Toggle theme"
            data-cursor-hover
        >
            <div className="relative z-10">
                {theme === 'dark' ? (
                    <Sun className="w-5 h-5 transition-transform duration-500 rotate-0 scale-100 group-hover:rotate-45" />
                ) : (
                    <Moon className="w-5 h-5 transition-transform duration-500 rotate-0 scale-100 group-hover:-rotate-12" />
                )}
            </div>

            {/* Background flare */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/0 via-indigo-500/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:via-indigo-500/5 group-hover:to-pink-500/10 transition-all duration-500" />
        </button>
    );
}

export default ThemeToggle;
