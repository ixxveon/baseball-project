import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import MyPage from '../pages/MyPage';
import PrivateRoute from '../components/PrivateRoute';
import OAuthCallbackPage from '../pages/OAuthCallbackPage';
import ProfileEditPage from '../pages/ProfileEditPage';

export const router = createBrowserRouter([
    { path: '/', element: <App /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/signup', element: <SignupPage /> },
    { path: '/mypage', element: <PrivateRoute><MyPage /></PrivateRoute> },
    { path: '/oauth/callback', element: <OAuthCallbackPage /> },
    { path: '/profile-edit', element: <PrivateRoute> <ProfileEditPage /></PrivateRoute> },
]);
