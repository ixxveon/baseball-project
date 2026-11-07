import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import HomeScreen from '../pages/HomeScreen';
import RecommendScreen from '../pages/RecommendScreen';
import RankingPage from '../pages/RankingPage';
import CommunityScreen from '../pages/CommunityScreen';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import MyPage from '../pages/MyPage';
import PrivateRoute from '../components/PrivateRoute';
import OAuthCallbackPage from '../pages/OAuthCallbackPage';
import ProfileEditPage from '../pages/ProfileEditPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';

export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: '/', element: <HomeScreen /> },
            { path: '/recommend', element: <RecommendScreen /> },
            { path: '/ranking', element: <RankingPage /> },
            { path: '/community', element: <CommunityScreen /> },
            { path: '/mypage', element: <PrivateRoute><MyPage /></PrivateRoute> },
            { path: '/profile-edit', element: <PrivateRoute><ProfileEditPage /></PrivateRoute> },
        ],
    },
    { path: '/login', element: <LoginPage /> },
    { path: '/signup', element: <SignupPage /> },
    { path: '/forgot-password', element: <ForgotPasswordPage /> },
    { path: '/oauth/callback', element: <OAuthCallbackPage /> },
]);
