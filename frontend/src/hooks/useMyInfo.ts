import { useEffect, useState } from 'react';
import { getMyInfo, type MyInfoResponse } from '../api/memberApi';
import { getAccessToken } from '../utils/tokenStorage';

export function useMyInfo(): MyInfoResponse | null {
    const [myInfo, setMyInfo] = useState<MyInfoResponse | null>(null);

    useEffect(() => {
        if (!getAccessToken()) return;

        getMyInfo()
            .then(setMyInfo)
            .catch(() => setMyInfo(null));
    }, []);

    return myInfo;
}