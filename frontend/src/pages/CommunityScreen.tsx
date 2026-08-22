import React, { useState } from 'react';
import PostCard from '../components/PostCard';
import PostDetail from '../components/PostDetail';
import PostWriteForm from '../components/PostWriteForm';
import { communityPostsData } from '../data/communityPosts';
import { communityCommentsData } from '../data/communityComments';
import type { CommunityPost, PostCategory, PostComment } from '../types';

type CategoryFilter = PostCategory | 'ALL';
type ViewMode = 'list' | 'detail' | 'write';

const CATEGORY_TABS: { id: CategoryFilter; label: string }[] = [
    { id: 'ALL', label: '전체' },
    { id: 'PREVIEW', label: '프리뷰' },
    { id: 'CERTIFICATION', label: '직관인증' },
    { id: 'ETC', label: '기타' },
];

export default function CommunityScreen(): React.JSX.Element {
    const [posts, setPosts] = useState<CommunityPost[]>(communityPostsData);
    const [comments, setComments] = useState<PostComment[]>(communityCommentsData);
    const [activeCategory, setActiveCategory] = useState<CategoryFilter>('ALL');
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

    const filteredPosts = activeCategory === 'ALL'
        ? posts
        : posts.filter((post) => post.category === activeCategory);

    const selectedPost = posts.find((post) => post.id === selectedPostId) ?? null;
    const selectedComments = comments.filter((comment) => comment.postId === selectedPostId);

    const handleSelectPost = (postId: number): void => {
        setSelectedPostId(postId);
        setViewMode('detail');
    };

    const handleCreatePost = (input: { category: PostCategory; title: string; content: string }): void => {
        const newPost: CommunityPost = {
            id: Math.max(...posts.map((post) => post.id)) + 1,
            gameId: 0,
            category: input.category,
            title: input.title,
            content: input.content,
            author: '나',
            createdAt: '방금 전',
            commentCount: 0,
        };
        setPosts((prev) => [newPost, ...prev]);
        setViewMode('list');
    };

    const handleAddComment = (content: string): void => {
        if (selectedPostId === null) {
            return;
        }

        const newComment: PostComment = {
            id: Math.max(0, ...comments.map((comment) => comment.id)) + 1,
            postId: selectedPostId,
            author: '나',
            content,
            createdAt: '방금 전',
        };
        setComments((prev) => [...prev, newComment]);
        setPosts((prev) => prev.map((post) => (
            post.id === selectedPostId ? { ...post, commentCount: post.commentCount + 1 } : post
        )));
    };

    if (viewMode === 'write') {
        return (
            <PostWriteForm
                onSubmit={handleCreatePost}
                onCancel={() => setViewMode('list')}
            />
        );
    }

    if (viewMode === 'detail' && selectedPost) {
        return (
            <PostDetail
                post={selectedPost}
                comments={selectedComments}
                onBack={() => setViewMode('list')}
                onAddComment={handleAddComment}
            />
        );
    }

    return (
        <div className="community-container">
            <div className="community-header">
                <h1 className="community-title">커뮤니티</h1>
                <button type="button" className="write-btn" onClick={() => setViewMode('write')}>글쓰기</button>
            </div>

            <div className="community-category-tabs">
                {CATEGORY_TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        className={`category-tab ${activeCategory === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveCategory(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="post-list">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <div key={post.id} onClick={() => handleSelectPost(post.id)}>
                            <PostCard post={post} />
                        </div>
                    ))
                ) : (
                    <p className="post-empty">아직 작성된 게시글이 없어요</p>
                )}
            </div>
        </div>
    );
}
