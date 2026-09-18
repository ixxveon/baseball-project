import React, { useState } from 'react';
import BackButton from './BackButton';
import type { CommunityPost, PostCategory, PostComment } from '../types';
import { getCurrentMemberId } from '../utils/currentUser';

interface PostDetailProps {
    post: CommunityPost;
    comments: PostComment[];
    onBack: () => void;
    onAddComment: (content: string) => void;
    onEdit: () => void;
    onDelete: () => void;
    onDeleteComment: (commentId: number) => void;
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

export default function PostDetail({ post, comments, onBack, onAddComment, onEdit, onDelete, onDeleteComment }: PostDetailProps): React.JSX.Element {
    const [commentInput, setCommentInput] = useState<string>('');
    const currentMemberId = getCurrentMemberId();
    const isAuthor = post.authorId === currentMemberId;

    const handleDelete = (): void => {
        if (window.confirm('게시글을 삭제할까요?')) {
            onDelete();
        }
    };

    const handleDeleteComment = (commentId: number): void => {
        if (window.confirm('댓글을 삭제할까요?')) {
            onDeleteComment(commentId);
        }
    };

    const handleSubmitComment = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        const trimmed = commentInput.trim();
        if (!trimmed) {
            return;
        }

        onAddComment(trimmed);
        setCommentInput('');
    };

    return (
        <div className="post-detail">
            <BackButton label="목록으로" onClick={onBack} />

            <div className="post-detail-card">
                <div className="post-card-top">
                    <span className={`post-category-badge ${CATEGORY_CLASS[post.category]}`}>
                        {CATEGORY_LABEL[post.category]}
                    </span>
                    <span className="post-title">{post.title}</span>
                    {isAuthor && (
                        <div className="post-detail-actions">
                            <button type="button" className="post-edit-btn" onClick={onEdit}>수정</button>
                            <button type="button" className="post-delete-btn" onClick={handleDelete}>삭제</button>
                        </div>
                    )}
                </div>
                <div className="post-meta">
                    <span>{post.author}</span>
                    <span>·</span>
                    <span>{post.createdAt}</span>
                </div>
                <p className="post-detail-content">{post.content}</p>
            </div>

            <div className="post-comment-section">
                <h3 className="post-comment-title">댓글 {comments.length}</h3>

                <form className="post-comment-form" onSubmit={handleSubmitComment}>
                    <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="댓글을 입력해주세요"
                    />
                    <button type="submit" className="post-comment-submit">등록</button>
                </form>

                <div className="post-comment-list">
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.id} className="post-comment-item">
                                <div className="post-comment-top">
                                    <span className="post-comment-author">{comment.author}</span>
                                    <span className="post-comment-date">{comment.createdAt}</span>
                                    {comment.authorId === currentMemberId && (
                                        <button
                                            type="button"
                                            className="post-comment-delete-btn"
                                            onClick={() => handleDeleteComment(comment.id)}
                                        >
                                            삭제
                                        </button>
                                    )}
                                </div>
                                <p className="post-comment-content">{comment.content}</p>
                            </div>
                        ))
                    ) : (
                        <p className="post-empty">아직 댓글이 없어요</p>
                    )}
                </div>
            </div>
        </div>
    );
}
