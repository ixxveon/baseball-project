import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import MyPage from '../pages/MyPage';

export const router = createBrowserRouter([
    { path: '/', element: <App /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/signup', element: <SignupPage /> },
    { path: '/mypage', element: <MyPage /> },
]);
