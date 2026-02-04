export interface ValidationResult {
    valid: boolean;
    error?: string;
}

export function validatePost(content: string, mediaFile: File | null): ValidationResult {
    // Trim content
    const trimmedContent = content.trim();

    // Check if both content and media are empty
    if (!trimmedContent && !mediaFile) {
        return {
            valid: false,
            error: 'Please add some content or media to your post',
        };
    }

    // Check content length (optional, reasonable limit)
    if (trimmedContent.length > 5000) {
        return {
            valid: false,
            error: 'Post content is too long (max 5000 characters)',
        };
    }

    // Validate media file if present
    if (mediaFile) {
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (mediaFile.size > maxSize) {
            return {
                valid: false,
                error: 'Media file is too large (max 50MB)',
            };
        }

        const isImage = mediaFile.type.startsWith('image/');
        const isVideo = mediaFile.type.startsWith('video/');

        if (!isImage && !isVideo) {
            return {
                valid: false,
                error: 'Only image and video files are supported',
            };
        }
    }

    return { valid: true };
}
