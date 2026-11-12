import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import HomePage from '../pages/HomePage';
import RecommendPage from '../pages/RecommendPage';
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
            { path: '/', element: <HomePage /> },
            { path: '/recommend', element: <RecommendPage /> },
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