import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PostCard from './PostCard';
import { usePosts } from '@/hooks/usePosts';
import { useState } from 'react';
import PostDetailDialog from './PostDetailDialog';
import type { Post } from '@/backend';

interface PostFeedProps {
    selectedHashtag: string | null;
    onHashtagClick: (hashtag: string) => void;
}

export default function PostFeed({ selectedHashtag, onHashtagClick }: PostFeedProps) {
    const { data: posts, isLoading, error } = usePosts(selectedHashtag);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive" className="retro-panel bg-destructive text-destructive-foreground">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="font-bold uppercase tracking-wide">
                    Failed to load posts. Please try again later.
                </AlertDescription>
            </Alert>
        );
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="text-center py-12 retro-panel">
                <p className="text-muted-foreground text-xl font-bold uppercase tracking-wide">
                    {selectedHashtag
                        ? `No posts found with #${selectedHashtag}`
                        : 'No posts yet. Be the first to share something!'}
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {posts.map((post) => (
                    <PostCard
                        key={post.id.toString()}
                        post={post}
                        onHashtagClick={onHashtagClick}
                        onClick={() => setSelectedPost(post)}
                    />
                ))}
            </div>

            <PostDetailDialog
                post={selectedPost}
                open={!!selectedPost}
                onOpenChange={(open) => !open && setSelectedPost(null)}
                onHashtagClick={onHashtagClick}
            />
        </>
    );
}
