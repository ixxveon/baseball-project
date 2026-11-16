import { useLocation, useNavigate } from 'react-router-dom';

export interface LoginRedirectState {
    from?: string;
}

// 로그인 화면으로 보내면서 현재 위치를 넘겨, 로그인 후 원래 화면으로 돌아오게 한다.
export function useLoginRedirect(): () => void {
    const navigate = useNavigate();
    const location = useLocation();

    return (): void => {
        const state: LoginRedirectState = { from: `${location.pathname}${location.search}` };
        navigate('/login', { state });
    };
}
