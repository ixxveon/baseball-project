import { Navigate } from 'react-router-dom';
import { getAccessToken } from '../utils/tokenStorage';

interface PrivateRouteProps {
    children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps): React.JSX.Element {
    const isLoggedIn = Boolean(getAccessToken());
    return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
}