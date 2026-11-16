import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage(): React.JSX.Element {
    return (
        <div className="not-found-container">
            <p className="not-found-code">404</p>
            <h1 className="not-found-title">페이지를 찾을 수 없어요</h1>
            <p className="not-found-description">
                주소가 잘못되었거나, 페이지가 이동 또는 삭제되었어요.
            </p>
            <Link to="/" className="not-found-home-btn">
                홈으로 가기
            </Link>
        </div>
    );
}