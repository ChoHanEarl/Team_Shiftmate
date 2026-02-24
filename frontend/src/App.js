import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import { theme } from './styles/theme';
import PrivateRoute from './components/common/PrivateRoute';
import FirstPage from './pages/FirstPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

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

                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}