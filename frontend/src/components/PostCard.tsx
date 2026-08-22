import React from 'react';
import type { CommunityPost, PostCategory } from '../types';

interface PostCardProps {
    post: CommunityPost;
}

const CATEGORY_LABEL: Record<PostCategory, string> = {
    PREVIEW: '프리뷰',
    CERTIFICATION: '직관인증',
    ETC: '기타',
};

const CATEGORY_CLASS: Record<PostCategory, string> = {
    PREVIEW: 'preview',
    CERTIFICATION: 'certification',
    ETC: 'etc',
};

export default function PostCard({ post }: PostCardProps): React.JSX.Element {
    return (
        <div className="post-card">
            <div className="post-card-top">
                <span className={`post-category-badge ${CATEGORY_CLASS[post.category]}`}>
                    {CATEGORY_LABEL[post.category]}
                </span>
                <span className="post-title">{post.title}</span>
            </div>
            <p className="post-content">{post.content}</p>
            <div className="post-meta">
                <span>{post.author}</span>
                <span>·</span>
                <span>{post.createdAt}</span>
                <span>·</span>
                <span>댓글 {post.commentCount}</span>
            </div>
        </div>
    );
}
