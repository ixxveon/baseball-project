import { useEffect, useState } from 'react';
import { getMyInfo, type MyInfoResponse } from '../api/memberApi';

export function useMyInfo(): MyInfoResponse | null {
    const [myInfo, setMyInfo] = useState<MyInfoResponse | null>(null);

    useEffect(() => {
        getMyInfo()
            .then(setMyInfo)
            .catch(() => setMyInfo(null));
    }, []);

    return myInfo;
}