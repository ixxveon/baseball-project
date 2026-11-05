import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../api/memberApi';
import { clearAccessToken } from '../utils/tokenStorage';
import { getApiErrorMessage } from '../utils/apiError';

const PASSWORD_PATTERN = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;

interface PasswordForm {
    currentPassword: string;
    setCurrentPassword: (value: string) => void;
    newPassword: string;
    setNewPassword: (value: string) => void;
    confirmPassword: string;
    setConfirmPassword: (value: string) => void;
    errorMessage: string | null;
    submitPassword: () => Promise<void>;
}

export function usePasswordForm(): PasswordForm {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const findValidationError = (): string | null => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            return '모든 비밀번호 항목을 입력해주세요';
        }
        if (!PASSWORD_PATTERN.test(newPassword)) {
            return '새 비밀번호는 영문과 숫자를 포함해 8자 이상으로 입력해주세요';
        }
        if (newPassword !== confirmPassword) {
            return '새 비밀번호와 비밀번호 확인이 일치하지 않아요';
        }
        return null;
    };

    const submitPassword = async (): Promise<void> => {
        const validationError = findValidationError();
        setErrorMessage(validationError);
        if (validationError) {
            return;
        }

        try {
            await changePassword({ currentPassword, newPassword });
            clearAccessToken();
            alert('비밀번호가 변경되었어요. 새 비밀번호로 다시 로그인해주세요.');
            navigate('/login', { replace: true });
        } catch (error: unknown) {
            setErrorMessage(getApiErrorMessage(error, '비밀번호 변경에 실패했어요. 잠시 후 다시 시도해주세요'));
        }
    };

    return {
        currentPassword, setCurrentPassword,
        newPassword, setNewPassword,
        confirmPassword, setConfirmPassword,
        errorMessage, submitPassword,
    };
}