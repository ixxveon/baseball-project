import { useEffect, useState } from 'react';
import { getMyInfo, updateProfile } from '../api/memberApi';
import { getApiErrorMessage } from '../utils/apiError';

interface TeamPreferenceForm {
    favoriteTeamId: number | null;
    setFavoriteTeamId: (teamId: number | null) => void;
    pushAlarm: boolean;
    setPushAlarm: (enabled: boolean) => void;
    savePreference: () => Promise<void>;
}

export function useTeamPreferenceForm(): TeamPreferenceForm {
    const [favoriteTeamId, setFavoriteTeamId] = useState<number | null>(null);
    const [pushAlarm, setPushAlarm] = useState(false);

    useEffect(() => {
        getMyInfo()
            .then((info) => {
                setFavoriteTeamId(info.favoriteTeamId);
                setPushAlarm(info.pushAlarmEnabled);
            })
            .catch(() => {
                alert('내 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요');
            });
    }, []);

    const savePreference = async (): Promise<void> => {
        if (favoriteTeamId === null) {
            alert('최애 구단을 선택해주세요.');
            return;
        }

        try {
            await updateProfile({ favoriteTeamId, pushAlarm });
            alert('설정이 저장되었습니다.');
        } catch (error: unknown) {
            alert(getApiErrorMessage(error, '설정 저장에 실패했어요. 잠시 후 다시 시도해주세요'));
        }
    };

    return { favoriteTeamId, setFavoriteTeamId, pushAlarm, setPushAlarm, savePreference };
}
