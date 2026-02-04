import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Image, Video, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useCreatePost } from '@/hooks/useCreatePost';
import { validatePost } from '@/lib/validation';
import { parseHashtags } from '@/lib/hashtags';
import { ExternalBlob } from '@/backend';

export default function PostComposer() {
    const [content, setContent] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const createPostMutation = useCreatePost();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');

        if (!isImage && !isVideo) {
            toast.error('Please select an image or video file');
            return;
        }

        setMediaFile(file);
        setMediaType(isImage ? 'image' : 'video');

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setMediaPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const clearMedia = () => {
        setMediaFile(null);
        setMediaPreview(null);
        setMediaType(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate
        const validation = validatePost(content, mediaFile);
        if (!validation.valid) {
            toast.error(validation.error);
            return;
        }

        try {
            let mediaBlob: ExternalBlob | null = null;

            if (mediaFile) {
                const arrayBuffer = await mediaFile.arrayBuffer();
                const uint8Array = new Uint8Array(arrayBuffer);
                mediaBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
                    setUploadProgress(percentage);
                });
            }

            // Combine content with hashtags
            const parsedHashtags = parseHashtags(hashtags);
            const fullContent = parsedHashtags.length > 0
                ? `${content} ${parsedHashtags.map(tag => `#${tag}`).join(' ')}`
                : content;

            await createPostMutation.mutateAsync({
                content: fullContent,
                media: mediaBlob
            });

            // Reset form
            setContent('');
            setHashtags('');
            clearMedia();
            toast.success('Post created successfully!');
        } catch (error) {
            console.error('Failed to create post:', error);
            toast.error('Failed to create post. Please try again.');
        }
    };

    const isSubmitting = createPostMutation.isPending;

    return (
        <Card className="retro-panel">
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="content" className="sr-only">
                            What's on your mind?
                        </Label>
                        <Textarea
                            id="content"
                            placeholder="What's on your mind? Share your thoughts, rants, memes..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[120px] resize-none text-base retro-input font-mono"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <Label htmlFor="hashtags" className="text-sm text-muted-foreground mb-2 block font-bold uppercase tracking-wide">
                            Hashtags (optional)
                        </Label>
                        <Input
                            id="hashtags"
                            placeholder="#music #rant #meme"
                            value={hashtags}
                            onChange={(e) => setHashtags(e.target.value)}
                            disabled={isSubmitting}
                            className="retro-input font-mono"
                        />
                    </div>

                    {/* Media Preview */}
                    {mediaPreview && (
                        <div className="relative retro-panel-inset overflow-hidden">
                            {mediaType === 'image' && (
                                <img
                                    src={mediaPreview}
                                    alt="Preview"
                                    className="w-full h-auto max-h-96 object-contain"
                                />
                            )}
                            {mediaType === 'video' && (
                                <video
                                    src={mediaPreview}
                                    controls
                                    className="w-full h-auto max-h-96"
                                />
                            )}
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 retro-button"
                                onClick={clearMedia}
                                disabled={isSubmitting}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                            {isSubmitting && uploadProgress > 0 && uploadProgress < 100 && (
                                <div className="absolute bottom-0 left-0 right-0 h-2 bg-muted border-t-2 border-border">
                                    <div
                                        className="h-full bg-primary transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex gap-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleFileSelect}
                                className="hidden"
                                disabled={isSubmitting}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isSubmitting || !!mediaFile}
                                className="retro-button bg-accent text-accent-foreground"
                            >
                                <Image className="h-4 w-4 mr-2" />
                                Image
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isSubmitting || !!mediaFile}
                                className="retro-button bg-accent text-accent-foreground"
                            >
                                <Video className="h-4 w-4 mr-2" />
                                Video
                            </Button>
                        </div>

                        <Button 
                            type="submit" 
                            disabled={isSubmitting} 
                            className="min-w-24 retro-button bg-primary text-primary-foreground"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                'Post'
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
