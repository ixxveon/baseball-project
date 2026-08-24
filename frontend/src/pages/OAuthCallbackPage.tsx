import {useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {saveAccessToken} from "../utils/tokenStorage";

export default function OAuthCallbackPage(): React.JSX.Element {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('accessToken');

        if (token) {
            saveAccessToken(token);
            navigate('/mypage');
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate]);

    return <p>로그인 처리 중이에요...</p>;
}