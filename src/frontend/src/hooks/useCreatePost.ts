import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ExternalBlob } from '@/backend';

interface CreatePostParams {
    content: string;
    media: ExternalBlob | null;
}

export function useCreatePost() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ content, media }: CreatePostParams) => {
            if (!actor) {
                throw new Error('Actor not initialized');
            }
            return actor.createPost(content, media);
        },
        onSuccess: () => {
            // Invalidate all post queries to refetch
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
}
