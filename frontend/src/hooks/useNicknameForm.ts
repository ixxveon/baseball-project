import { useState } from 'react';
import { checkNicknameAvailability, updateProfile } from '../api/memberApi';
import { getApiErrorMessage } from '../utils/apiError';

interface NicknameForm {
    nickname: string;
    setNickname: (nickname: string) => void;
    checkNickname: () => Promise<void>;
    changeNickname: () => Promise<void>;
}

export function useNicknameForm(): NicknameForm {
    const [nickname, setNickname] = useState('');
    const [checkedNickname, setCheckedNickname] = useState<string | null>(null);

    const checkNickname = async (): Promise<void> => {
        const trimmedNickname = nickname.trim();

        if (trimmedNickname.length < 2 || trimmedNickname.length > 10) {
            alert('닉네임은 2~10자로 입력해주세요.');
            return;
        }

        try {
            const available = await checkNicknameAvailability(trimmedNickname);
            if (available) {
                setCheckedNickname(trimmedNickname);
                alert('사용 가능한 닉네임입니다.');
            } else {
                setCheckedNickname(null);
                alert('이미 사용 중인 닉네임입니다.');
            }
        } catch {
            alert('중복 확인에 실패했어요. 잠시 후 다시 시도해주세요');
        }
    };

    const changeNickname = async (): Promise<void> => {
        const trimmedNickname = nickname.trim();

        if (checkedNickname !== trimmedNickname) {
            alert('닉네임 중복 확인을 해주세요.');
            return;
        }

        try {
            await updateProfile({ nickname: trimmedNickname });
            alert('닉네임이 변경되었습니다.');
        } catch (error: unknown) {
            alert(getApiErrorMessage(error, '닉네임 변경에 실패했어요. 잠시 후 다시 시도해주세요'));
        }
    };

    return { nickname, setNickname, checkNickname, changeNickname };
}