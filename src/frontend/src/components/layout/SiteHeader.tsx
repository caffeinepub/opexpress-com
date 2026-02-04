import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export default function SiteHeader() {
    const { theme, setTheme } = useTheme();

    return (
        <header className="sticky top-0 z-50 w-full retro-header">
            <div className="container mx-auto px-4 flex h-20 items-center justify-between max-w-4xl">
                <div className="flex items-center gap-3">
                    <img
                        src="/assets/generated/opexpress-wordmark-v2.dim_1200x300.png"
                        alt="OPExpress.com"
                        className="h-10 w-auto"
                        style={{
                            filter: 'drop-shadow(2px 2px 0 oklch(var(--primary))) drop-shadow(4px 4px 0 oklch(var(--secondary)))'
                        }}
                    />
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="retro-button bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </div>
        </header>
    );
}
