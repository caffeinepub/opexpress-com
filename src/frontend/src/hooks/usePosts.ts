import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Post } from '@/backend';

export function usePosts(hashtag: string | null = null) {
    const { actor, isFetching } = useActor();

    return useQuery<Post[]>({
        queryKey: ['posts', hashtag],
        queryFn: async () => {
            if (!actor) return [];
            
            if (hashtag) {
                return actor.getPostsByHashtag(hashtag);
            }
            
            const posts = await actor.getAllPosts();
            // Sort by timestamp descending (newest first)
            return posts.sort((a, b) => Number(b.timestamp - a.timestamp));
        },
        enabled: !!actor && !isFetching,
    });
}
