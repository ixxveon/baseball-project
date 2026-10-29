import { getAccessToken } from './tokenStorage';

export function getCurrentMemberId(): number | null {
    const token = getAccessToken();
    if (!token) {
        return null;
    }

    try {
        const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const decoded = JSON.parse(atob(payload)) as { sub?: string };
        return decoded.sub ? Number(decoded.sub) : null;
    } catch {
        return null;
    }
}
