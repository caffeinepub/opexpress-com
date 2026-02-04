import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type PostId = bigint;
export interface Post {
    id: PostId;
    media?: ExternalBlob;
    content: string;
    hashtags: Array<string>;
    timestamp: bigint;
}
export interface backendInterface {
    createPost(content: string, media: ExternalBlob | null): Promise<PostId>;
    getAllPosts(): Promise<Array<Post>>;
    getPost(id: PostId): Promise<Post>;
    getPostsByHashtag(hashtag: string): Promise<Array<Post>>;
}
