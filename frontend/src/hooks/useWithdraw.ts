import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { withdraw } from '../api/memberApi';
import { clearAccessToken } from '../utils/tokenStorage';

interface WithdrawAction {
    isWithdrawing: boolean;
    withdrawAccount: () => Promise<void>;
}

export function useWithdraw(): WithdrawAction {
    const navigate = useNavigate();
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const withdrawAccount = async (): Promise<void> => {
        const confirmed = window.confirm("정말 탈퇴하시겠어요? 탈퇴 후에는 로그인할 수 없고, 작성한 게시글과 댓글은 '탈퇴한 회원'으로 표시되어 남아요.");
        if (!confirmed || isWithdrawing) {
            return;
        }

        setIsWithdrawing(true);
        try {
            await withdraw();
            clearAccessToken();
            alert('회원 탈퇴가 완료되었습니다.');
            navigate('/', { replace: true });
        } catch {
            alert('회원 탈퇴에 실패했어요. 잠시 후 다시 시도해주세요');
        } finally {
            setIsWithdrawing(false);
        }
    };

    return { isWithdrawing, withdrawAccount };
}