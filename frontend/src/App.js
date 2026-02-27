import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import { theme } from './styles/theme';
import PrivateRoute from './components/common/PrivateRoute';
import FirstPage from './pages/FirstPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ShiftPage from './pages/ShiftPage';
import RegisterStorePage from './pages/RegisterStorePage';
import EditStorePage from './pages/EditStorePage';
import AdminPage from './pages/AdminPage';
import MyPage from './pages/MyPage';

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <BrowserRouter>
                <Routes>
                    {/* Landing Page */} 
                    <Route path="/" element={<FirstPage />} />

                    {/* 公開 Route */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* 認証が要る Route (PrivateRoute) */}
                    <Route path="/dashboard" element={
                    <PrivateRoute>
                        <DashboardPage />
                    </PrivateRoute>
                } />
                <Route path="/shifts/:storeNumber" element={
                    <PrivateRoute>
                        <ShiftPage />
                    </PrivateRoute>
                } />

                <Route path="/mypage" element={
                        <PrivateRoute allowedRole="従業員">
                            <MyPage />
                        </PrivateRoute>
                    } />

                <Route path="/register-store" element={
                    <PrivateRoute allowedRole="店長">
                        <RegisterStorePage />
                    </PrivateRoute>
                } />
                <Route path="/edit-store/:storeNumber" element={
                    <PrivateRoute allowedRole="店長">
                        <EditStorePage />
                    </PrivateRoute>
                } />
                <Route path="/admin" element={
                        <PrivateRoute allowedRole="店長">
                            <AdminPage />
                        </PrivateRoute>
                    } />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}