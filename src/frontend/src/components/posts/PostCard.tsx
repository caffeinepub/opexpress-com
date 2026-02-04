import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import type { Post } from '@/backend';
import { formatTimestamp } from '@/lib/utils';

interface PostCardProps {
    post: Post;
    onHashtagClick: (hashtag: string) => void;
    onClick?: () => void;
}

export default function PostCard({ post, onHashtagClick, onClick }: PostCardProps) {
    const hasMedia = !!post.media;
    const mediaUrl = hasMedia ? post.media!.getDirectURL() : null;

    // Determine media type from URL
    const isVideo = mediaUrl?.includes('video') || mediaUrl?.match(/\.(mp4|webm|ogg)$/i);

    return (
        <Card
            className="retro-panel hover:translate-x-1 hover:translate-y-1 transition-transform cursor-pointer animate-fade-in"
            onClick={onClick}
        >
            <CardContent className="pt-6">
                {/* Content */}
                <p className="text-foreground whitespace-pre-wrap break-words mb-4 font-mono text-base">
                    {post.content}
                </p>

                {/* Media */}
                {hasMedia && mediaUrl && (
                    <div className="mb-4 retro-panel-inset overflow-hidden">
                        {isVideo ? (
                            <video
                                src={mediaUrl}
                                controls
                                className="w-full h-auto max-h-96"
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <img
                                src={mediaUrl}
                                alt="Post media"
                                className="w-full h-auto max-h-96 object-contain"
                            />
                        )}
                    </div>
                )}

                {/* Hashtags */}
                {post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {post.hashtags.map((tag, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="retro-badge bg-accent text-accent-foreground cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onHashtagClick(tag);
                                }}
                            >
                                #{tag}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Timestamp */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase tracking-wide">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimestamp(post.timestamp)}</span>
                </div>
            </CardContent>
        </Card>
    );
}
