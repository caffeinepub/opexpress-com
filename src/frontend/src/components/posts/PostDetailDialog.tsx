import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import type { Post } from '@/backend';
import { formatTimestamp } from '@/lib/utils';

interface PostDetailDialogProps {
    post: Post | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onHashtagClick: (hashtag: string) => void;
}

export default function PostDetailDialog({
    post,
    open,
    onOpenChange,
    onHashtagClick,
}: PostDetailDialogProps) {
    if (!post) return null;

    const hasMedia = !!post.media;
    const mediaUrl = hasMedia ? post.media!.getDirectURL() : null;
    const isVideo = mediaUrl?.includes('video') || mediaUrl?.match(/\.(mp4|webm|ogg)$/i);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto retro-panel">
                <DialogHeader>
                    <DialogTitle className="sr-only">Post Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Content */}
                    <p className="text-foreground whitespace-pre-wrap break-words text-lg font-mono">
                        {post.content}
                    </p>

                    {/* Media */}
                    {hasMedia && mediaUrl && (
                        <div className="retro-panel-inset overflow-hidden">
                            {isVideo ? (
                                <video
                                    src={mediaUrl}
                                    controls
                                    className="w-full h-auto"
                                />
                            ) : (
                                <img
                                    src={mediaUrl}
                                    alt="Post media"
                                    className="w-full h-auto object-contain"
                                />
                            )}
                        </div>
                    )}

                    {/* Hashtags */}
                    {post.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {post.hashtags.map((tag, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="retro-badge bg-accent text-accent-foreground cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                    onClick={() => {
                                        onHashtagClick(tag);
                                        onOpenChange(false);
                                    }}
                                >
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Timestamp */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t-4 border-border font-bold uppercase tracking-wide">
                        <Clock className="h-4 w-4" />
                        <span>{formatTimestamp(post.timestamp)}</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
