import React, { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import PostDetail from '../components/PostDetail';
import PostWriteForm from '../components/PostWriteForm';
import { createComment, createPost, deleteComment, deletePost, getComments, getPosts, updatePost } from '../api/communityApi';
import type { CommunityPost, PostCategory, PostComment } from '../types';

type CategoryFilter = PostCategory | 'ALL';
type ViewMode = 'list' | 'detail' | 'write' | 'edit';

const CATEGORY_TABS: { id: CategoryFilter; label: string }[] = [
    { id: 'ALL', label: '전체' },
    { id: 'PREVIEW', label: '프리뷰' },
    { id: 'CERTIFICATION', label: '직관인증' },
    { id: 'ETC', label: '기타' },
];

export default function CommunityScreen(): React.JSX.Element {
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [comments, setComments] = useState<PostComment[]>([]);
    const [activeCategory, setActiveCategory] = useState<CategoryFilter>('ALL');
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        let cancelled = false;

        async function loadPosts(): Promise<void> {
            setIsLoading(true);
            setError('');
            try {
                const data = await getPosts();
                if (!cancelled) {
                    setPosts(data);
                }
            } catch {
                if (!cancelled) {
                    setError('게시글을 불러오지 못했어요');
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        void loadPosts();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (selectedPostId === null) {
            return;
        }

        let cancelled = false;

        async function loadComments(): Promise<void> {
            try {
                const data = await getComments(selectedPostId as number);
                if (!cancelled) {
                    setComments(data);
                }
            } catch {
                if (!cancelled) {
                    setComments([]);
                }
            }
        }

        void loadComments();
        return () => {
            cancelled = true;
        };
    }, [selectedPostId]);

    // 게시글 클릭/글쓰기 진입마다 브라우저 히스토리를 쌓아서, 뒤로가기를 누르면
    // 커뮤니티 진입 전 페이지(마이페이지 등)로 바로 튕기지 않고 이전 화면(목록/상세)으로 돌아오게 한다.
    useEffect(() => {
        function handlePopState(event: PopStateEvent): void {
            const state = event.state as { view?: ViewMode; postId?: number } | null;
            if (state?.view === 'detail' || state?.view === 'edit') {
                setSelectedPostId(state.postId ?? null);
                setViewMode(state.view);
            } else if (state?.view === 'write') {
                setViewMode('write');
            } else {
                setSelectedPostId(null);
                setViewMode('list');
            }
        }

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const filteredPosts = activeCategory === 'ALL'
        ? posts
        : posts.filter((post) => post.category === activeCategory);

    const selectedPost = posts.find((post) => post.id === selectedPostId) ?? null;

    const handleSelectPost = (postId: number): void => {
        setSelectedPostId(postId);
        setViewMode('detail');
        window.history.pushState({ view: 'detail', postId }, '');
    };

    const goToWrite = (): void => {
        setViewMode('write');
        window.history.pushState({ view: 'write' }, '');
    };

    const goToEdit = (): void => {
        setViewMode('edit');
        window.history.pushState({ view: 'edit', postId: selectedPostId }, '');
    };

    const handleCreatePost = async (input: { category: PostCategory; title: string; content: string }): Promise<void> => {
        try {
            const newPost = await createPost({ gameId: 0, ...input });
            setPosts((prev) => [newPost, ...prev]);
            window.history.back();
            window.alert('게시글이 등록되었습니다');
        } catch {
            window.alert('게시글 등록에 실패했어요. 잠시 후 다시 시도해주세요');
        }
    };

    const handleUpdatePost = async (input: { category: PostCategory; title: string; content: string }): Promise<void> => {
        if (selectedPostId === null) {
            return;
        }

        try {
            const updated = await updatePost(selectedPostId, input);
            setPosts((prev) => prev.map((post) => (post.id === selectedPostId ? updated : post)));
            window.history.back();
            window.alert('게시글이 수정되었습니다');
        } catch {
            window.alert('게시글 수정에 실패했어요. 잠시 후 다시 시도해주세요');
        }
    };

    const handleDeletePost = async (): Promise<void> => {
        if (selectedPostId === null) {
            return;
        }

        try {
            await deletePost(selectedPostId);
            setPosts((prev) => prev.filter((post) => post.id !== selectedPostId));
            window.history.back();
            window.alert('게시글이 삭제되었습니다');
        } catch {
            window.alert('게시글 삭제에 실패했어요. 잠시 후 다시 시도해주세요');
        }
    };

    const handleAddComment = async (content: string): Promise<void> => {
        if (selectedPostId === null) {
            return;
        }

        try {
            const newComment = await createComment(selectedPostId, content);
            setComments((prev) => [...prev, newComment]);
            setPosts((prev) => prev.map((post) => (
                post.id === selectedPostId ? { ...post, commentCount: post.commentCount + 1 } : post
            )));
        } catch {
            window.alert('댓글 등록에 실패했어요. 잠시 후 다시 시도해주세요');
        }
    };

    const handleDeleteComment = async (commentId: number): Promise<void> => {
        if (selectedPostId === null) {
            return;
        }

        try {
            await deleteComment(selectedPostId, commentId);
            setComments((prev) => prev.filter((comment) => comment.id !== commentId));
            setPosts((prev) => prev.map((post) => (
                post.id === selectedPostId ? { ...post, commentCount: post.commentCount - 1 } : post
            )));
        } catch {
            window.alert('댓글 삭제에 실패했어요. 잠시 후 다시 시도해주세요');
        }
    };

    if (viewMode === 'write') {
        return (
            <div className="community-container">
                <PostWriteForm
                    onSubmit={(input) => { void handleCreatePost(input); }}
                    onCancel={() => window.history.back()}
                />
            </div>
        );
    }

    if (viewMode === 'edit' && selectedPost) {
        return (
            <div className="community-container">
                <PostWriteForm
                    heading="게시글 수정"
                    submitLabel="수정하기"
                    initialCategory={selectedPost.category}
                    initialTitle={selectedPost.title}
                    initialContent={selectedPost.content}
                    onSubmit={(input) => { void handleUpdatePost(input); }}
                    onCancel={() => window.history.back()}
                />
            </div>
        );
    }

    if (viewMode === 'detail' && selectedPost) {
        return (
            <div className="community-container">
                <PostDetail
                    post={selectedPost}
                    comments={comments}
                    onBack={() => window.history.back()}
                    onAddComment={(content) => { void handleAddComment(content); }}
                    onEdit={goToEdit}
                    onDelete={() => { void handleDeletePost(); }}
                    onDeleteComment={(commentId) => { void handleDeleteComment(commentId); }}
                />
            </div>
        );
    }

    return (
        <div className="community-container">
            <div className="community-header">
                <h1 className="community-title">커뮤니티</h1>
                <button type="button" className="write-btn" onClick={goToWrite}>글쓰기</button>
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
                {isLoading ? (
                    <p className="post-empty">불러오는 중...</p>
                ) : error ? (
                    <p className="post-empty">{error}</p>
                ) : filteredPosts.length > 0 ? (
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
