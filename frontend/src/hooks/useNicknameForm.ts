import { useRef, useState, type RefObject } from 'react';
import { checkNicknameAvailability, updateProfile } from '../api/memberApi';
import { getApiErrorMessage } from '../utils/apiError';

interface NicknameMessage {
    type: 'error' | 'success';
    text: string;
}

interface NicknameForm {
    nickname: string;
    changeInput: (nickname: string) => void;
    message: NicknameMessage | null;
    inputRef: RefObject<HTMLInputElement | null>;
    checkNickname: () => Promise<void>;
    changeNickname: () => Promise<void>;
}

export function useNicknameForm(): NicknameForm {
    const [nickname, setNickname] = useState('');
    const [checkedNickname, setCheckedNickname] = useState<string | null>(null);
    const [message, setMessage] = useState<NicknameMessage | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const showError = (text: string): void => {
        setMessage({ type: 'error', text });
        inputRef.current?.focus();
    };

    const changeInput = (value: string): void => {
        setNickname(value);
        setMessage(null);
    };

    const checkNickname = async (): Promise<void> => {
        const trimmedNickname = nickname.trim();

        if (trimmedNickname.length < 2 || trimmedNickname.length > 10) {
            showError('닉네임은 2~10자로 입력해주세요');
            return;
        }

        try {
            const available = await checkNicknameAvailability(trimmedNickname);
            if (available) {
                setCheckedNickname(trimmedNickname);
                setMessage({ type: 'success', text: '사용 가능한 닉네임이에요' });
            } else {
                setCheckedNickname(null);
                showError('이미 사용 중인 닉네임이에요');
            }
        } catch {
            showError('중복 확인에 실패했어요. 잠시 후 다시 시도해주세요');
        }
    };

    const changeNickname = async (): Promise<void> => {
        const trimmedNickname = nickname.trim();

        if (checkedNickname !== trimmedNickname) {
            showError('닉네임 중복 확인을 해주세요');
            return;
        }

        try {
            await updateProfile({ nickname: trimmedNickname });
            setMessage(null);
            alert('닉네임이 변경되었습니다.');
        } catch (error: unknown) {
            alert(getApiErrorMessage(error, '닉네임 변경에 실패했어요. 잠시 후 다시 시도해주세요'));
        }
    };

    return { nickname, changeInput, message, inputRef, checkNickname, changeNickname };
}
