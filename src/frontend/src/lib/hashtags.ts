export function parseHashtags(input: string): string[] {
    if (!input.trim()) return [];

    // Split by spaces and filter hashtags
    const tags = input
        .split(/\s+/)
        .map((word) => word.trim())
        .filter((word) => word.startsWith('#') && word.length > 1)
        .map((tag) => normalizeHashtag(tag))
        .filter((tag): tag is string => tag !== null);

    // Remove duplicates
    return Array.from(new Set(tags));
}

export function normalizeHashtag(tag: string): string | null {
    // Remove all # symbols and trim
    const cleaned = tag.replace(/#/g, '').trim().toLowerCase();
    
    if (!cleaned) return null;
    
    // Remove special characters except alphanumeric and underscore
    const normalized = cleaned.replace(/[^a-z0-9_]/g, '');
    
    return normalized || null;
}
