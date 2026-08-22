import React, { useState } from 'react';
import BackButton from './BackButton';
import type { PostCategory } from '../types';

interface PostWriteFormProps {
    onSubmit: (input: { category: PostCategory; title: string; content: string }) => void;
    onCancel: () => void;
}

const CATEGORY_OPTIONS: { id: PostCategory; label: string }[] = [
    { id: 'PREVIEW', label: '프리뷰' },
    { id: 'CERTIFICATION', label: '직관인증' },
    { id: 'ETC', label: '기타' },
];

export default function PostWriteForm({ onSubmit, onCancel }: PostWriteFormProps): React.JSX.Element {
    const [category, setCategory] = useState<PostCategory>('PREVIEW');
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            setError('제목과 내용을 모두 입력해주세요');
            return;
        }

        onSubmit({ category, title: title.trim(), content: content.trim() });
    };

    return (
        <form className="post-write-form" onSubmit={handleSubmit} noValidate>
            <BackButton label="목록으로" onClick={onCancel} />

            <h2 className="community-title">글쓰기</h2>

            <div className="community-category-tabs">
                {CATEGORY_OPTIONS.map((option) => (
                    <button
                        key={option.id}
                        type="button"
                        className={`category-tab ${category === option.id ? 'active' : ''}`}
                        onClick={() => setCategory(option.id)}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            <div className="post-write-field">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력해주세요"
                />
            </div>

            <div className="post-write-field">
                <textarea
                    className="post-write-textarea"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="내용을 입력해주세요"
                    rows={8}
                />
            </div>

            {error && <p className="post-write-error">{error}</p>}

            <button type="submit" className="write-btn post-write-submit">등록하기</button>
        </form>
    );
}
