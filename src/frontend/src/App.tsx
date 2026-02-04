import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import SiteHeader from './components/layout/SiteHeader';
import PostComposer from './components/posts/PostComposer';
import PostFeed from './components/posts/PostFeed';
import HashtagFilterBar from './components/posts/HashtagFilterBar';
import { Heart } from 'lucide-react';

function App() {
    const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="min-h-screen bg-background scanline-bg">
                <SiteHeader />
                
                <main className="container mx-auto px-4 py-8 max-w-4xl">
                    {/* Hero Section */}
                    <div className="mb-8 text-center retro-panel p-8">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-primary neon-glow uppercase tracking-wider">
                            Share Anonymously
                        </h1>
                        <p className="text-muted-foreground text-xl font-bold uppercase tracking-wide">
                            Post whatever you want - no login required
                        </p>
                    </div>

                    {/* Post Composer */}
                    <div className="mb-12">
                        <PostComposer />
                    </div>

                    {/* Hashtag Filter */}
                    <HashtagFilterBar
                        selectedHashtag={selectedHashtag}
                        onHashtagChange={setSelectedHashtag}
                    />

                    {/* Feed */}
                    <PostFeed
                        selectedHashtag={selectedHashtag}
                        onHashtagClick={setSelectedHashtag}
                    />
                </main>

                {/* Footer */}
                <footer className="border-t-4 border-border mt-16 py-8 bg-card">
                    <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                        <p className="flex items-center justify-center gap-2 font-bold uppercase tracking-wide">
                            © 2026. Built with <Heart className="w-4 h-4 text-secondary fill-secondary" /> using{' '}
                            <a
                                href="https://caffeine.ai"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline font-bold"
                            >
                                caffeine.ai
                            </a>
                        </p>
                    </div>
                </footer>

                <Toaster />
            </div>
        </ThemeProvider>
    );
}

export default App;
